import type { FractalType } from "./fractal-type";
import type { Palette } from "./palette";

export interface FractalState {
  type: FractalType;
  zoom: number;
  offsetX: number;
  offsetY: number;
  params: Record<string, number>;
  palette: Palette;
}
