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

export const VAR_COLOR_MAP: Record<string, ColorKey> = {
  seedR: "seed",
  seedI: "seed",
  power: "power",
  powerI: "power",
  juliaMorph: "morph",
  memoryR: "memory",
  memoryI: "memory",
  maxIterations: "iter",
  relaxation: "relaxation",
  relaxationI: "relaxation",
  subtrahend: "subtrahend",
  subtrahendI: "subtrahend",
};
