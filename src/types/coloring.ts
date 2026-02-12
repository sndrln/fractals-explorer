export type ColoringMode =
  | "DEFAULT"
  | "ORBIT_TRAP"
  | "CURVATURE"
  | "STRIPES"
  | "GRID"
  | "DELTA"
  | "STALKS"
  | "BINARY"
  | "EXP";

export interface Palette {
  brightness: number[];
  contrast: number[];
  osc: number[];
  phase: number[];
}
