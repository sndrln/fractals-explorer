// Define what can actually have logic attached to it
export type ParameterId =
  | "power"
  | "seed"
  | "juliaMorph"
  | "memory"
  | "subtrahend"
  | "relaxation"
  | "powerSecondary"
  | "kleinian";

/** * Initial numerical state of the fractal */
export type ParameterValues = Record<ParameterUnitId, number>;

/** * Represents the literal keys used in the shader and the stores.
 * e.g., "memoryR", "seedI"
 */
export type ParameterUnitId =
  | "power"
  | "powerI"
  | "seedR"
  | "seedI"
  | "juliaMorph"
  | "memoryR"
  | "memoryI"
  | "subtrahend"
  | "subtrahendI"
  | "relaxation"
  | "relaxationI"
  | "powerSecondary"
  | "powerSecondaryI"
  | "kleinianBox"
  | "kleinianSphere";

/**
 * Logic applied to a specific parameter instance.
 */
export interface ModifierConfig {
  modifierId: ModifierId; // e.g., "ABS", "FOLD"
  intensity: number; // strength of the modifier
  conditionId: ConditionId; // internal key for the shader's conditional logic
}

export interface ModifierMetadata {
  label: string;
  description?: string;
}

export interface ConditionMetadata {
  label: string;
}

export type ModifierId =
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

export type ModifiedParameter = "z" | "c" | "zPrev";

export type ConditionId =
  | "ALWAYS"
  | "Z_REAL_POSITIVE"
  | "Z_IMAG_POSITIVE"
  | "Z_MAG_GT_1"
  | "Z_ANGLE_POSITIVE"
  | "Z_REAL_GT_IMAG"
  | "Z_ABS_REAL_GT_ABS_IMAG";

export interface LFOConfig {
  id: string;
  frequency: number;
  amplitude: number;
  phase: number;
  active: boolean;
}

export type LFORecord = Partial<Record<ParameterUnitId, LFOConfig[]>>;
