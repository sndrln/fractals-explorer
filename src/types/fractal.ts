import type { Palette } from "./ui";

export type FractalType = "escape" | "newton" | "nova";

export interface FractalParams {
  maxIterations: number;
  power: number;
  powerI: number;
  seedR: number;
  seedI: number;
  juliaMorph: number;
  memoryR: number;
  memoryI: number;
  subtrahend: number;
  subtrahendI: number;
  relaxation: number;
  relaxationI: number;
  powerSecondary: number;
  powerSecondaryI: number;
  dampingR: number;
  dampingI: number;
}

export interface FractalState {
  type: FractalType;
  zoom: number;
  offsetX: number;
  offsetY: number;
  params: Record<string, number>;
  palette: Palette;
}

export interface Preset extends FractalState {
  id: string;
  name: string;
  description?: string;
}

export type MemoryMode =
  | "NONE"
  | "ABS_BOTH"
  | "ABS_X"
  | "ABS_Y"
  | "CONJUGATE"
  | "REVERSE"
  | "INVERT"
  | "SIN"
  | "COS"
  | "TAN"
  | "EXP"
  | "RECIPROCAL"
  | "POW3"
  | "FOLD"
  | "SWIZZLE";
