import { defineStore } from "pinia";
import gsap from "gsap";
import { FORMULAS } from "../constants/formulas";
import { DEFAULT_FRACTAL_PARAMS } from "../constants/base-fractal-params";
import { useViewStore } from "./useViewStore";
import type { FractalType, FractalParams, MemoryMode } from "../types/fractal";

export const useFractalStore = defineStore("fractal", {
  state: () => ({
    currentType: "escape" as FractalType,
    formulaId: "mandelbrot",
    memoryMode: "NONE" as MemoryMode,
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
    switchFractalType(fractalType?: FractalType): void {
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
    setFormula(id: string): void {
      const formula = FORMULAS.find((f) => f.id === id);
      if (!formula) return;

      const viewStore = useViewStore();
      this.formulaId = id;
      this.currentType = formula.fractalType;

      if (formula.zoom !== undefined) viewStore.zoom = formula.zoom;
      if (formula.offsetShiftX !== undefined)
        viewStore.offset.x = formula.offsetShiftX;
      if (formula.offsetShiftY !== undefined)
        viewStore.offset.y = formula.offsetShiftY;
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
      const idx = FORMULAS.findIndex((f) => f.id === this.formulaId);
      this.setFormula(FORMULAS[(idx + 1) % FORMULAS.length].id);
    },

    prevFormula(): void {
      const idx = FORMULAS.findIndex((f) => f.id === this.formulaId);
      this.setFormula(
        FORMULAS[(idx - 1 + FORMULAS.length) % FORMULAS.length].id,
      );
    },
    updateAnchorParams(): void {
      this.params.anchor = { ...this.params.slider };
    },
    randomizeParams() {
      const targetValues: Partial<FractalParams> = {};
      const keys = Object.keys(this.params.slider) as (keyof FractalParams)[];

      keys.forEach((key) => {
        if (key === "juliaMorph" || key === "maxIterations") return;

        const baseVal = this.params.anchor[key] as number;

        const offset = Math.random() / 2 - 0.25;
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
