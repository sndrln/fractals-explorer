import { defineStore } from "pinia";
import gsap from "gsap";
import { FORMULAS } from "../constants/formulas";
import { DEFAULT_FRACTAL_PARAMS } from "../constants/base-fractal-params";
import { useViewStore } from "./useViewStore";
import type { FractalType, FractalParams } from "../types/fractal";
import { useInputStore } from "./useInputStore";

export const useFractalStore = defineStore("fractal", {
  state: () => ({
    currentType: "escape" as FractalType,
    formulaId: "mandelbrot",
    params: {
      // For resetting sliders
      initial: { ...DEFAULT_FRACTAL_PARAMS } as FractalParams,
      // Changed parameters displayed in a slider
      slider: { ...DEFAULT_FRACTAL_PARAMS } as FractalParams,
      // Smoothed parameters for rendering
      live: { ...DEFAULT_FRACTAL_PARAMS },
      // Current state for randomization
      anchor: { ...DEFAULT_FRACTAL_PARAMS } as FractalParams,
    },
  }),

  getters: {
    currentFormula: (state) =>
      FORMULAS.find((f) => f.id === state.formulaId) || FORMULAS[0],
  },

  actions: {
    setFormula(id: string): void {
      const formula = FORMULAS.find((f) => f.id === id);
      if (!formula) return;

      const view = useViewStore();
      this.formulaId = id;
      this.currentType = formula.fractalType;

      if (formula.zoom !== undefined) view.zoom = formula.zoom;
      if (formula.offsetShiftX !== undefined)
        view.offset.x = formula.offsetShiftX;
      if (formula.offsetShiftY !== undefined)
        view.offset.y = formula.offsetShiftY;
      this.resetParams();
    },
    resetParams(): void {
      const formula = FORMULAS.find((f) => f.id === this.formulaId);
      const merged = { ...DEFAULT_FRACTAL_PARAMS, ...formula.defaults };

      this.params.initial = { ...merged };
      gsap.to(this.params.slider, {
        ...merged,
        duration: 1.5,
        ease: "expo.out",
        overwrite: true,
      });
    },
    nextFormula(): void {
      const index = FORMULAS.findIndex((f) => f.id === this.formulaId);
      this.setFormula(FORMULAS[(index + 1) % FORMULAS.length].id);
    },

    prevFormula(): void {
      const index = FORMULAS.findIndex((f) => f.id === this.formulaId);
      this.setFormula(
        FORMULAS[(index - 1 + FORMULAS.length) % FORMULAS.length].id,
      );
    },
    updateAnchorParams(): void {
      this.params.anchor = { ...this.params.slider };
    },
    randomizeParams() {
      const input = useInputStore();

      const targetValues: Partial<FractalParams> = {};
      const keys = Object.keys(this.params.slider) as (keyof FractalParams)[];

      keys.forEach((key) => {
        if (key === "juliaMorph" || key === "maxIterations") return;

        const baseVal = this.params.anchor[key] as number;

        const offset = (Math.random() - 0.5) * input.intensity;
        targetValues[key] = baseVal + offset;
      });

      gsap.to(this.params.slider, {
        ...targetValues,
        duration: 1.2,
        ease: "power2.out",
        overwrite: true,
      });
    },
  },
});
