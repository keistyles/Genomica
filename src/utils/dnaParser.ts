import { ParsedRawDNA } from '../types/genetics';

export interface ParseProgressCallback {
  (progressPercent: number, statusMessage: string): void;
}

/**
 * Returns the Watson-Crick complement of a DNA genotype (e.g. "CT" -> "GA", "A" -> "T")
 */
export function getComplementGenotype(genotype: string): string {
  const complementMap: Record<string, string> = {
    'A': 'T',
    'T': 'A',
    'C': 'G',
    'G': 'C',
    'D': 'I',
    'I': 'D'
  };

  return genotype
    .toUpperCase()
    .split('')
    .map(base => complementMap[base] || base)
    .join('');
}

/**
 * Sorts and standardizes genotype string (e.g. "GA" -> "AG")
 */
export function standardizeGenotype(genotype: string): string {
  const clean = genotype.trim().toUpperCase().replace(/[^ATCGID]/g, '');
  if (!clean || clean === '--' || clean === '00' || clean === 'NN' || clean === 'NC') {
    return '--';
  }
  // Hemizygous allele (e.g. X chromosome in male "G")
  if (clean.length === 1) {
    return clean;
  }
  return clean.split('').sort().join('');
}

/**
 * Parses raw text from 23andMe, AncestryDNA, MyHeritage, FamilyTreeDNA, TellmeGen, etc.
 */
export async function parseRawDNAFile(
  fileContent: string,
  fileName: string = 'raw_dna_data.txt',
  onProgress?: ParseProgressCallback
): Promise<ParsedRawDNA> {
  const startTime = performance.now();
  const fileSizeBytes = new Blob([fileContent]).size;

  onProgress?.(5, 'Detectando formato del archivo genómico...');

  // Split lines efficiently
  const lines = fileContent.split(/\r?\n/);
  const totalLines = lines.length;

  let detectedFormat: ParsedRawDNA['format'] = 'Unknown';
  const snps = new Map<string, string>();
  const chromosomesSet = new Set<string>();

  let isHeader = true;
  let isAncestry = false;
  let isMyHeritage = false;
  let is23andMe = false;
  let isFTDNA = false;

  // Diagnostic counters for sex determination
  let validChrYCalls = 0;
  let totalChrYRows = 0;
  let validChrXCalls = 0;
  let heterozygousChrXCalls = 0;

  const chunkSize = Math.max(25000, Math.floor(totalLines / 20));

  for (let i = 0; i < totalLines; i++) {
    const line = lines[i].trim();

    // Skip blank lines
    if (!line) continue;

    // Header inspection
    if (line.startsWith('#')) {
      const low = line.toLowerCase();
      if (low.includes('23andme')) is23andMe = true;
      if (low.includes('ancestry')) isAncestry = true;
      if (low.includes('myheritage')) isMyHeritage = true;
      if (low.includes('familytreedna') || low.includes('ftdna')) isFTDNA = true;
      continue;
    }

    // Check CSV header
    if (isHeader) {
      const lower = line.toLowerCase();
      if (lower.includes('rsid') || lower.includes('chromosome') || lower.includes('position')) {
        if (lower.includes('allele1') && lower.includes('allele2')) {
          isAncestry = true;
        }
        if (line.includes(',') || line.includes('"')) {
          if (lower.includes('ftdna') || lower.includes('family')) isFTDNA = true;
          else isMyHeritage = true;
        }
        isHeader = false;
        continue;
      }
      isHeader = false;
    }

    // Determine delimiters: tab, comma, semicolon, space
    let parts: string[];
    if (line.includes('\t')) {
      parts = line.split('\t');
    } else if (line.includes(',')) {
      // CSV format (might have quotes)
      parts = line.split(',').map(p => p.replace(/^["']|["']$/g, '').trim());
    } else if (line.includes(';')) {
      parts = line.split(';').map(p => p.replace(/^["']|["']$/g, '').trim());
    } else {
      parts = line.split(/\s+/);
    }

    if (parts.length < 4) continue;

    const rawRsid = parts[0].trim().toLowerCase();
    // Only accept valid rsID, i-id or marker ID
    if (!rawRsid.startsWith('rs') && !rawRsid.startsWith('i') && !rawRsid.startsWith('vg') && !rawRsid.startsWith('m')) continue;

    const rawChr = parts[1].trim().toUpperCase().replace(/^CHR/, '');
    const position = parts[2].trim();
    let genotype = '';

    // AncestryDNA format: rsid, chr, pos, allele1, allele2
    if (parts.length >= 5 && isAncestry) {
      const a1 = parts[3].trim().toUpperCase();
      const a2 = parts[4].trim().toUpperCase();
      if (a1 !== '0' && a2 !== '0' && a1 !== '-' && a2 !== '-') {
        genotype = `${a1}${a2}`;
      } else {
        genotype = '--';
      }
    } else if (parts.length === 4) {
      // 23andMe: rsid, chr, pos, genotype
      genotype = parts[3].trim().toUpperCase();
    } else if (parts.length >= 5) {
      // Check if parts[3] and parts[4] are single alleles or parts[3] is already combined
      if (parts[3].length === 1 && parts[4].length === 1) {
        if (parts[3] !== '0' && parts[4] !== '0' && parts[3] !== '-' && parts[4] !== '-') {
          genotype = `${parts[3]}${parts[4]}`;
        } else {
          genotype = '--';
        }
      } else {
        genotype = parts[3];
      }
    }

    // Normalize chromosome label (23 -> X, 24 -> Y, 25 -> XY/PAR, 26 -> MT, M -> MT)
    let normalizedChr = rawChr;
    if (normalizedChr === '23') normalizedChr = 'X';
    else if (normalizedChr === '24') normalizedChr = 'Y';
    else if (normalizedChr === '25') normalizedChr = 'XY';
    else if (normalizedChr === '26' || normalizedChr === 'M') normalizedChr = 'MT';

    // Track Y chromosome probes
    const isYChr = normalizedChr === 'Y';
    const isXChr = normalizedChr === 'X';

    if (isYChr) {
      totalChrYRows++;
    }

    // Clean genotype
    const cleanGenotype = genotype.replace(/[^ATCGID]/g, '');
    const isValidCall = cleanGenotype.length > 0 && cleanGenotype !== '--' && cleanGenotype !== '00' && cleanGenotype !== 'NN' && cleanGenotype !== 'NC' && cleanGenotype !== 'DD';

    if (isValidCall) {
      chromosomesSet.add(normalizedChr);
      snps.set(rawRsid, cleanGenotype);
      
      // Store positional key as well (e.g. "chrY:2186834", "chrMT:7028", "chr1:11856378") for non-rsID lookups
      if (position && !isNaN(Number(position))) {
        snps.set(`chr${normalizedChr}:${position}`, cleanGenotype);
      }

      if (isYChr) {
        validChrYCalls++;
      }

      if (isXChr) {
        validChrXCalls++;
        // Check if heterozygous (2 distinct base pairs e.g. AG, CT)
        if (cleanGenotype.length === 2 && cleanGenotype[0] !== cleanGenotype[1]) {
          heterozygousChrXCalls++;
        }
      }
    }

    // Yield to browser thread periodically for smooth UI update
    if (i > 0 && i % chunkSize === 0 && onProgress) {
      const percent = Math.min(85, Math.round((i / totalLines) * 80) + 5);
      onProgress(percent, `Procesando marcadores genómicos... (${snps.size.toLocaleString()} SNPs indexados)`);
      // Brief tick yield
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  if (is23andMe) detectedFormat = '23andMe';
  else if (isAncestry) detectedFormat = 'AncestryDNA';
  else if (isMyHeritage) detectedFormat = 'MyHeritage';
  else if (isFTDNA) detectedFormat = 'FamilyTreeDNA';
  else if (fileName.toLowerCase().includes('23andme')) detectedFormat = '23andMe';
  else if (fileName.toLowerCase().includes('ancestry')) detectedFormat = 'AncestryDNA';
  else if (fileName.toLowerCase().includes('heritage')) detectedFormat = 'MyHeritage';
  else if (fileName.toLowerCase().includes('ftdna') || fileName.toLowerCase().includes('familytree')) detectedFormat = 'FamilyTreeDNA';
  else detectedFormat = 'Generic_TSV_CSV';

  onProgress?.(95, 'Finalizando validación de genotipos y cromosomas...');

  const endTime = performance.now();

  const chromosomesList = Array.from(chromosomesSet).sort((a, b) => {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });

  // Calculate X chromosome heterozygosity rate
  const chrXHeterozygosityRate = validChrXCalls > 0 ? heterozygousChrXCalls / validChrXCalls : 0;

  // Strict biological sex inference:
  // Male (XY): has called alleles on Chr Y (usually >10) and very low X heterozygosity (~0% because males are hemizygous on non-PAR X)
  // Female (XX): has 0 or near-0 called Y alleles and significant X heterozygosity (>10-30%)
  let inferredSex: ParsedRawDNA['inferredSex'] = 'Indeterminado';
  let sexExplanation = '';

  if (validChrYCalls >= 12) {
    inferredSex = 'Masculino (XY)';
    sexExplanation = `Cariotipo Masculino (XY): Detectados ${validChrYCalls.toLocaleString()} marcadores activos en el cromosoma Y y baja tasa de heterocigosidad en cromosoma X (${(chrXHeterozygosityRate * 100).toFixed(1)}%).`;
  } else if (validChrYCalls <= 3) {
    if (chrXHeterozygosityRate >= 0.05 || validChrXCalls > 50) {
      inferredSex = 'Femenino (XX)';
      sexExplanation = `Cariotipo Femenino (XX): Ausencia de marcadores activos en el cromosoma Y (${validChrYCalls} lecturas residuales) y heterocigosidad normal en el cromosoma X (${(chrXHeterozygosityRate * 100).toFixed(1)}%).`;
    } else {
      inferredSex = 'Femenino (XX)';
      sexExplanation = `Cariotipo Femenino (XX): Cromosoma Y inactivo/ausente.`;
    }
  } else {
    // Edge case between 4 and 11 Y calls (possible noise vs low coverage)
    if (chrXHeterozygosityRate > 0.08) {
      inferredSex = 'Femenino (XX)';
      sexExplanation = `Cariotipo Femenino (XX): Confirmado por heterocigosidad bialélica del cromosoma X (${(chrXHeterozygosityRate * 100).toFixed(1)}%).`;
    } else {
      inferredSex = 'Masculino (XY)';
      sexExplanation = `Cariotipo Masculino (XY): Marcadores de cromosoma Y presentes.`;
    }
  }

  return {
    format: detectedFormat,
    totalSNPs: totalLines,
    validSNPsCount: snps.size,
    snps,
    chromosomesDetected: chromosomesList,
    inferredSex,
    sexInferenceMetrics: {
      validChrYCalls,
      totalChrYRows,
      validChrXCalls,
      heterozygousChrXCalls,
      chrXHeterozygosityRate,
      explanation: sexExplanation
    },
    fileName,
    fileSizeBytes,
    parsingDurationMs: Math.round(endTime - startTime)
  };
}
