export type FractalType = "escape" | "newton" | "nova" | "kleinian";

export interface FractalParams {
  maxIterations: number;
  power: number;
  powerI: number;
  seedR: number;
  seedI: number;
  juliaMorph: number;
  // hybridMorph: number;
  memoryR: number;
  memoryI: number;
  subtrahend: number;
  subtrahendI: number;
  relaxation: number;
  relaxationI: number;
  powerSecondary: number;
  powerSecondaryI: number;
  kleinianBox: number;
  kleinianSphere: number;
}

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
