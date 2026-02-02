import type { ColorKey } from "../constants/ui/theme";
import type { FractalParams, FractalType } from "./fractal";

export interface ControlGroup {
  label: string;
  colorKey: ColorKey;
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
export interface PointerBindings {
  x: Array<keyof FractalParams>;
  y: Array<keyof FractalParams>;
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
  zoom?: number;
  offsetShiftX?: number;
  offsetShiftY?: number;
  defaults?: Partial<Record<keyof FractalParams, number>>;
}
