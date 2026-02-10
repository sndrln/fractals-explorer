import type { FractalParams } from "../../types/fractal";

export const UI_COLORS = {
  // hybridMorph: "var(--color-danger)",
  power: "var(--color-warning)",
  seed: "var(--color-info)",
  juliaMorph: "var(--color-accent)", // Assuming you added this
  memory: "var(--color-success)",
  iter: "var(--text-primary)",
  default: "var(--color-primary)",
  relaxation: "var(--color-accent)",
  subtrahend: "var(--color-primary)",
  kleinian: "var(--color-info)",
} as const;

export type ColorKey = keyof typeof UI_COLORS;

export const VAR_COLOR_MAP: Record<keyof FractalParams, string> = {
  seedR: UI_COLORS.seed,
  seedI: UI_COLORS.seed,
  power: UI_COLORS.power,
  powerI: UI_COLORS.power,
  powerSecondary: UI_COLORS.power,
  powerSecondaryI: UI_COLORS.power,
  juliaMorph: UI_COLORS.juliaMorph,
  // hybridMorph: UI_COLORS.hybridMorph,
  memoryR: UI_COLORS.memory,
  memoryI: UI_COLORS.memory,
  maxIterations: UI_COLORS.iter,
  relaxation: UI_COLORS.relaxation,
  relaxationI: UI_COLORS.relaxation,
  subtrahend: UI_COLORS.subtrahend,
  subtrahendI: UI_COLORS.subtrahend,
  kleinianBox: UI_COLORS.kleinian,
  kleinianSphere: UI_COLORS.kleinian,
};
