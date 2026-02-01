import type { FractalParams, FractalType } from "./fractal";

export interface ControlGroup {
  label: string;
  colorKey: string;
  sliders: SliderSchema[];
}

export interface SliderSchema {
  paramKey: keyof FractalParams;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
  showPlus?: boolean;
}

export interface Palette {
  brightness: number[];
  contrast: number[];
  osc: number[];
  phase: number[];
}

export interface FormulaDefinition {
  id: string;
  name: string;
  fractalType: FractalType;
  shaderSource: string;
  displayString: string;
  customUI?: Array<ControlGroup>;
  defaults: {
    zoom?: number;
    offsetShiftX?: number;
    offsetShiftY?: number;
    power?: number;
    subtrahend?: number;
    juliaMorph?: number;
    memoryR?: number;
    seedR?: number;
    relaxation?: number;
  };
}
