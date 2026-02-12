import type { ParameterUnitId } from "./parameter";
import type { SliderGroup } from "./ui";

export type FractalType = "escape" | "newton" | "nova" | "kleinian";

export type FormulaId =
  | "mandelbrot"
  | "burning-ship"
  | "tricorn"
  | "buffalo"
  | "celtic"
  | "heart"
  | "magnet"
  | "lambda"
  | "spider"
  | "inv-mandel"
  | "inv-exp"
  | "newton-std"
  | "newton-sin"
  | "newton-exp"
  | "newton-hybrid"
  | "nova-std"
  | "nova-sin"
  | "nova-hybrid"
  | "kleinian-basic";

export interface FormulaDefinition {
  id: FormulaId;
  name: string; // Text name
  mathNotation: string; // "z = z^2 + c"
  fractalType: FractalType;
  shaderSource: string;
  customSliders?: Array<SliderGroup>;
  cameraZoom?: number;
  cameraOffset: { x: number; y: number };
  parameterValues?: Partial<Record<ParameterUnitId, number>>;
}
