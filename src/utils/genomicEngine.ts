import {
  EvidenceLevel,
  GenotypeImpact,
  ImpactLevel,
  OverallAnalysisReport,
  ParsedRawDNA,
  SNPDefinition,
  TraitAnalysisResult,
  TraitCategory,
  TraitDefinition,
  UserSNPResult
} from '../types/genetics';
import { TRAIT_DATABASE } from '../data/snpDatabase';
import { calculateAncestryReport } from '../data/ancestryEngine';
import { getComplementGenotype } from './dnaParser';

/**
 * Finds the matching impact definition for a user genotype against a SNP definition,
 * taking into account forward/reverse order and complementary strand orientation.
 */
export function matchSNPGenotype(
  userGenotypeRaw: string | undefined,
  snpDef: SNPDefinition
): { matchedImpact: GenotypeImpact; matchedKey: string } | null {
  if (!userGenotypeRaw || userGenotypeRaw === '--' || userGenotypeRaw === '00') {
    return null;
  }

  const raw = userGenotypeRaw.toUpperCase().trim();
  const sorted = raw.split('').sort().join('');
  const complementRaw = getComplementGenotype(raw);
  const complementSorted = complementRaw.split('').sort().join('');

  // Potential permutations to check
  const candidates = [
    raw,
    sorted,
    complementRaw,
    complementSorted
  ];

  // If user genotype is single letter (hemizygous e.g. "G" on X chromosome)
  if (raw.length === 1) {
    candidates.push(`${raw}${raw}`);
    candidates.push(getComplementGenotype(raw));
    candidates.push(`${getComplementGenotype(raw)}${getComplementGenotype(raw)}`);
  }

  for (const candidate of candidates) {
    if (snpDef.genotypes[candidate]) {
      return {
        matchedImpact: snpDef.genotypes[candidate],
        matchedKey: candidate
      };
    }
  }

  // Fallback to default impact if specified
  if (snpDef.defaultImpact) {
    return {
      matchedImpact: snpDef.defaultImpact,
      matchedKey: raw
    };
  }

  // Unclassified neutral impact
  return {
    matchedImpact: {
      genotype: raw,
      impact: 'average',
      scoreContribution: 0,
      label: `Genotipo ${raw} (Variante Estándar)`,
      description: 'Genotipo presente en la población de referencia.',
      effectMagnitude: 'Neutral / No patogénico'
    },
    matchedKey: raw
  };
}

/**
 * Evaluates a single Trait with its set of SNPs against the user's parsed genomic map
 */
export function analyzeTrait(
  trait: TraitDefinition,
  userSNPs: Map<string, string>
): TraitAnalysisResult {
  const snpResults: UserSNPResult[] = [];
  let totalScoreContribution = 0;
  let totalWeight = 0;
  let snpsFoundCount = 0;
  let isVariantPresent = false;

  for (const snpDef of trait.snps) {
    const rsidKey = snpDef.rsid.toLowerCase();
    const userGenotype = userSNPs.get(rsidKey);

    if (userGenotype) {
      snpsFoundCount++;
      const match = matchSNPGenotype(userGenotype, snpDef);

      if (match) {
        if (match.matchedImpact.impact === 'variant_present' || match.matchedImpact.scoreContribution > 0.3) {
          isVariantPresent = true;
        }

        // Evidence weight
        let weight = 1.0;
        if (snpDef.evidence === 'high') weight = 1.5;
        else if (snpDef.evidence === 'preliminary') weight = 0.6;

        totalScoreContribution += match.matchedImpact.scoreContribution * weight;
        totalWeight += weight;

        snpResults.push({
          rsid: snpDef.rsid,
          gene: snpDef.gene,
          userGenotype: userGenotype,
          matchedImpact: match.matchedImpact,
          evidence: snpDef.evidence,
          foundInFile: true,
          scientificContext: snpDef.scientificContext,
          pubMedIds: snpDef.pubMedIds
        });
      }
    } else {
      // SNP not covered in this kit
      snpResults.push({
        rsid: snpDef.rsid,
        gene: snpDef.gene,
        userGenotype: '--',
        matchedImpact: {
          genotype: '--',
          impact: trait.type === 'carrier' ? 'variant_absent' : 'average',
          scoreContribution: 0,
          label: 'Marcador no cubierto en el kit',
          description: 'Este marcador no estaba incluido en el chip de genotipado de tu proveedor.',
          effectMagnitude: 'Sin datos'
        },
        evidence: snpDef.evidence,
        foundInFile: false,
        scientificContext: snpDef.scientificContext
      });
    }
  }

  const snpsTotalCount = trait.snps.length;
  const dataCoverage = snpsTotalCount > 0 ? Math.round((snpsFoundCount / snpsTotalCount) * 100) : 0;

  // Normalized score between -1 and +1
  const normalizedScore = totalWeight > 0 ? totalScoreContribution / totalWeight : 0;

  // Calculate percentage probability
  let calculatedProbability: number;
  if (trait.type === 'phenotype') {
    if (normalizedScore >= 0) {
      calculatedProbability = Math.round(
        trait.baselineProbability + (trait.maxProbability - trait.baselineProbability) * normalizedScore
      );
    } else {
      calculatedProbability = Math.round(
        trait.baselineProbability + (trait.baselineProbability - trait.minProbability) * normalizedScore
      );
    }
  } else if (trait.type === 'carrier') {
    calculatedProbability = isVariantPresent ? 100 : 0;
  } else if (trait.type === 'pharmacology') {
    if (normalizedScore >= 0) {
      calculatedProbability = Math.round(
        trait.baselineProbability + (trait.maxProbability - trait.baselineProbability) * normalizedScore
      );
    } else {
      calculatedProbability = Math.round(
        trait.baselineProbability + (trait.baselineProbability - trait.minProbability) * normalizedScore
      );
    }
  } else {
    // Risk / metabolic rate calculation
    if (normalizedScore >= 0) {
      calculatedProbability = Math.round(
        trait.baselineProbability + (trait.maxProbability - trait.baselineProbability) * Math.min(1, normalizedScore * 1.1)
      );
    } else {
      calculatedProbability = Math.round(
        trait.baselineProbability - (trait.baselineProbability - trait.minProbability) * Math.abs(normalizedScore)
      );
    }
  }

  // Bound safely between min and max
  calculatedProbability = Math.max(trait.minProbability, Math.min(trait.maxProbability, calculatedProbability));

  // Determine overall status label & level
  let riskStatus: ImpactLevel = 'average';
  let statusLabel = 'Probabilidad Poblacional Promedio';
  let headlineSummary = '';

  if (trait.type === 'carrier') {
    if (isVariantPresent) {
      riskStatus = 'variant_present';
      statusLabel = 'Variante Presente (Portador)';
      headlineSummary = `Se ha detectado una variante patogénica o de riesgo en el gen ${trait.snps[0]?.gene || ''}.`;
    } else {
      riskStatus = 'variant_absent';
      statusLabel = 'Variante Ausente';
      headlineSummary = `No se detectaron variantes patogénicas en los marcadores evaluados para esta condición.`;
    }
  } else if (trait.type === 'pharmacology') {
    if (normalizedScore > 0.45) {
      riskStatus = 'elevated';
      statusLabel = 'Metabolizador Atípico / Precaución';
      headlineSummary = trait.clinicalRecommendation || 'Se sugiere consideración de ajuste posológico o monitorización clínica.';
    } else if (normalizedScore > 0.15) {
      riskStatus = 'moderate';
      statusLabel = 'Respuesta Intermedia';
      headlineSummary = 'Metabolizador intermedio; tolerabilidad estándar con dosis controlada.';
    } else {
      riskStatus = 'protective';
      statusLabel = 'Metabolizador Normal / Estándar';
      headlineSummary = 'Aclaramiento y respuesta farmacológica convencional esperada.';
    }
  } else if (trait.type === 'phenotype') {
    if (calculatedProbability >= 60) {
      riskStatus = 'trait_present';
      statusLabel = 'Rasgo / Fenotipo Muy Probable';
      headlineSummary = `Tus marcadores genéticos indican una probabilidad del ${calculatedProbability}% para este rasgo físico o metabólico.`;
    } else if (calculatedProbability <= 40) {
      riskStatus = 'trait_absent';
      statusLabel = 'Rasgo Poco Probable';
      headlineSummary = `Tus variantes genéticas favorecen el fenotipo opuesto o basal (${calculatedProbability}%).`;
    } else {
      riskStatus = 'average';
      statusLabel = 'Expresión Intermedia';
      headlineSummary = `Portas variantes combinadas que indican un fenotipo intermedio (${calculatedProbability}%).`;
    }
  } else {
    // Risk & Metabolic
    if (normalizedScore > 0.45 || calculatedProbability >= trait.baselineProbability * 1.5) {
      riskStatus = 'elevated';
      statusLabel = 'Predisposición / Riesgo Elevado';
      headlineSummary = `Se han detectado variantes de impacto significativo (${calculatedProbability}% vs ${trait.baselineProbability}% basal).`;
    } else if (normalizedScore > 0.15 || calculatedProbability > trait.baselineProbability * 1.15) {
      riskStatus = 'moderate';
      statusLabel = 'Predisposición Moderada';
      headlineSummary = `Presentas variantes heterocigotas con leve incremento de susceptibilidad (${calculatedProbability}% vs ${trait.baselineProbability}% basal).`;
    } else if (normalizedScore < -0.25 || calculatedProbability < trait.baselineProbability * 0.75) {
      riskStatus = 'protective';
      statusLabel = 'Variante Protectora / Favorable';
      headlineSummary = `Portas alelos protectores con menor susceptibilidad que el promedio (${calculatedProbability}% vs ${trait.baselineProbability}% basal).`;
    } else {
      riskStatus = 'average';
      statusLabel = 'Riesgo Poblacional Estándar';
      headlineSummary = `Tus marcadores se alinean con la frecuencia genética de referencia poblacional (${calculatedProbability}%).`;
    }
  }

  // Confidence determination
  let confidenceScore: 'alta' | 'media' | 'baja' = 'alta';
  if (dataCoverage === 0) {
    confidenceScore = 'baja';
    statusLabel = 'Sin Marcadores Detectados';
    headlineSummary = 'Tu archivo de ADN no contiene los SNPs específicos para este panel.';
  } else if (dataCoverage < 50) {
    confidenceScore = 'media';
  }

  const detailedAnalysis = generateDetailedText(trait, snpResults, calculatedProbability, riskStatus);

  return {
    trait,
    calculatedProbability,
    baselineProbability: trait.baselineProbability,
    riskStatus,
    statusLabel,
    headlineSummary,
    detailedAnalysis,
    snpsFoundCount,
    snpsTotalCount,
    dataCoverage,
    snpResults,
    confidenceScore,
    isVariantPresent,
    dosageRecommendation: trait.clinicalRecommendation,
    metabolizerStatus: trait.metabolizerGene ? `${trait.metabolizerGene}: ${statusLabel}` : undefined
  };
}

/**
 * Generates an explanatory text paragraph describing the biological outcome
 */
function generateDetailedText(
  trait: TraitDefinition,
  snpResults: UserSNPResult[],
  probability: number,
  status: ImpactLevel
): string {
  const foundSNPs = snpResults.filter(s => s.foundInFile);
  if (foundSNPs.length === 0) {
    return 'No se han encontrado los marcadores genómicos correspondientes a este rasgo en tu archivo suministrado.';
  }

  const snpSummaries = foundSNPs.map(
    s => `${s.gene} (${s.rsid}: ${s.userGenotype} -> ${s.matchedImpact.label})`
  ).join(', ');

  let statusSentence = '';
  if (status === 'elevated') {
    statusSentence = `El análisis multi-locus ponderado señala una propensión por encima de la media poblacional.`;
  } else if (status === 'moderate') {
    statusSentence = `Se observa una tendencia moderada influenciada por la combinación de alelos heterocigotos detectados.`;
  } else if (status === 'protective') {
    statusSentence = `Tus genotipos ejercen un efecto protector o de alta eficiencia enzimática respecto al promedio poblacional.`;
  } else if (status === 'variant_present') {
    statusSentence = `Se identificó la presencia de variantes específicas evaluadas en el gen de interés.`;
  } else if (status === 'variant_absent') {
    statusSentence = `No se detectaron variantes de significación patogénica en los marcadores genotípicos analizados.`;
  } else if (status === 'trait_present') {
    statusSentence = `La combinación alélica analizada expresa una manifestación física o funcional característica.`;
  } else {
    statusSentence = `La interacción de tus marcadores se mantiene dentro del rango basal poblacional sin desviaciones extremas.`;
  }

  return `${statusSentence} Marcadores evaluados: ${snpSummaries}. ${trait.biologicalMechanism}`;
}

/**
 * Runs the full genomic report on an uploaded DNA dataset
 */
export function generateFullGenomicReport(parsedDNA: ParsedRawDNA): OverallAnalysisReport {
  const traitResults: TraitAnalysisResult[] = [];

  const categoryStats: OverallAnalysisReport['categoryStats'] = {
    health_vulnerability: { totalTraits: 0, elevatedCount: 0, moderateCount: 0, averageCount: 0, protectiveCount: 0, variantPresentCount: 0 },
    hereditary_conditions: { totalTraits: 0, elevatedCount: 0, moderateCount: 0, averageCount: 0, protectiveCount: 0, variantPresentCount: 0 },
    pharmacology: { totalTraits: 0, elevatedCount: 0, moderateCount: 0, averageCount: 0, protectiveCount: 0, variantPresentCount: 0 },
    personal_traits: { totalTraits: 0, elevatedCount: 0, moderateCount: 0, averageCount: 0, protectiveCount: 0, variantPresentCount: 0 },
    wellness: { totalTraits: 0, elevatedCount: 0, moderateCount: 0, averageCount: 0, protectiveCount: 0, variantPresentCount: 0 },
    ancestry: { totalTraits: 1, elevatedCount: 0, moderateCount: 0, averageCount: 1, protectiveCount: 0, variantPresentCount: 0 },
    vahaduo: { totalTraits: 1, elevatedCount: 0, moderateCount: 0, averageCount: 1, protectiveCount: 0, variantPresentCount: 0 }
  };

  let totalSNPsMatched = 0;
  const testedSNPsSet = new Set<string>();

  for (const traitDef of TRAIT_DATABASE) {
    const result = analyzeTrait(traitDef, parsedDNA.snps);
    traitResults.push(result);

    for (const snp of traitDef.snps) {
      testedSNPsSet.add(snp.rsid.toLowerCase());
      if (parsedDNA.snps.has(snp.rsid.toLowerCase())) {
        totalSNPsMatched++;
      }
    }

    const cat = traitDef.category;
    if (categoryStats[cat]) {
      categoryStats[cat].totalTraits++;
      if (result.riskStatus === 'elevated' || result.riskStatus === 'trait_present') {
        categoryStats[cat].elevatedCount++;
      } else if (result.riskStatus === 'moderate') {
        categoryStats[cat].moderateCount++;
      } else if (result.riskStatus === 'protective') {
        categoryStats[cat].protectiveCount++;
      } else if (result.riskStatus === 'variant_present') {
        categoryStats[cat].variantPresentCount++;
      } else {
        categoryStats[cat].averageCount++;
      }
    }
  }

  // Calculate Ancestry
  const ancestry = calculateAncestryReport(parsedDNA.snps, parsedDNA);

  return {
    fileMetadata: parsedDNA,
    analysisTimestamp: new Date().toISOString(),
    traitResults,
    ancestry,
    categoryStats,
    totalSNPsMatched,
    totalTestedSNPsInDB: testedSNPsSet.size
  };
}
