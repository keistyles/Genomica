import {
  G25Sample,
  DistanceResult,
  OracleResult,
  OracleEntry,
  OracleComponent,
  OracleOptions,
  SingleModelResult,
  MultiModelResult,
  DistanceGradientThresholds,
  DEFAULT_GRADIENT_THRESHOLDS
} from '../types/vahaduo';
import { PRESET_DATASETS } from '../data/vahaduoDatasets';

export { PRESET_DATASETS };

/**
 * Standard palette of distinctive colors for G25 populations
 */
export const DEFAULT_G25_PALETTE = [
  '#00e5ff', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1',
  '#84cc16', '#06b6d4', '#eab308', '#d946ef', '#a855f7',
  '#22c55e', '#64748b', '#f43f5e', '#0ea5e9', '#e11d48'
];

/**
 * Parses raw text containing G25 coordinates (comma, tab or space separated)
 */
export function parseG25Coordinates(rawText: string): G25Sample[] {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.split(/\r?\n/);
  const samples: G25Sample[] = [];
  let colorIdx = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    // Skip header line if present
    if (
      line.toLowerCase().includes('pc1') ||
      line.toLowerCase().startsWith('population,') ||
      line.toLowerCase().startsWith('sample,')
    ) {
      continue;
    }

    // Try splitting by comma first, then tab, then whitespace
    let parts: string[] = [];
    if (line.includes(',')) {
      parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
    } else if (line.includes('\t')) {
      parts = line.split('\t').map((p) => p.trim());
    } else {
      parts = line.split(/\s+/).map((p) => p.trim());
    }

    if (parts.length < 2) continue;

    const name = parts[0];
    const coordStrings = parts.slice(1);
    const coords: number[] = [];

    for (const cs of coordStrings) {
      if (coords.length >= 25) break;
      const val = parseFloat(cs);
      if (!isNaN(val)) {
        coords.push(val);
      }
    }

    // Valid G25 coordinate row has 25 dimensions
    if (coords.length === 25) {
      samples.push({
        name,
        coords,
        color: DEFAULT_G25_PALETTE[colorIdx % DEFAULT_G25_PALETTE.length]
      });
      colorIdx++;
    } else if (coords.length > 0 && coords.length < 25) {
      // Pad with zeroes up to 25 if truncated
      while (coords.length < 25) coords.push(0);
      samples.push({
        name,
        coords,
        color: DEFAULT_G25_PALETTE[colorIdx % DEFAULT_G25_PALETTE.length]
      });
      colorIdx++;
    }
  }

  return samples;
}

/**
 * Calculates 25-dimensional Euclidean distance between two coordinate vectors
 * D = sqrt( sum( (A_i - B_i)^2 ) )
 */
export function calculateEuclideanDistance(coordA: number[], coordB: number[]): number {
  let sumSq = 0;
  const len = Math.min(coordA.length, coordB.length, 25);
  for (let i = 0; i < len; i++) {
    const diff = coordA[i] - coordB[i];
    sumSq += diff * diff;
  }
  return Math.sqrt(sumSq);
}

/**
 * Calculates distance ranking from Target samples to Source samples
 */
export function computeG25Distances(
  targets: G25Sample[],
  sources: G25Sample[],
  maxOutput: number = 25
): DistanceResult[] {
  if (!targets.length || !sources.length) return [];

  return targets.map((target) => {
    const items = sources.map((source) => {
      const distance = calculateEuclideanDistance(target.coords, source.coords);
      return {
        sourceName: source.name,
        distance
      };
    });

    // Sort ascending by Euclidean distance
    items.sort((a, b) => a.distance - b.distance);

    return {
      targetName: target.name,
      items: maxOutput > 0 ? items.slice(0, maxOutput) : items
    };
  });
}

/**
 * Formats distance with 8 exact decimals as shown in standard Vahaduo Distance
 */
export function formatDistance8Decimals(d: number): string {
  return d.toFixed(8);
}

/**
 * Returns exact background color and contrasting text color for genetic distance values.
 * Regulated granular transition: Verde -> Amarillo -> Naranja -> Rojo -> Azul
 * Supports customizable thresholds for user regulation.
 */
export function getVahaduoDistanceBadgeStyle(
  d: number,
  thresholds: DistanceGradientThresholds = DEFAULT_GRADIENT_THRESHOLDS
): {
  backgroundColor: string;
  color: string;
  borderColor?: string;
  label?: string;
} {
  const gMax = thresholds.greenMax > 0 ? thresholds.greenMax : 0.015;
  const yMax = thresholds.yellowMax > gMax ? thresholds.yellowMax : gMax + 0.015;
  const oMax = thresholds.orangeMax > yMax ? thresholds.orangeMax : yMax + 0.020;
  const rMax = thresholds.redMax > oMax ? thresholds.redMax : oMax + 0.030;
  const bMax = rMax + (rMax - oMax) * 1.5;

  let r = 34, g = 197, b = 94;
  let textLight = false;

  if (d <= gMax) {
    // Green (#22c55e): rgb(34, 197, 94) -> Lime
    const t = Math.max(0, Math.min(1, d / gMax));
    r = Math.round(34 + t * (84 - 34));
    g = Math.round(197 + t * (210 - 197));
    b = Math.round(94 + t * (50 - 94));
    textLight = false;
  } else if (d <= yMax) {
    // Lime -> Yellow (#eab308: rgb(234, 179, 8))
    const t = Math.max(0, Math.min(1, (d - gMax) / (yMax - gMax)));
    r = Math.round(84 + t * (234 - 84));
    g = Math.round(210 + t * (179 - 210));
    b = Math.round(50 + t * (8 - 50));
    textLight = false;
  } else if (d <= oMax) {
    // Yellow -> Orange (#f97316: rgb(249, 115, 22))
    const t = Math.max(0, Math.min(1, (d - yMax) / (oMax - yMax)));
    r = Math.round(234 + t * (249 - 234));
    g = Math.round(179 + t * (115 - 179));
    b = Math.round(8 + t * (22 - 8));
    textLight = false;
  } else if (d <= rMax) {
    // Orange -> Red (#ef4444: rgb(239, 68, 68))
    const t = Math.max(0, Math.min(1, (d - oMax) / (rMax - oMax)));
    r = Math.round(249 + t * (239 - 249));
    g = Math.round(115 + t * (68 - 115));
    b = Math.round(22 + t * (68 - 22));
    textLight = t > 0.45;
  } else if (d <= bMax) {
    // Red -> Blue (#3b82f6: rgb(59, 130, 246))
    const t = Math.max(0, Math.min(1, (d - rMax) / (bMax - rMax)));
    r = Math.round(239 + t * (59 - 239));
    g = Math.round(68 + t * (130 - 68));
    b = Math.round(68 + t * (246 - 68));
    textLight = true;
  } else {
    // Deep Blue (> bMax)
    r = 59;
    g = 130;
    b = 246;
    textLight = true;
  }

  return {
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    color: textLight ? '#ffffff' : '#000000'
  };
}

/**
 * Formats distance percentage (e.g. 1.2345%)
 */
export function formatDistance(d: number, decimals: number = 4): string {
  return (d * 100).toFixed(decimals);
}

/**
 * Formats raw distance
 */
export function formatRawDistance(d: number): string {
  return (d * 100).toFixed(4);
}

/* =========================================================================
   EXACT SCIENTIFIC LINEAR ALGEBRA & SIMPLEX NNLS OPTIMIZER
   ========================================================================= */

/**
 * Solves the Simplex-Constrained Least Squares problem:
 * min_{w >= 0, sum(w) = 1} || S * w - target ||_2^2
 * using Sequential Minimal Optimization (SMO) Coordinate Descent on the Simplex
 * with Frank-Wolfe Descent Directions.
 *
 * This mathematically guarantees global convergence without ever locking falsely
 * to a single population (100%), matching standard Vahaduo JS / nMonte / CasperHub.
 */
export function solveSimplexNNLS(
  sources: number[][],
  target: number[]
): number[] {
  const K = sources.length;
  if (K === 0) return [];
  if (K === 1) return [1.0];

  // Precompute pairwise squared distances between sources: distSq[i][j] = ||S_j - S_i||^2
  const distSq: number[][] = Array.from({ length: K }, () => new Array(K).fill(0));
  for (let i = 0; i < K; i++) {
    for (let j = i + 1; j < K; j++) {
      let sum = 0;
      for (let d = 0; d < 25; d++) {
        const diff = sources[j][d] - sources[i][d];
        sum += diff * diff;
      }
      distSq[i][j] = sum;
      distSq[j][i] = sum;
    }
  }

  // Precompute dot products S_i . target and S_i . S_j
  const dDotTarget: number[] = new Array(K).fill(0);
  for (let i = 0; i < K; i++) {
    let dot = 0;
    for (let d = 0; d < 25; d++) {
      dot += sources[i][d] * target[d];
    }
    dDotTarget[i] = dot;
  }

  // Helper to calculate exact distance for any weight vector w
  const evaluateDistance = (wVec: number[]): number => {
    let sumSq = 0;
    for (let d = 0; d < 25; d++) {
      let coord = 0;
      for (let i = 0; i < K; i++) {
        if (wVec[i] > 0) coord += wVec[i] * sources[i][d];
      }
      const diff = coord - target[d];
      sumSq += diff * diff;
    }
    return Math.sqrt(sumSq);
  };

  // Run solver from multiple initialization seeds:
  // 1) Uniform distribution across all populations: w_i = 1/K
  // 2) Best single vertex (closest population)
  // 3) Best pairwise blend among top closest populations
  const initialSeeds: number[][] = [];

  // Seed 1: Uniform
  const uniformSeed = new Array(K).fill(1 / K);
  initialSeeds.push(uniformSeed);

  // Find individual distances
  const indivDistances = sources.map((s, idx) => ({
    idx,
    dist: calculateEuclideanDistance(target, s)
  }));
  indivDistances.sort((a, b) => a.dist - b.dist);

  // Seed 2: Best single population
  const singleSeed = new Array(K).fill(0);
  singleSeed[indivDistances[0].idx] = 1.0;
  initialSeeds.push(singleSeed);

  // Seed 3: Best 2-way mixture among top 5 closest
  if (K >= 2) {
    const topN = Math.min(K, 5);
    let bestPairDist = Infinity;
    let bestPairW: number[] | null = null;

    for (let a = 0; a < topN; a++) {
      for (let b = a + 1; b < topN; b++) {
        const i1 = indivDistances[a].idx;
        const i2 = indivDistances[b].idx;
        const s1 = sources[i1];
        const s2 = sources[i2];

        let dotUV = 0;
        let dotVV = 0;
        for (let d = 0; d < 25; d++) {
          const v = s2[d] - s1[d];
          const u = target[d] - s1[d];
          dotUV += u * v;
          dotVV += v * v;
        }

        const alpha = dotVV > 1e-12 ? Math.max(0, Math.min(1, dotUV / dotVV)) : 0.5;
        const pairW = new Array(K).fill(0);
        pairW[i1] = 1 - alpha;
        pairW[i2] = alpha;

        const dist = evaluateDistance(pairW);
        if (dist < bestPairDist) {
          bestPairDist = dist;
          bestPairW = pairW;
        }
      }
    }

    if (bestPairW) initialSeeds.push(bestPairW);
  }

  // Core Coordinate Descent / SMO Optimizer
  const optimizeWeights = (startW: number[]): { weights: number[]; distance: number } => {
    const w = [...startW];

    // Current fitted coordinates: fitted = sum(w_i * S_i)
    const fitted = new Array(25).fill(0);
    for (let i = 0; i < K; i++) {
      if (w[i] > 0) {
        for (let d = 0; d < 25; d++) {
          fitted[d] += w[i] * sources[i][d];
        }
      }
    }

    const maxIterations = Math.max(400, K * 30);
    const tol = 1e-9;

    for (let iter = 0; iter < maxIterations; iter++) {
      // Compute gradient at current point: g_k = S_k . (fitted - target)
      const grad: number[] = new Array(K).fill(0);
      for (let k = 0; k < K; k++) {
        let dot = 0;
        for (let d = 0; d < 25; d++) {
          dot += sources[k][d] * (fitted[d] - target[d]);
        }
        grad[k] = dot;
      }

      // Find the steepest descent candidate j* = argmin grad[j]
      let minGradVal = Infinity;
      let bestJ = 0;
      for (let j = 0; j < K; j++) {
        if (grad[j] < minGradVal) {
          minGradVal = grad[j];
          bestJ = j;
        }
      }

      // Find active component with highest gradient: max grad[i] for w[i] > 0
      let maxActiveGradVal = -Infinity;
      let worstI = -1;
      for (let i = 0; i < K; i++) {
        if (w[i] > 1e-12) {
          if (grad[i] > maxActiveGradVal) {
            maxActiveGradVal = grad[i];
            worstI = i;
          }
        }
      }

      // Check KKT optimality on the simplex: if max active grad - min grad < tol, optimal!
      if (worstI === -1 || maxActiveGradVal - minGradVal < tol) {
        break;
      }

      let maxChange = 0;

      // Primary step: transfer weight from worstI to bestJ
      const denomPrimary = distSq[worstI][bestJ];
      if (denomPrimary > 1e-14) {
        // Optimal delta = (grad[worstI] - grad[bestJ]) / denom
        const deltaOpt = (grad[worstI] - grad[bestJ]) / denomPrimary;
        const delta = Math.max(-w[bestJ], Math.min(w[worstI], deltaOpt));

        if (Math.abs(delta) > 1e-14) {
          w[worstI] -= delta;
          w[bestJ] += delta;
          for (let d = 0; d < 25; d++) {
            fitted[d] += delta * (sources[bestJ][d] - sources[worstI][d]);
          }
          maxChange = Math.max(maxChange, Math.abs(delta));
        }
      }

      // Secondary sweep: check all other active components against bestJ
      for (let i = 0; i < K; i++) {
        if (i !== worstI && i !== bestJ && w[i] > 1e-10) {
          const denom = distSq[i][bestJ];
          if (denom > 1e-14) {
            // Recalculate grad diff
            let gradI = 0;
            let gradJ = 0;
            for (let d = 0; d < 25; d++) {
              gradI += sources[i][d] * (fitted[d] - target[d]);
              gradJ += sources[bestJ][d] * (fitted[d] - target[d]);
            }
            if (gradI > gradJ + 1e-9) {
              const deltaOpt = (gradI - gradJ) / denom;
              const delta = Math.max(0, Math.min(w[i], deltaOpt));
              if (delta > 1e-14) {
                w[i] -= delta;
                w[bestJ] += delta;
                for (let d = 0; d < 25; d++) {
                  fitted[d] += delta * (sources[bestJ][d] - sources[i][d]);
                }
                maxChange = Math.max(maxChange, delta);
              }
            }
          }
        }
      }

      if (maxChange < 1e-12) {
        break;
      }
    }

    // Clean up tiny numerical noise
    let sumW = 0;
    for (let i = 0; i < K; i++) {
      if (w[i] < 1e-8) w[i] = 0;
      sumW += w[i];
    }
    if (sumW > 0) {
      for (let i = 0; i < K; i++) w[i] /= sumW;
    }

    const dist = evaluateDistance(w);
    return { weights: w, distance: dist };
  };

  // Run optimizer across initial seeds and pick the strictly best global minimum
  let bestResult = optimizeWeights(initialSeeds[0]);

  for (let s = 1; s < initialSeeds.length; s++) {
    const res = optimizeWeights(initialSeeds[s]);
    if (res.distance < bestResult.distance - 1e-9) {
      bestResult = res;
    }
  }

  return bestResult.weights;
}

/**
 * Stepwise Backward Elimination ("Reduce" in Vahaduo Admixture JS)
 * Prunes redundant trace populations that contribute negligible fit improvement (<= 0.00015 distance).
 */
function reduceAdmixtureModel(
  targetCoords: number[],
  sources: G25Sample[],
  weights: number[]
): number[] {
  let activeWeights = [...weights];
  const K = sources.length;

  while (true) {
    // Find all indices with non-zero weights
    const nonZeroIndices = activeWeights
      .map((w, idx) => ({ idx, w }))
      .filter((item) => item.w > 0.0005);

    if (nonZeroIndices.length <= 1) break;

    // Current fitted distance
    const currentFitted = new Array(25).fill(0);
    for (let i = 0; i < K; i++) {
      const w = activeWeights[i];
      if (w <= 0) continue;
      for (let d = 0; d < 25; d++) currentFitted[d] += w * sources[i].coords[d];
    }
    const currentDist = calculateEuclideanDistance(targetCoords, currentFitted);

    // Test dropping each non-zero component and re-running Simplex NNLS
    let bestDropIdx = -1;
    let minDeltaDist = Infinity;
    let bestNewWeights: number[] | null = null;

    for (const item of nonZeroIndices) {
      const candidateIdx = item.idx;
      // Mask candidate to 0 and re-optimize on remaining active components
      const remainingIndices = nonZeroIndices
        .filter((el) => el.idx !== candidateIdx)
        .map((el) => el.idx);

      const subSources = remainingIndices.map((idx) => sources[idx].coords);
      const subWeights = solveSimplexNNLS(subSources, targetCoords);

      const subFitted = new Array(25).fill(0);
      for (let s = 0; s < remainingIndices.length; s++) {
        const origIdx = remainingIndices[s];
        const w = subWeights[s];
        if (w <= 0) continue;
        for (let d = 0; d < 25; d++) subFitted[d] += w * sources[origIdx].coords[d];
      }
      const subDist = calculateEuclideanDistance(targetCoords, subFitted);
      const deltaDist = subDist - currentDist;

      if (deltaDist < minDeltaDist) {
        minDeltaDist = deltaDist;
        bestDropIdx = candidateIdx;

        const expanded = new Array(K).fill(0);
        for (let s = 0; s < remainingIndices.length; s++) {
          expanded[remainingIndices[s]] = subWeights[s];
        }
        bestNewWeights = expanded;
      }
    }

    // Vahaduo reduction criterion: prune if delta distance is negligible (<= 0.00015)
    // or if the component weight was a negligible trace (< 0.2%)
    if (bestDropIdx !== -1 && bestNewWeights) {
      const droppedWeight = activeWeights[bestDropIdx];
      if (minDeltaDist <= 0.00015 || droppedWeight < 0.002) {
        activeWeights = bestNewWeights;
        continue;
      }
    }

    // Fit would degrade noticeably: stop pruning
    break;
  }

  return activeWeights;
}

/**
  * Extracts base population name for aggregation.
  * e.g., "Spanish_Andalucia:HG001" -> "Spanish_Andalucia"
  * "French_Paris,1" -> "French_Paris"
  * "Yoruba_Nigeria_1" -> "Yoruba_Nigeria"
  */
export function getPopulationBaseName(name: string): string {
  if (!name) return '';
  const trimmed = name.trim();
  if (trimmed.includes(':')) {
    return trimmed.split(':')[0].trim();
  }
  if (trimmed.includes(',')) {
    return trimmed.split(',')[0].trim();
  }
  const match = trimmed.match(/^(.*?)(?:[_\-#]\d+)$/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return trimmed;
}

/**
 * Aggregates an array of G25 samples by their population base name,
 * calculating the exact arithmetic mean for each of the 25 dimensions.
 */
export function aggregateG25Samples(samples: G25Sample[]): G25Sample[] {
  if (!samples || samples.length === 0) return [];
  const groups = new Map<string, G25Sample[]>();

  for (const sample of samples) {
    const baseName = getPopulationBaseName(sample.name);
    if (!groups.has(baseName)) {
      groups.set(baseName, []);
    }
    groups.get(baseName)!.push(sample);
  }

  const aggregated: G25Sample[] = [];
  for (const [baseName, groupSamples] of groups.entries()) {
    const avgCoords = new Array(25).fill(0);
    const count = groupSamples.length;

    for (const s of groupSamples) {
      for (let d = 0; d < 25; d++) {
        avgCoords[d] += s.coords[d] || 0;
      }
    }

    for (let d = 0; d < 25; d++) {
      avgCoords[d] = parseFloat((avgCoords[d] / count).toFixed(8));
    }

    aggregated.push({
      name: baseName,
      coords: avgCoords,
      color: groupSamples[0]?.color
    });
  }

  return aggregated;
}

/**
 * Aggregates raw G25 formatted text into population averages
 */
export function aggregateG25RawText(rawText: string): string {
  const parsed = parseG25Coordinates(rawText);
  if (parsed.length === 0) return rawText;
  const aggregated = aggregateG25Samples(parsed);
  return aggregated
    .map((s) => `${s.name},${s.coords.map((c) => (Number.isInteger(c) ? c.toString() : c.toFixed(6))).join(',')}`)
    .join('\n');
}

/**
 * Solves Non-Negative Least Squares (NNLS) Admixture modeling
 * for a target sample against a set of source samples.
 */
export function solveG25AdmixtureNNLS(
  target: G25Sample,
  sources: G25Sample[],
  options: {
    cycles?: number;
    reduce?: boolean;
    addDistCol?: boolean;
    printZeroes?: boolean;
    aggregate?: boolean;
    distColScale?: number;
  } = {}
): SingleModelResult {
  // If aggregate option is enabled, group source samples into population averages
  const effectiveSources = options.aggregate ? aggregateG25Samples(sources) : sources;
  const K = effectiveSources.length;
  if (K === 0) {
    return { targetName: target.name, distance: 0, components: [], sum: 0, distColScale: options.distColScale || 1 };
  }

  const sourceCoords = effectiveSources.map((s) => s.coords);

  // Exact Simplex NNLS Solver
  let weights = solveSimplexNNLS(sourceCoords, target.coords);

  // If Reduce option is explicitly enabled, prune trace components
  if (options.reduce) {
    weights = reduceAdmixtureModel(target.coords, effectiveSources, weights);
  }

  // Compute final fitted coordinates and distance
  const finalFitted = new Array(25).fill(0);
  for (let j = 0; j < K; j++) {
    const w = weights[j];
    if (w <= 0) continue;
    for (let d = 0; d < 25; d++) {
      finalFitted[d] += w * effectiveSources[j].coords[d];
    }
  }
  const finalDistance = calculateEuclideanDistance(target.coords, finalFitted);

  // Convert weights to percentage strictly formatted with Largest Remainder Method
  const rawPercents = weights.map((w) => w * 100);

  const roundedInts = rawPercents.map((p) => Math.floor(p * 100));
  const remainders = rawPercents.map((p, idx) => ({ idx, rem: p * 100 - roundedInts[idx] }));
  const currentTotal = roundedInts.reduce((a, b) => a + b, 0);
  const diff = 10000 - currentTotal;

  remainders.sort((a, b) => b.rem - a.rem);
  for (let i = 0; i < diff && i < remainders.length; i++) {
    roundedInts[remainders[i].idx] += 1;
  }

  const finalPercents = roundedInts.map((val) => val / 100);
  const scale = options.distColScale ?? 1.0;

  const components = effectiveSources
    .map((source, idx) => {
      const pct = finalPercents[idx];
      const rawDist = options.addDistCol
        ? calculateEuclideanDistance(target.coords, source.coords)
        : undefined;

      const scaledDist = rawDist !== undefined ? rawDist * scale : undefined;

      return {
        sourceName: source.name,
        percentage: pct,
        color: source.color,
        individualDistance: rawDist,
        scaledDistance: scaledDist
      };
    })
    .filter((c) => (options.printZeroes ? true : c.percentage > 0));

  // Sort descending by percentage
  components.sort((a, b) => b.percentage - a.percentage);

  const finalSum = components.reduce((acc, c) => acc + c.percentage, 0);

  return {
    targetName: target.name,
    distance: finalDistance,
    components,
    sum: parseFloat(finalSum.toFixed(2)),
    distColScale: scale
  };
}

/**
 * Solves N-Way Oracle Mixture Model (2-Way through 10-Way)
 * Fast, accurate, and completely reliable with full Fixed Source Pop & Percentage Range support.
 */
export function solveG25OracleNWay(
  target: G25Sample,
  sources: G25Sample[],
  nWay: number = 2,
  options: OracleOptions = {}
): OracleResult {
  const maxOutput = options.maxOutput ?? 25;
  const K = sources.length;
  if (K === 0) {
    return { targetName: target.name, entries: [] };
  }

  const way = Math.max(1, Math.min(10, nWay));
  const actualWay = Math.min(way, K);

  // Check if Fixed Source Pop is requested and exists
  let fixedSource: G25Sample | null = null;
  let fixedMinW = 0;
  let fixedMaxW = 1;

  if (options.fixedSourcePop && options.fixedSourceName) {
    const found = sources.find((s) => s.name === options.fixedSourceName);
    if (found) {
      fixedSource = found;
      const rawMin = Math.max(0, Math.min(100, options.fixedMinPct ?? 0));
      const rawMax = Math.max(0, Math.min(100, options.fixedMaxPct ?? 100));
      const actualMin = Math.min(rawMin, rawMax);
      const actualMax = Math.max(rawMin, rawMax);
      fixedMinW = actualMin / 100;
      fixedMaxW = actualMax / 100;
      if (fixedMaxW <= 0) fixedMaxW = 1;
    }
  }

  // Filter candidate pool excluding fixed source if present
  const availableSources = fixedSource
    ? sources.filter((s) => s.name !== fixedSource!.name)
    : sources;

  // Rank available sources by Euclidean distance to target
  const rankedSources = availableSources
    .map((s) => ({
      source: s,
      dist: calculateEuclideanDistance(target.coords, s.coords)
    }))
    .sort((a, b) => a.dist - b.dist);

  // 1-Way Special Case: Direct top matching single source
  if (actualWay === 1) {
    const top1: OracleEntry[] = (fixedSource ? [fixedSource] : rankedSources.map((r) => r.source))
      .slice(0, maxOutput)
      .map((s) => {
        const dist = calculateEuclideanDistance(target.coords, s.coords);
        return {
          distance: dist,
          components: [{ sourceName: s.name, percentage: 100.0 }],
          label: `100.00% ${s.name}`
        };
      });
    return {
      targetName: target.name,
      entries: top1
    };
  }

  const neededOthers = fixedSource ? actualWay - 1 : actualWay;
  const entries: OracleEntry[] = [];

  // Helper to generate k-combinations from an array
  function getCombinations<T>(arr: T[], k: number, maxLimit: number = 6000): T[][] {
    const result: T[][] = [];
    function backtrack(start: number, combo: T[]) {
      if (combo.length === k) {
        result.push([...combo]);
        return;
      }
      for (let i = start; i < arr.length; i++) {
        if (result.length >= maxLimit) return;
        combo.push(arr[i]);
        backtrack(i + 1, combo);
        combo.pop();
      }
    }
    backtrack(0, []);
    return result;
  }

  // Helper to solve constrained blend for a subset of samples
  function solveCombination(subset: G25Sample[], isFixedActive: boolean): { distance: number; comps: OracleComponent[] } | null {
    const subsetLen = subset.length;
    if (subsetLen !== actualWay) return null;

    const coords = subset.map((s) => s.coords);

    if (options.iterationMode) {
      // Discrete ratio evaluations
      let bestDist = Infinity;
      let bestWeights: number[] = [];

      // Generate discrete simplex splits for size M
      const splits: number[][] = [];
      if (subsetLen === 2) {
        const stepValues = [0.1, 0.2, 0.25, 0.3333, 0.4, 0.5, 0.6, 0.6667, 0.75, 0.8, 0.9];
        for (const w0 of stepValues) {
          splits.push([w0, 1 - w0]);
        }
      } else if (subsetLen === 3) {
        splits.push([1 / 3, 1 / 3, 1 / 3]);
        const s3 = [
          [0.5, 0.25, 0.25], [0.25, 0.5, 0.25], [0.25, 0.25, 0.5],
          [0.6, 0.2, 0.2], [0.2, 0.6, 0.2], [0.2, 0.2, 0.6],
          [0.4, 0.4, 0.2], [0.4, 0.2, 0.4], [0.2, 0.4, 0.4],
          [0.7, 0.15, 0.15], [0.15, 0.7, 0.15], [0.15, 0.15, 0.7]
        ];
        splits.push(...s3);
      } else if (subsetLen === 4) {
        splits.push([0.25, 0.25, 0.25, 0.25]);
        splits.push(
          [0.4, 0.2, 0.2, 0.2], [0.2, 0.4, 0.2, 0.2], [0.2, 0.2, 0.4, 0.2], [0.2, 0.2, 0.2, 0.4],
          [0.5, 0.2, 0.15, 0.15], [0.15, 0.5, 0.2, 0.15], [0.15, 0.15, 0.5, 0.2], [0.2, 0.15, 0.15, 0.5]
        );
      } else {
        const equalW = 1 / subsetLen;
        splits.push(new Array(subsetLen).fill(equalW));
        for (let idx = 0; idx < subsetLen; idx++) {
          const arr = new Array(subsetLen).fill(0.5 / (subsetLen - 1));
          arr[idx] = 0.5;
          splits.push(arr);
        }
      }

      for (const split of splits) {
        if (isFixedActive) {
          const wFixed = split[0];
          if (wFixed < fixedMinW - 0.01 || wFixed > fixedMaxW + 0.01) continue;
        }

        const blend = new Array(25).fill(0);
        for (let idx = 0; idx < subsetLen; idx++) {
          for (let d = 0; d < 25; d++) {
            blend[d] += split[idx] * coords[idx][d];
          }
        }
        const dist = calculateEuclideanDistance(target.coords, blend);
        if (dist < bestDist) {
          bestDist = dist;
          bestWeights = [...split];
        }
      }

      if (bestWeights.length === 0) return null;

      const rawPercents = bestWeights.map((w) => w * 100);
      const roundedInts = rawPercents.map((p) => Math.floor(p * 100));
      const remainders = rawPercents.map((p, idx) => ({ idx, rem: p * 100 - roundedInts[idx] }));
      const currentTotal = roundedInts.reduce((a, b) => a + b, 0);
      const diff = 10000 - currentTotal;
      remainders.sort((a, b) => b.rem - a.rem);
      for (let i = 0; i < diff && i < remainders.length; i++) {
        roundedInts[remainders[i].idx] += 1;
      }
      const finalPercents = roundedInts.map((val) => val / 100);

      const comps = subset.map((s, idx) => ({
        sourceName: s.name,
        percentage: finalPercents[idx]
      })).filter((c) => c.percentage >= 0.05);

      if (comps.length !== actualWay) {
        return null;
      }

      if (isFixedActive) {
        const fixedComp = comps.find((c) => c.sourceName === subset[0].name);
        if (!fixedComp) return null;
        if (fixedComp.percentage < (fixedMinW * 100 - 0.1) || fixedComp.percentage > (fixedMaxW * 100 + 0.1)) {
          return null;
        }
      }

      comps.sort((a, b) => b.percentage - a.percentage);

      return { distance: bestDist, comps };
    }

    // Continuous Simplex NNLS Solver with Range Constraints
    let weights: number[];

    if (isFixedActive) {
      // Step 1: Unconstrained Simplex solve
      const unconstrained = solveSimplexNNLS(coords, target.coords);
      const w0 = unconstrained[0];

      if (w0 >= fixedMinW && w0 <= fixedMaxW) {
        weights = unconstrained;
      } else {
        // Clamp fixed pop to bound
        const clampedW0 = Math.max(fixedMinW, Math.min(fixedMaxW, w0));
        const remW = 1 - clampedW0;

        if (remW <= 1e-6) {
          weights = new Array(subsetLen).fill(0);
          weights[0] = 1;
        } else if (subsetLen === 1) {
          weights = [1];
        } else {
          // Adjust target for remaining components
          const otherCoords = coords.slice(1);
          const adjTarget = new Array(25);
          for (let d = 0; d < 25; d++) {
            adjTarget[d] = (target.coords[d] - clampedW0 * coords[0][d]) / remW;
          }
          const otherWeights = solveSimplexNNLS(otherCoords, adjTarget);
          weights = [clampedW0, ...otherWeights.map((w) => w * remW)];
        }
      }
    } else {
      weights = solveSimplexNNLS(coords, target.coords);
    }

    // Compute fitted coords and euclidean distance
    const fitted = new Array(25).fill(0);
    for (let idx = 0; idx < subsetLen; idx++) {
      const w = weights[idx];
      if (w <= 0) continue;
      for (let d = 0; d < 25; d++) {
        fitted[d] += w * coords[idx][d];
      }
    }
    const distance = calculateEuclideanDistance(target.coords, fitted);

    // Format weights strictly with Largest Remainder Method summing to 100.00%
    const rawPercents = weights.map((w) => w * 100);
    const roundedInts = rawPercents.map((p) => Math.floor(p * 100));
    const remainders = rawPercents.map((p, idx) => ({ idx, rem: p * 100 - roundedInts[idx] }));
    const currentTotal = roundedInts.reduce((a, b) => a + b, 0);
    const diff = 10000 - currentTotal;
    remainders.sort((a, b) => b.rem - a.rem);
    for (let i = 0; i < diff && i < remainders.length; i++) {
      roundedInts[remainders[i].idx] += 1;
    }
    const finalPercents = roundedInts.map((val) => val / 100);

    const comps = subset.map((s, idx) => ({
      sourceName: s.name,
      percentage: finalPercents[idx]
    })).filter((c) => c.percentage >= 0.05);

    // Strictly ensure all requested N populations are active and non-zero
    if (comps.length !== actualWay) {
      return null;
    }

    if (isFixedActive) {
      const fixedComp = comps.find((c) => c.sourceName === subset[0].name);
      if (!fixedComp) return null;
      if (fixedComp.percentage < (fixedMinW * 100 - 0.1) || fixedComp.percentage > (fixedMaxW * 100 + 0.1)) {
        return null;
      }
    }

    // In N-way Oracle, sort components descending by percentage
    comps.sort((a, b) => b.percentage - a.percentage);

    return { distance, comps };
  }

  // Determine candidate pool size based on N-Way to balance speed and accuracy
  let candidatePoolSize = 40;
  if (neededOthers === 1) candidatePoolSize = Math.min(rankedSources.length, 60);
  else if (neededOthers === 2) candidatePoolSize = Math.min(rankedSources.length, 36);
  else if (neededOthers === 3) candidatePoolSize = Math.min(rankedSources.length, 24);
  else if (neededOthers === 4) candidatePoolSize = Math.min(rankedSources.length, 18);
  else if (neededOthers === 5) candidatePoolSize = Math.min(rankedSources.length, 15);
  else candidatePoolSize = Math.min(rankedSources.length, 12);

  const candidatePool = rankedSources.slice(0, candidatePoolSize).map((r) => r.source);

  if (neededOthers <= 4) {
    // Exact combinatorial enumeration on candidate pool
    const otherCombos = getCombinations(candidatePool, neededOthers, 5000);

    for (const otherSubset of otherCombos) {
      const fullSubset = fixedSource ? [fixedSource, ...otherSubset] : otherSubset;
      const res = solveCombination(fullSubset, Boolean(fixedSource));
      if (!res || res.comps.length !== actualWay) continue;

      const label = res.comps.map((c) => `${c.percentage.toFixed(2)}% ${c.sourceName}`).join(' + ');
      entries.push({
        distance: res.distance,
        components: res.comps,
        label
      });
    }
  } else {
    // Forward-selection / beam search for 5-Way to 10-Way
    const subsetCombos: G25Sample[][] = [];
    const seedPool = candidatePool.slice(0, Math.min(candidatePool.length, 12));

    for (let a = 0; a < seedPool.length; a++) {
      for (let b = a + 1; b < seedPool.length; b++) {
        const cur: G25Sample[] = [seedPool[a], seedPool[b]];
        const used = new Set<string>([seedPool[a].name, seedPool[b].name]);

        while (cur.length < neededOthers) {
          let bestCand: G25Sample | null = null;
          let bestDist = Infinity;

          for (const cand of candidatePool) {
            if (used.has(cand.name)) continue;
            const trial = fixedSource ? [fixedSource, ...cur, cand] : [...cur, cand];
            const testCoords = trial.map((s) => s.coords);
            const w = solveSimplexNNLS(testCoords, target.coords);
            const blend = new Array(25).fill(0);
            for (let idx = 0; idx < trial.length; idx++) {
              for (let d = 0; d < 25; d++) blend[d] += w[idx] * testCoords[idx][d];
            }
            const d = calculateEuclideanDistance(target.coords, blend);
            if (d < bestDist) {
              bestDist = d;
              bestCand = cand;
            }
          }

          if (bestCand) {
            cur.push(bestCand);
            used.add(bestCand.name);
          } else {
            break;
          }
        }

        if (cur.length === neededOthers) {
          subsetCombos.push(cur);
        }
      }
    }

    for (const otherSubset of subsetCombos) {
      const fullSubset = fixedSource ? [fixedSource, ...otherSubset] : otherSubset;
      const res = solveCombination(fullSubset, Boolean(fixedSource));
      if (!res || res.comps.length !== actualWay) continue;

      const label = res.comps.map((c) => `${c.percentage.toFixed(2)}% ${c.sourceName}`).join(' + ');
      entries.push({
        distance: res.distance,
        components: res.comps,
        label
      });
    }
  }

  // Deduplicate entries by label
  const seen = new Set<string>();
  const uniqueEntries: OracleEntry[] = [];
  for (const entry of entries) {
    if (!seen.has(entry.label) && entry.components.length === actualWay) {
      seen.add(entry.label);
      uniqueEntries.push(entry);
    }
  }

  // Sort ascending by distance
  uniqueEntries.sort((a, b) => a.distance - b.distance);

  return {
    targetName: target.name,
    entries: uniqueEntries.slice(0, maxOutput)
  };
}

function choose(n: number, k: number): number {
  if (k === 0) return 1;
  return (n * choose(n - 1, k - 1)) / k;
}

/**
 * Solves batch multi-target admixture matrix for the MULTI tab
 */
export function solveG25MultiAdmixture(
  targets: G25Sample[],
  sources: G25Sample[],
  options: {
    cycles?: number;
    reduce?: boolean;
    aggregate?: boolean;
    addDistCol?: boolean;
    distColScale?: number;
  } = {}
): MultiModelResult {
  const effectiveSources = options.aggregate ? aggregateG25Samples(sources) : sources;
  const targetNames = targets.map((t) => t.name);
  const sourceNames = effectiveSources.map((s) => s.name);

  const matrix = targets.map((target) => {
    const res = solveG25AdmixtureNNLS(target, effectiveSources, {
      ...options,
      printZeroes: true
    });
    const values: Record<string, number> = {};
    const distances: Record<string, number> = {};

    for (const sName of sourceNames) {
      const found = res.components.find((c) => c.sourceName === sName);
      values[sName] = found ? found.percentage : 0.0;
      if (options.addDistCol && found && found.scaledDistance !== undefined) {
        distances[sName] = found.scaledDistance;
      }
    }

    return {
      targetName: target.name,
      distance: res.distance,
      values,
      distances: options.addDistCol ? distances : undefined
    };
  });

  return {
    targetNames,
    sourceNames,
    matrix
  };
}

/**
 * Advanced query parser for Vahaduo DATA tab:
 * Supports `!term` (exclusion), `?term` (fuzzy/prefix), spaces (AND), commas (OR).
 */
export function filterG25DatasetText(rawG25Text: string, query: string): string {
  if (!query || !query.trim()) return rawG25Text;

  const lines = rawG25Text.split(/\r?\n/);
  const terms = query.trim().split(/\s+/).filter(Boolean);

  const matchedLines = lines.filter((line) => {
    if (!line.trim() || line.startsWith('#')) return true; // keep comments

    const popName = line.split(',')[0].trim().toLowerCase();

    for (const term of terms) {
      const cleanTerm = term.toLowerCase();

      // Negation: !term
      if (cleanTerm.startsWith('!')) {
        const notTerm = cleanTerm.slice(1);
        if (notTerm && popName.includes(notTerm)) {
          return false;
        }
      }
      // Prefix/fuzzy: ?term
      else if (cleanTerm.startsWith('?')) {
        const fuzzyTerm = cleanTerm.slice(1);
        if (fuzzyTerm && !popName.startsWith(fuzzyTerm) && !popName.includes(fuzzyTerm)) {
          return false;
        }
      }
      // Regular search
      else {
        if (!popName.includes(cleanTerm)) {
          return false;
        }
      }
    }

    return true;
  });

  return matchedLines.join('\n');
}

export const DEFAULT_SOURCE_COORDS = PRESET_DATASETS.length > 0 ? PRESET_DATASETS[0].rawG25Text : '';

export const DEFAULT_TARGET_COORDS = '';
