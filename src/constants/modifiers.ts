export type ModifierID =
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
  | "SINH"
  | "COSH"
  | "TANH"
  | "EXP"
  | "LOG"
  | "SQRT"
  | "RECIPROCAL"
  | "POW3"
  | "FOLD"
  | "SWIZZLE"
  | "KALEIDOSCOPE"
  | "POLAR"
  | "SPHERE_INVERSION"
  | "TILE"
  | "CREASE"
  | "SAWTOOTH"
  | "WAVEFOLD"
  | "SHIFT_INVERT"
  | "VOXELIZE"
  | "TAN_WARP"
  | "CROSS_FOLD"
  | "SPIRAL"
  | "CIRCLE_PULSE"
  | "GLITCH";

export const ALL_MODIFIERS: ModifierDef[] = [
  { label: "None", value: "NONE" },
  { label: "Crease (Diagonal)", value: "CREASE", tags: ["spatial"] },
  { label: "Conjugate", value: "CONJUGATE" },
  { label: "Sawtooth (Grid)", value: "SAWTOOTH", tags: ["spatial"] },
  { label: "Wavefold (Organic)", value: "WAVEFOLD", tags: ["experimental"] },
  { label: "Shift Invert", value: "SHIFT_INVERT", tags: ["math"] },
  { label: "Voxelize (Pixels)", value: "VOXELIZE", tags: ["experimental"] },
  { label: "Tangent Warp", value: "TAN_WARP", tags: ["trig"] },
  { label: "Cross-Fold", value: "CROSS_FOLD", tags: ["spatial"] },
  { label: "Log Spiral", value: "SPIRAL", tags: ["math"] },
  { label: "Circle Pulse", value: "CIRCLE_PULSE", tags: ["spatial"] },
  { label: "The Glitch", value: "GLITCH", tags: ["experimental"] },
  { label: "Absolute (Z)", value: "ABS_BOTH", tags: ["spatial"] },
  { label: "Absolute Real", value: "ABS_X", tags: ["spatial"] },
  { label: "Absolute Imaginary", value: "ABS_Y", tags: ["spatial"] },
  { label: "Reverse", value: "REVERSE" },
  { label: "Invert", value: "INVERT", tags: ["spatial"] },
  { label: "Sin", value: "SIN", tags: ["trig"] },
  { label: "Cos", value: "COS", tags: ["trig"] },
  { label: "Tan", value: "TAN", tags: ["trig"] },
  { label: "Sinh", value: "SINH", tags: ["trig"] },
  { label: "Cosh", value: "COSH", tags: ["trig"] },
  { label: "Tanh", value: "TANH", tags: ["trig"] },
  { label: "Exponential", value: "EXP", tags: ["math"] },
  { label: "Logarithm", value: "LOG", tags: ["math"] },
  { label: "Sqrt", value: "SQRT", tags: ["math"] },
  { label: "Reciprocal", value: "RECIPROCAL", tags: ["math"] },
  { label: "Cubic", value: "POW3", tags: ["math"] },
  { label: "Fold", value: "FOLD", tags: ["spatial"] },
  { label: "Swizzle", value: "SWIZZLE", tags: ["spatial"] },
  { label: "Kaleidoscope", value: "KALEIDOSCOPE", tags: ["experimental"] },
  { label: "Polar", value: "POLAR", tags: ["experimental"] },
  { label: "Sphere Inversion", value: "SPHERE_INVERSION", tags: ["spatial"] },
  { label: "Tile", value: "TILE", tags: ["spatial"] },
];

export interface ModifierDef {
  label: string;
  value: ModifierID;
  tags?: string[];
}
