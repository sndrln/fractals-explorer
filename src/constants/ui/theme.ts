import type { ParameterUnitId } from "../../types/parameter";

export const UI_COLORS = {
  power: "var(--color-warning)",
  seed: "var(--color-info)",
  juliaMorph: "var(--color-accent)",
  memory: "var(--color-success)",
  iter: "var(--text-primary)",
  default: "var(--color-primary)",
  relaxation: "var(--color-accent)",
  subtrahend: "var(--color-primary)",
  kleinian: "var(--color-info)",
} as const;

export type ColorKey = keyof typeof UI_COLORS;

export const PARAMETER_COLOR_MAP: Record<ParameterUnitId, string> = {
  seedR: UI_COLORS.seed,
  seedI: UI_COLORS.seed,
  power: UI_COLORS.power,
  powerI: UI_COLORS.power,
  powerSecondary: UI_COLORS.power,
  powerSecondaryI: UI_COLORS.power,
  juliaMorph: UI_COLORS.juliaMorph,
  memoryR: UI_COLORS.memory,
  memoryI: UI_COLORS.memory,
  relaxation: UI_COLORS.relaxation,
  relaxationI: UI_COLORS.relaxation,
  subtrahend: UI_COLORS.subtrahend,
  subtrahendI: UI_COLORS.subtrahend,
  kleinianBox: UI_COLORS.kleinian,
  kleinianSphere: UI_COLORS.kleinian,
};
