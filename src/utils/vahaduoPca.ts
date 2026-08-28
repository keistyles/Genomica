import { G25Sample } from '../types/vahaduo';

export interface Point2D {
  x: number;
  y: number;
}

export interface PcaPopulationGroup {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  samples: G25Sample[];
  points: Point2D[];
  centroid: Point2D;
  hull: Point2D[];
}

/**
 * 2D Convex Hull algorithm using Andrew's Monotone Chain (O(n log n)).
 * Returns the counter-clockwise convex polygon vertices.
 */
export function computeConvexHull(points: Point2D[]): Point2D[] {
  if (points.length <= 2) return [...points];

  // 1. Sort points lexicographically by x, then y
  const sorted = [...points].sort((a, b) => {
    if (Math.abs(a.x - b.x) > 1e-9) return a.x - b.x;
    return a.y - b.y;
  });

  // Cross product of OA and OB vectors: (A.x - O.x)*(B.y - O.y) - (A.y - O.y)*(B.x - O.x)
  // > 0 means counter-clockwise turn, <= 0 means clockwise or collinear turn
  const crossProduct = (o: Point2D, a: Point2D, b: Point2D): number => {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  };

  // 2. Build lower hull
  const lower: Point2D[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  // 3. Build upper hull
  const upper: Point2D[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  // Remove the last point of each half because it is repeated at the beginning of the other half
  lower.pop();
  upper.pop();

  return lower.concat(upper);
}

/**
 * Generate a deterministic vibrant color palette for population groups.
 */
const VIBRANT_PALETTE = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#14b8a6', // Teal
  '#6366f1', // Indigo
  '#d946ef', // Fuchsia
  '#e11d48', // Rose
  '#0284c7', // Sky
  '#16a34a', // Green
  '#ca8a04', // Yellow
  '#9333ea', // Purple
  '#c026d3', // Magenta
  '#059669', // Dark Emerald
  '#ea580c'  // Burnt Orange
];

export function getDeterministicColor(name: string, index: number): string {
  // If index is in range, use palette
  if (index < VIBRANT_PALETTE.length) {
    return VIBRANT_PALETTE[index];
  }
  // Otherwise generate a nice HSL color using hash
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 75%, 52%)`;
}

/**
 * Extract population group key from sample name.
 * Handles formats like "Spanish:Sample1", "Spanish_North:1", "Yamnaya_Samara", "PopName_(n=8)", etc.
 */
export function getPopulationGroupKey(sampleName: string, groupByPrefix: boolean = true): string {
  if (!groupByPrefix) return sampleName;
  
  // 1. If sample has colon separator: "Population:Individual"
  if (sampleName.includes(':')) {
    return sampleName.split(':')[0].trim();
  }

  // 2. Remove sample count suffix like _(n=8) or _(n=12)
  let clean = sampleName.replace(/_\(n=\d+.*\)$/i, '').trim();

  // 3. If sample has an underscore separating population from numeric/individual ID (e.g. Spanish_Castilla_1)
  const parts = clean.split('_');
  if (parts.length > 1 && /^\d+$/.test(parts[parts.length - 1])) {
    return parts.slice(0, -1).join('_');
  }

  return clean;
}

/**
 * Build population groups from samples for given X & Y PC indices.
 */
export function buildPcaPopulationGroups(
  samples: G25Sample[],
  xDimIndex: number = 0,
  yDimIndex: number = 1,
  groupByPrefix: boolean = true,
  customColors: Record<string, string> = {}
): PcaPopulationGroup[] {
  const map = new Map<string, G25Sample[]>();

  for (const sample of samples) {
    const key = getPopulationGroupKey(sample.name, groupByPrefix);
    const list = map.get(key) || [];
    list.push(sample);
    map.set(key, list);
  }

  const groups: PcaPopulationGroup[] = [];
  let index = 0;

  for (const [groupName, groupSamples] of map.entries()) {
    const points: Point2D[] = groupSamples.map((s) => ({
      x: s.coords[xDimIndex] !== undefined ? s.coords[xDimIndex] : 0,
      y: s.coords[yDimIndex] !== undefined ? s.coords[yDimIndex] : 0
    }));

    // Calculate centroid
    let sumX = 0;
    let sumY = 0;
    for (const p of points) {
      sumX += p.x;
      sumY += p.y;
    }
    const count = points.length || 1;
    const centroid: Point2D = {
      x: sumX / count,
      y: sumY / count
    };

    // Calculate Convex Hull
    const hull = computeConvexHull(points);

    // Color resolution
    const color = customColors[groupName] || groupSamples[0]?.color || getDeterministicColor(groupName, index);

    groups.push({
      id: `pop_${groupName}`,
      name: groupName,
      color,
      visible: true,
      samples: groupSamples,
      points,
      centroid,
      hull
    });

    index++;
  }

  return groups;
}
