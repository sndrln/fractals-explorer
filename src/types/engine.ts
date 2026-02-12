export type QualityLevel = "low" | "medium" | "high" | "ultra" | "custom";

export interface ResolutionConfig {
  label: string;
  width?: number;
  height?: number;
  scale: number;
}
