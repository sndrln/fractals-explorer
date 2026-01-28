import type { FractalType } from "./fractal-type";

export interface FractalState {
  type: FractalType;
  zoom: number;
  offsetX: number;
  offsetY: number;
  params: Record<string, number>;
  paletteId: number;
}
