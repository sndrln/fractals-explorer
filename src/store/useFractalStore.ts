import { defineStore } from "pinia";
import gsap from "gsap";
import { FORMULAS } from "../constants/formulas";
import { DEFAULT_FRACTAL_PARAMS } from "../constants/base-fractal-params";
import { useViewStore } from "./useViewStore";
import type { FractalType, FractalParams } from "../types/fractal";

export const useFractalStore = defineStore("fractal", {
  state: () => ({
    currentType: "escape" as FractalType,
    formulaId: "mandelbrot",
    memoryMode: "NONE",
    params: {
      slider: { ...DEFAULT_FRACTAL_PARAMS } as FractalParams, // What the UI shows
      live: { ...DEFAULT_FRACTAL_PARAMS }, // What the Shader sees (smoothed)
      initial: { ...DEFAULT_FRACTAL_PARAMS } as FractalParams, // Anchor for randomization
    },
  }),

  getters: {
    currentFormula: (state) =>
      FORMULAS.find((f) => f.id === state.formulaId) || FORMULAS[0],
  },

  actions: {
    switchFractalType(fractalType?: FractalType) {
      if (fractalType) {
        this.currentType = fractalType;
      }
      const firstFormula = FORMULAS.find(
        (f) => f.fractalType === this.currentType,
      );
      if (firstFormula) {
        this.setFormula(firstFormula.id);
      }
    },
    setFormula(id: string) {
      const formula = FORMULAS.find((f) => f.id === id);
      if (!formula) return;

      const viewStore = useViewStore();
      this.formulaId = id;
      this.currentType = formula.fractalType;

      const { zoom, offsetShiftX, offsetShiftY, ...mathParams } =
        formula.defaults;
      const merged = { ...DEFAULT_FRACTAL_PARAMS, ...mathParams };

      this.params.slider = { ...merged };
      this.params.initial = { ...merged };
      this.params.live = { ...merged };

      if (zoom !== undefined) viewStore.zoom = zoom;
      if (offsetShiftX !== undefined) viewStore.offset.x = offsetShiftX;
      if (offsetShiftY !== undefined) viewStore.offset.y = offsetShiftY;
    },

    nextFormula() {
      const idx = FORMULAS.findIndex((f) => f.id === this.formulaId);
      this.setFormula(FORMULAS[(idx + 1) % FORMULAS.length].id);
    },

    prevFormula() {
      const idx = FORMULAS.findIndex((f) => f.id === this.formulaId);
      this.setFormula(
        FORMULAS[(idx - 1 + FORMULAS.length) % FORMULAS.length].id,
      );
    },

    randomizeParams() {
      const targetValues: Partial<FractalParams> = {};
      const keys = Object.keys(this.params.slider) as (keyof FractalParams)[];

      keys.forEach((key) => {
        if (key === "juliaMorph" || key === "maxIterations") return;

        const currentVal = this.params.initial[key] as number;
        const offset = Math.random() / 2 - 0.25;
        targetValues[key] = currentVal + offset;
      });

      gsap.to(this.params.slider, {
        ...targetValues,
        duration: 1.5,
        ease: "expo.out",
        overwrite: true,
      });
    },
  },
});
