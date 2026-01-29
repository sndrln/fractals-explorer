import { defineStore } from "pinia";
import gsap from "gsap";
import { FORMULAS } from "../constants/formulas";
import type { FractalType } from "../types/fractal-type";
import type { ParamRange } from "../types/param-range";
import type { BaseFractalParams } from "../types/base-fractal-params";
import { BASE_FRACTAL_PARAMS } from "../constants/base-fractal-params";

export const useFractalStore = defineStore("fractal", {
  state: () => ({
    currentFractalType: "escape" as FractalType,
    currentFormulaId: "mandelbrot",
    zoom: 2.0,
    offsetShiftX: 0.0,
    offsetShiftY: 0.0,

    initialParams: { ...BASE_FRACTAL_PARAMS },
    sliderParams: { ...BASE_FRACTAL_PARAMS },
    liveParams: { ...BASE_FRACTAL_PARAMS },

    paramConfigs: {
      relaxation: { min: -2.0, max: 2.0 },
      power: { min: -10.0, max: 10.0 },
      maxIterations: { min: 1, max: 500 },
      juliaMorph: { min: 0.0, max: 1.0 },
    } as Record<string, ParamRange>,
    time: 0,
    mouseX: 0,
    mouseY: 0,
    smoothedX: 0,
    smoothedY: 0,
    activeTargetAxis: null as "x" | "y" | null,
    bindingsX: ["seedX"] as string[],
    bindingsY: ["seedY"] as string[],
    isPaused: false,
    frozenValues: {} as Record<string, number>,
    isUiVisible: true,
  }),
  getters: {
    currentFormula: (state) =>
      FORMULAS.find((f) => f.id === state.currentFormulaId) || FORMULAS[0],
    // currentEngine: (getters) => getters.currentFormula.engine,
  },
  actions: {
    switchFractalType(fractalType?: FractalType) {
      if (fractalType) {
        this.currentFractalType = fractalType;
      }
      const firstFormula = FORMULAS.find(
        (f) => f.fractalType === this.currentFractalType,
      );
      if (firstFormula) {
        this.setFormula(firstFormula.id);
      }
    },
    setFormula(id: string) {
      const formula = FORMULAS.find((f) => f.id === id);
      if (!formula) return;

      this.currentFormulaId = id;
      this.currentFractalType = formula.fractalType;

      // 1. Separate Coordinates from Math Parameters
      const { zoom, offsetShiftX, offsetShiftY, ...mathParams } =
        formula.defaults;

      // 2. Apply Math Parameters to Sliders (merged with base)
      const mergedParams = { ...BASE_FRACTAL_PARAMS, ...mathParams };
      this.sliderParams = mergedParams;
      this.initialParams = { ...mergedParams };
      this.liveParams = { ...mergedParams };

      // 3. Apply View Coordinates to the Store Root
      if (zoom !== undefined) this.zoom = zoom;
      if (offsetShiftX !== undefined) this.offsetShiftX = offsetShiftX;
      if (offsetShiftY !== undefined) this.offsetShiftY = offsetShiftY;

      this.frozenValues = {};
    },

    togglePause() {
      this.isPaused = !this.isPaused;
    },

    toggleUi() {
      this.isUiVisible = !this.isUiVisible;
      if (!this.isUiVisible) {
        this.activeTargetAxis = null;
      }
    },

    toggleTargetAxis(axis: "x" | "y") {
      this.activeTargetAxis = this.activeTargetAxis === axis ? null : axis;
    },

    bindVariable(varName: keyof BaseFractalParams) {
      if (!this.activeTargetAxis) return;
      this.bindingsX = this.bindingsX.filter((v) => v !== varName);
      this.bindingsY = this.bindingsY.filter((v) => v !== varName);

      if (this.activeTargetAxis === "x") this.bindingsX.push(varName);
      if (this.activeTargetAxis === "y") this.bindingsY.push(varName);
    },

    unbindVariable(varName: string, axis: "x" | "y") {
      if (axis === "x")
        this.bindingsX = this.bindingsX.filter((v) => v !== varName);
      if (axis === "y")
        this.bindingsY = this.bindingsY.filter((v) => v !== varName);
    },

    unbindAllVariables() {
      this.bindingsX = [];
      this.bindingsY = [];
    },

    resetView() {
      gsap.to(this, {
        zoom: 2.0,
        offsetShiftX: 0.0,
        offsetShiftY: 0.0,
        duration: 1.5,
        ease: "expo.inOut",
      });
    },

    smoothZoom(delta: number) {
      const zoomSpeed = 0.2;
      const factor = delta > 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
      const newZoom = this.zoom * factor;

      const dx = this.mouseX * (this.zoom - newZoom);
      const dy = this.mouseY * (this.zoom - newZoom);

      gsap.to(this, {
        zoom: newZoom,
        offsetShiftX: this.offsetShiftX + dx,
        offsetShiftY: this.offsetShiftY + dy,
        duration: 0.4,
        ease: "power2.out",
      });
    },

    randomizeParams() {
      const targetValues: Record<string, number> = {};
      const keys = Object.keys(this.sliderParams) as Array<
        keyof BaseFractalParams
      >;

      keys.forEach((key) => {
        if (key === "juliaMorph" || key === "maxIterations") return;

        const currentVal = this.initialParams[key];
        const offset = Math.random() / 2 - 0.25;
        let targetVal = currentVal + offset;

        const config = this.paramConfigs[key];
        if (config) {
          if (config.min !== undefined)
            targetVal = Math.max(config.min, targetVal);
          if (config.max !== undefined)
            targetVal = Math.min(config.max, targetVal);
        }
        targetValues[key] = targetVal;
      });

      gsap.to(this.sliderParams, {
        ...targetValues,
        duration: 1.5,
        ease: "expo.out",
        overwrite: true,
      });
    },

    // getCurrentState(): FractalState {
    //   const selectedPalette = usePaletteStore().selectedPalette;
    //   return {
    //     type: this.currentFractalType,
    //     zoom: this.zoom,
    //     offsetX: this.offsetShiftX,
    //     offsetY: this.offsetShiftY,
    //     params: { ...this.sliderParams },
    //     palette: { ...selectedPalette },
    //   };
    // },

    // loadState(state: FractalState) {
    //   this.currentFractalType = state.type;
    //   this.zoom = state.zoom;
    //   this.offsetShiftX = state.offsetX;
    //   this.offsetShiftY = state.offsetY;

    //   Object.assign(this.sliderParams, state.params);
    //   usePaletteStore().setPalette(state.palette);
    // },
  },
});
