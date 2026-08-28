export type TraitCategory =
  | 'health_vulnerability'
  | 'hereditary_conditions'
  | 'pharmacology'
  | 'personal_traits'
  | 'wellness'
  | 'ancestry'
  | 'vahaduo';

export type ImpactLevel =
  | 'protective'
  | 'average'
  | 'moderate'
  | 'elevated'
  | 'trait_present'
  | 'trait_absent'
  | 'variant_present'
  | 'variant_absent';

export type EvidenceLevel = 'high' | 'moderate' | 'preliminary';

export interface GenotypeImpact {
  genotype: string; // e.g. "AA", "AG", "GG", "CT", "TT", "C", "T", "II", "DD"
  impact: ImpactLevel;
  scoreContribution: number; // -1 to 1 scale
  label: string; // e.g. "Metabolizador Lento", "Mayor producción de sebo", "Ojos Azules"
  description: string;
  effectMagnitude: string; // e.g. "1.7x riesgo", "Efecto recesivo", "Reducción del 65% actividad"
  populationFrequency?: string; // e.g. "~34% en población europea"
}

export interface SNPDefinition {
  rsid: string; // e.g. "rs1801133"
  gene: string; // e.g. "MTHFR"
  chromosome: string; // e.g. "1"
  position?: number;
  name: string; // e.g. "C677T (Folato/Metilación)"
  riskAllele?: string; // e.g. "T" or "A"
  referenceAllele?: string; // e.g. "C" or "G"
  strand?: '+' | '-';
  evidence: EvidenceLevel;
  summary: string;
  scientificContext: string;
  genotypes: Record<string, GenotypeImpact>;
  defaultImpact?: GenotypeImpact;
  pubMedIds?: string[];
  snpediaUrl?: string;
}

export interface TraitDefinition {
  id: string;
  title: string;
  category: TraitCategory;
  categoryLabel: string;
  description: string;
  biologicalMechanism: string;
  lifestyleInsights: string[];
  snps: SNPDefinition[];
  baselineProbability: number; // e.g. 5%
  minProbability: number;
  maxProbability: number;
  unit?: string;
  type: 'risk' | 'phenotype' | 'metabolic_speed' | 'carrier' | 'pharmacology';
  
  // Specific fields for Hereditary conditions
  inheritanceMode?: 'Autosómica recesiva' | 'Autosómica dominante' | 'Ligada al cromosoma X' | 'Mitocondrial';
  
  // Specific fields for Pharmacology
  pharmacologicalGroup?: string; // e.g. "Antidepresivos", "Antipsicóticos", "Hipolipemiantes", "Antineoplásicos"
  drugName?: string; // e.g. "Escitalopram", "Simvastatina"
  clinicalRecommendation?: string; // e.g. "Ajuste de dosis inicial requerido", "Mayor riesgo de miopatía"
  metabolizerGene?: string; // e.g. "CYP2D6", "CYP2C19", "SLCO1B1"
}

export interface UserSNPResult {
  rsid: string;
  gene: string;
  userGenotype: string;
  matchedImpact: GenotypeImpact;
  evidence: EvidenceLevel;
  foundInFile: boolean;
  scientificContext: string;
  pubMedIds?: string[];
}

export interface TraitAnalysisResult {
  trait: TraitDefinition;
  calculatedProbability: number; // 0 to 100 %
  baselineProbability: number;
  riskStatus: ImpactLevel;
  statusLabel: string;
  headlineSummary: string;
  detailedAnalysis: string;
  snpsFoundCount: number;
  snpsTotalCount: number;
  dataCoverage: number; // 0 to 100%
  snpResults: UserSNPResult[];
  confidenceScore: 'alta' | 'media' | 'baja';
  
  // Carrier & Pharma specific evaluated fields
  isVariantPresent?: boolean;
  dosageRecommendation?: string;
  metabolizerStatus?: string;
}

export interface ParsedRawDNA {
  format: '23andMe' | 'AncestryDNA' | 'MyHeritage' | 'FamilyTreeDNA' | 'Generic_TSV_CSV' | 'Unknown';
  totalSNPs: number;
  validSNPsCount: number;
  snps: Map<string, string>; // rsid -> genotype
  chromosomesDetected: string[];
  fileName: string;
  fileSizeBytes: number;
  parsingDurationMs: number;
  buildVersion?: string;
  inferredSex?: 'Femenino (XX)' | 'Masculino (XY)' | 'Indeterminado';
  sexInferenceMetrics?: {
    validChrYCalls: number;
    totalChrYRows: number;
    validChrXCalls: number;
    heterozygousChrXCalls: number;
    chrXHeterozygosityRate: number;
    explanation: string;
  };
}

// Ancestry Specific Interfaces
export interface AncestrySubRegion {
  name: string;
  percentage: number;
}

export interface AncestryRegion {
  id: string;
  name: string;
  percentage: number;
  color: string;
  subRegions: AncestrySubRegion[];
  description: string;
}

export interface MigrationStep {
  step: string;
  period: string;
  region: string;
  description: string;
}

export interface MaternalLineage {
  haplogroup: string;
  subHaplogroup: string;
  originDate: string;
  originLocation: string;
  description: string;
  migrationPath: MigrationStep[];
  definingMarkers: string[];
}

export interface PaternalLineage {
  isFemaleXX: boolean;
  haplogroup?: string;
  subHaplogroup?: string;
  originDate?: string;
  originLocation?: string;
  description?: string;
  migrationPath?: MigrationStep[];
  definingMarkers?: string[];
  femaleMessage?: string;
}

export interface NeanderthalAncestry {
  percentage: number;
  variantCount: number;
  totalAnalyzedVariants: number;
  percentileComparedToAvg: number;
  description: string;
  historicalEra: string;
  traitsInherited: string[];
}

export interface AncestryAnalysisReport {
  regions: AncestryRegion[];
  maternal: MaternalLineage;
  paternal: PaternalLineage;
  neanderthal: NeanderthalAncestry;
}

export interface OverallAnalysisReport {
  fileMetadata: ParsedRawDNA;
  analysisTimestamp: string;
  traitResults: TraitAnalysisResult[];
  ancestry: AncestryAnalysisReport;
  categoryStats: Record<TraitCategory, {
    totalTraits: number;
    elevatedCount: number;
    moderateCount: number;
    averageCount: number;
    protectiveCount: number;
    variantPresentCount: number;
  }>;
  totalSNPsMatched: number;
  totalTestedSNPsInDB: number;
}
