import type { ParameterUnitId } from "../../types/parameter";
import type { SliderConstraints } from "../../types/ui";

export const DEFAULT_SLIDER_CONSTRAINTS: Record<
  ParameterUnitId,
  SliderConstraints
> = {
  power: { min: -10, max: 10, step: 0.01 },
  powerI: { min: -10, max: 10, step: 0.01 },
  powerSecondary: { min: -10, max: 10, step: 0.01 },
  powerSecondaryI: { min: -10, max: 10, step: 0.01 },
  juliaMorph: { min: 0, max: 1.0, step: 0.01 },
  seedR: { min: -2, max: 2, step: 0.01 },
  seedI: { min: -2, max: 2, step: 0.01 },
  memoryR: { step: 0.01 },
  memoryI: { step: 0.01 },
  relaxation: { min: -2, max: 2, step: 0.01 },
  relaxationI: { min: -2, max: 2, step: 0.01 },
  subtrahend: { min: -2, max: 2, step: 0.01 },
  subtrahendI: { min: -2, max: 2, step: 0.01 },
  kleinianBox: { min: -2, max: 2, step: 0.01 },
  kleinianSphere: { min: -2, max: 2, step: 0.01 },
};
