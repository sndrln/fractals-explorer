import gsap from "gsap";
import { defineStore } from "pinia";
import { DEFAULT_PARAMETER_VALUES } from "../constants/default-parameter-values";
import { FORMULAS } from "../constants/formulas";
import type {
  FormulaDefinition,
  FormulaId,
  FractalType,
} from "../types/fractal";
import type { ParameterUnitId, ParameterValues } from "../types/parameter";
import { useCameraStore } from "./useCameraStore";
import { useInputStore } from "./useInputStore";
import { usePresetStore } from "./usePresetStore";

export const useFractalStore = defineStore("fractal", {
  state: () => ({
    currentType: "escape" as FractalType,
    formulaId: "mandelbrot" as FormulaId,
    parameters: {
      // For resetting sliders
      initial: { ...DEFAULT_PARAMETER_VALUES } as ParameterValues,
      // Changed parameters displayed in a slider
      slider: { ...DEFAULT_PARAMETER_VALUES } as ParameterValues,
      // Smoothed parameters for rendering
      live: { ...DEFAULT_PARAMETER_VALUES } as ParameterValues,
      // Current state for randomization
      anchor: { ...DEFAULT_PARAMETER_VALUES } as ParameterValues,
    },
    maxIterations: 100,
  }),

  getters: {
    currentFormula: (state): FormulaDefinition =>
      FORMULAS.find((f) => f.id === state.formulaId) || FORMULAS[0],
  },

  actions: {
    setFormula(id: FormulaId): void {
      if (this.formulaId === id) return;
      this.formulaId = id;

      const preset = usePresetStore();
      preset.currentPresetId = null;

      const formula = FORMULAS.find((f) => f.id === id);
      if (!formula) return;

      const camera = useCameraStore();
      this.currentType = formula.fractalType;

      if (formula.cameraZoom !== undefined) camera.zoom = formula.cameraZoom;
      if (formula.cameraOffset.x !== undefined)
        camera.offset.x = formula.cameraOffset.x;
      if (formula.cameraOffset.y !== undefined)
        camera.offset.y = formula.cameraOffset.y;

      this.resetParameters();
    },

    resetParameters(): void {
      const formula = FORMULAS.find((formula) => formula.id === this.formulaId);
      const actualParameterValues: ParameterValues = {
        ...DEFAULT_PARAMETER_VALUES,
        ...formula?.parameterValues,
      };

      this.parameters.initial = { ...actualParameterValues };

      gsap.to(this.parameters.slider, {
        ...actualParameterValues,
        duration: 1.5,
        ease: "expo.out",
        overwrite: true,
      });
    },

    nextFormula(): void {
      const index = FORMULAS.findIndex(
        (formula) => formula.id === this.formulaId,
      );
      this.setFormula(FORMULAS[(index + 1) % FORMULAS.length].id);
    },

    prevFormula(): void {
      const index = FORMULAS.findIndex(
        (formula) => formula.id === this.formulaId,
      );
      this.setFormula(
        FORMULAS[(index - 1 + FORMULAS.length) % FORMULAS.length].id,
      );
    },

    updateAnchorParameters(): void {
      this.parameters.anchor = { ...this.parameters.slider };
    },

    randomizeParameters() {
      const input = useInputStore();

      const targetValues: Partial<ParameterValues> = {};
      const keys = Object.keys(this.parameters.slider) as ParameterUnitId[];

      keys.forEach((key) => {
        if (key === "juliaMorph") return;

        const baseVal = this.parameters.anchor[key] as number;
        // Simple randomization relative to the anchor point
        const offset = (Math.random() - 0.5) * input.sensitivity;
        targetValues[key] = baseVal + offset;
      });

      gsap.to(this.parameters.slider, {
        ...targetValues,
        duration: 1.2,
        ease: "power2.out",
        overwrite: true,
      });
    },
  },
});
