import type {
  ConditionId,
  ConditionMetadata,
  ModifierId,
  ModifierMetadata,
} from "../types/parameter";

export const MODIFIER_METADATA: Record<ModifierId, ModifierMetadata> = {
  NONE: { label: "None" },
  ABS_BOTH: { label: "|z| | Absolute" },
  ABS_X: { label: "|Re(z)| | Abs Real" },
  ABS_Y: { label: "|Im(z)| | Abs Imag" },
  CONJUGATE: { label: "z̅ | Conjugate" },
  REVERSE: { label: "-z | Reverse" },
  INVERT: { label: "z / |z|² | Inversion" },
  RECIPROCAL: { label: "1 / z | Reciprocal" },

  // Trigonometry
  SIN: { label: "sin(z)" },
  COS: { label: "cos(z)" },
  TAN: { label: "tan(z)" },
  SINH: { label: "sinh(z)" },
  COSH: { label: "cosh(z)" },
  TANH: { label: "tanh(z)" },

  // Power/Exp
  EXP: { label: "eᶻ | Exponential" },
  LOG: { label: "ln(z) | Logarithm" },
  SQRT: { label: "√z | Square Root" },
  POW3: { label: "z³ | Cubic" },

  // Geometric / Fractal
  FOLD: { label: "⭲ | Fold" },
  SWIZZLE: { label: "(y, x) | Swizzle" },
  KALEIDOSCOPE: { label: "k(z, n) | Kaleidoscope" },
  POLAR: { label: "(ln r, θ) | Polar" },
  SPHERE_INVERSION: { label: "Sᵢₙᵥ(z) | Sphere Inv" },
  TILE: { label: "fract(z) | Tile" },
  CREASE: { label: "min/max(x,y) | Crease" },
  SAWTOOTH: { label: "z - ⌊z⌋ | Sawtooth" },
  WAVEFOLD: { label: "z·sin(πz) | Wavefold" },
  SHIFT_INVERT: { label: "1 / (z-s) | Shift Inv" },
  VOXELIZE: { label: "⌊z·n⌋ / n | Voxelize" },
  TAN_WARP: { label: "tan(z) + 1/z | Warp" },
  CROSS_FOLD: { label: "|z|xy - 0.5 | Cross" },
  SPIRAL: { label: "🌀(z) | Log Spiral" },
  CIRCLE_PULSE: { label: "z · δ(r) | Pulse" },
  GLITCH: { label: "Ⱬ | The Glitch" },
};

export const CONDITION_METADATA: Record<ConditionId, ConditionMetadata> = {
  ALWAYS: { label: "Always" },
  Z_REAL_POSITIVE: { label: "Re(z) > 0" },
  Z_IMAG_POSITIVE: { label: "Im(z) > 0" },
  Z_MAG_GT_1: { label: "|z| > 1" },
  Z_ANGLE_POSITIVE: { label: "arg(z) > 0" },
  Z_REAL_GT_IMAG: { label: "Re(z) > Im(z)" },
  Z_ABS_REAL_GT_ABS_IMAG: { label: "|Re(z)| > |Im(z)|" },
};
