import { computed } from "vue";
import { useFractalStore } from "../store/useFractalStore";
import { type ColorKey, UI_COLORS, VAR_COLOR_MAP } from "../constants/ui/theme";

export function useFractalTheme() {
  const fractalStore = useFractalStore();

  const getColor = (key: ColorKey | string): string => {
    return UI_COLORS[key as ColorKey] || UI_COLORS.default;
  };

  const getVarColor = (varName: string): string => {
    return VAR_COLOR_MAP[varName];
  };

  // Centralized Math Symbol Logic
  const mathStyles = computed(() => {
    const ratio = fractalStore.params.slider.juliaMorph;
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
