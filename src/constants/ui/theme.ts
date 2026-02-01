export const UI_COLORS = {
  power: "#ffaa00",
  seed: "#55aaff",
  morph: "#ff00aa",
  memory: "#00ffaa",
  iter: "#ffffff",
  default: "#646cff",
  relaxation: "#ff00aa",
  subtrahend: "#646cff",
} as const;

export type ColorKey = keyof typeof UI_COLORS;

export const VAR_COLOR_MAP: Record<string, string> = {
  seedR: UI_COLORS.seed,
  seedI: UI_COLORS.seed,
  power: UI_COLORS.power,
  powerI: UI_COLORS.power,
  juliaMorph: UI_COLORS.morph,
  memoryR: UI_COLORS.memory,
  memoryI: UI_COLORS.memory,
  maxIterations: UI_COLORS.iter,
  relaxation: UI_COLORS.relaxation,
  relaxationI: UI_COLORS.relaxation,
  subtrahend: UI_COLORS.subtrahend,
  subtrahendI: UI_COLORS.subtrahend,
};
