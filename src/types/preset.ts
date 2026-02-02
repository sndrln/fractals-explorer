import type { FractalParams, FractalType, MemoryMode } from "./fractal";
import type { Palette, PointerBindings } from "./ui";

export interface Preset {
  label: string;
  fractalType: FractalType;
  formulaId: string;
  memoryMode: MemoryMode;
  fractalParams: FractalParams;
  bindings: PointerBindings;
  zoom: number;
  offset: { x: number; y: number };
  palette: Palette;
}
