import type { FractalType } from "./fractal-type";

export interface FormulaDefinition {
  id: string;
  name: string;
  fractalType: FractalType;
  shaderSource: string;
  mathSymbol: string;
  defaults: {
    zoom?: number;
    offsetShiftX?: number;
    offsetShiftY?: number;
    power?: number;
    subtrahend?: number;
    juliaMorph?: number;
  };
}
