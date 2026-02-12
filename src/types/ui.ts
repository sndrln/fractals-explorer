import type { ColorKey } from "../constants/ui/theme";
import type { ParameterUnitId } from "./parameter";

export interface SliderGroup {
  label: string;
  colorKey: ColorKey;
  sliders: SliderSchema[];
}

export interface SliderSchema extends SliderConstraints {
  parameterUnitId: ParameterUnitId;
  unitSuffix?: string; // e.g. "i"
  showPlus?: boolean;
}

export interface SliderConstraints {
  min?: number;
  max?: number;
  step?: number; // How much value changes with drag
}
// Axis of mouse / finger movement
export type PointerAxis = "x" | "y" | null;

export type ActivePanelTab = "controls" | "settings";
