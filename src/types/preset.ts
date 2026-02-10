import type {
  ColoringMode,
  FractalParams,
  FractalType,
  MemoryMode,
} from "./fractal";
import type { Palette, PointerBindings } from "./ui";

export interface Preset {
  id: string;
  label: string;
  fractalType: FractalType;
  formulaId: string;
  memoryMode: MemoryMode;
  coloringMode: ColoringMode;
  fractalParams: FractalParams;
  bindings: PointerBindings;
  sensitivity: number;
  zoom: number;
  offset: { x: number; y: number };
  palette: Palette;
}
