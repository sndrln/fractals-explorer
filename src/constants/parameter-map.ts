import type { ParameterId, ParameterUnitId } from "../types/parameter";

export const PARAMETER_MAP: Record<ParameterId, ParameterUnitId[]> = {
  seed: ["seedR", "seedI"],
  power: ["power", "powerI"],
  memory: ["memoryR", "memoryI"],
  subtrahend: ["subtrahend", "subtrahendI"],
  relaxation: ["relaxation", "relaxationI"],
  powerSecondary: ["powerSecondary", "powerSecondaryI"],
  juliaMorph: ["juliaMorph"],
  kleinian: ["kleinianBox", "kleinianSphere"],
};
