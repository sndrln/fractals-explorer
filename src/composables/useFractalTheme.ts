import { computed } from "vue";
import {
  type ColorKey,
  PARAMETER_COLOR_MAP,
  UI_COLORS,
} from "../constants/ui/theme";
import { useFractalStore } from "../store/useFractalStore";
import type { ParameterUnitId } from "../types/parameter";

export function useFractalTheme() {
  const fractal = useFractalStore();

  const getColor = (key: ColorKey): string => {
    return UI_COLORS[key] || UI_COLORS.default;
  };

  const getVarColor = (parameterUnitId: ParameterUnitId): string => {
    return PARAMETER_COLOR_MAP[parameterUnitId];
  };

  // Centralized Math Symbol Logic
  const mathStyles = computed(() => {
    const ratio = fractal.parameters.slider.juliaMorph;
    const isJuliaMode = ratio > 0.5;

    const baseStyle = {
      transition: "color 0.4s ease, opacity 0.4s ease",
    };

    return {
      // z is Coordinate (Blue) in Julia, White in Mandelbrot
      zStyle: {
        ...baseStyle,
        color: isJuliaMode ? UI_COLORS.seed : UI_COLORS.iter,
        opacity: isJuliaMode ? 1.0 : 0.6,
      },
      // c is Seed (Blue) in Mandelbrot, White in Julia
      cStyle: {
        ...baseStyle,
        color: !isJuliaMode ? UI_COLORS.seed : UI_COLORS.iter,
        opacity: !isJuliaMode ? 1.0 : 0.6,
      },
    };
  });

  return {
    colors: UI_COLORS,
    getColor,
    getVarColor,
    mathStyles,
  };
}
