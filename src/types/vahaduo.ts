export interface G25Sample {
  name: string;
  coords: number[]; // exactly 25 numbers
  color?: string; // custom hex color for single/pie chart
}

export type VahaduoTab = 'DATA' | 'SOURCE' | 'TARGET' | 'DISTANCE' | 'ORACLE' | 'SINGLE' | 'MULTI' | 'PCA';

export interface DistanceItem {
  sourceName: string;
  distance: number;
  pctSim?: number;
}

export interface DistanceResult {
  targetName: string;
  items: DistanceItem[];
}

export interface DistanceGradientThresholds {
  greenMax: number;   // e.g. 0.015
  yellowMax: number;  // e.g. 0.030
  orangeMax: number;  // e.g. 0.050
  redMax: number;     // e.g. 0.080
}

export const DEFAULT_GRADIENT_THRESHOLDS: DistanceGradientThresholds = {
  greenMax: 0.015,
  yellowMax: 0.030,
  orangeMax: 0.050,
  redMax: 0.080
};

export interface OracleOptions {
  maxOutput?: number;
  iterationMode?: boolean;
  fixedSourcePop?: boolean;
  fixedSourceName?: string;
  fixedMinPct?: number; // e.g. 0 to 100
  fixedMaxPct?: number; // e.g. 0 to 100
}

export interface OracleComponent {
  sourceName: string;
  percentage: number; // 0 to 100
}

export interface OracleEntry {
  distance: number;
  components: OracleComponent[];
  label: string;
}

export interface OracleResult {
  targetName: string;
  entries: OracleEntry[];
}

export interface SingleAdmixtureComponent {
  sourceName: string;
  percentage: number; // e.g. 71.00
  color?: string;
  individualDistance?: number;
  scaledDistance?: number;
}

export interface SingleModelResult {
  targetName: string;
  distance: number;
  components: SingleAdmixtureComponent[];
  sum: number; // exactly 100.00
  distColScale?: number;
}

export interface MultiModelMatrixRow {
  targetName: string;
  distance: number;
  values: Record<string, number>; // sourceName -> percentage (e.g. 71.00)
  distances?: Record<string, number>; // individual distance per source if enabled
}

export interface MultiModelResult {
  targetNames: string[];
  sourceNames: string[];
  matrix: MultiModelMatrixRow[];
}

export interface PresetDataset {
  id: string;
  name: string;
  category: string;
  description: string;
  sampleCount: number;
  rawG25Text: string;
}
