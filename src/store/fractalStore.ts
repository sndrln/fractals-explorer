import { defineStore } from "pinia";
import gsap from "gsap";
import { usePaletteStore } from "./paletteStore";
import { FRACTAL_DEFAULTS } from "../constants/fractal-defaults";
import type { ParamRange } from "../types/param-range";
import type { FractalParams } from "../types/fractal-params";
import type { FractalType } from "../types/fractal-type";
import type { FractalState } from "../types/fractal-state";

export const useFractalStore = defineStore("fractal", {
  state: () => ({
    currentFractal: "mandelbrot" as FractalType,
    zoom: 2.0,
    initialParams: { ...FRACTAL_DEFAULTS.mandelbrot } as FractalParams,
    sliderParams: { ...FRACTAL_DEFAULTS.mandelbrot } as FractalParams,
    liveParams: { ...FRACTAL_DEFAULTS.mandelbrot } as FractalParams,
    paramConfigs: {
      relaxation: { min: -2.0, max: 2.0 },
      powerMain: { min: -10.0, max: 10.0 },
      maxIterations: { min: 1, max: 200 },
      juliaMorph: { min: 0.0, max: 1.0 },
    } as Record<string, ParamRange>,
    offsetShiftX: 0.0,
    offsetShiftY: 0.0,
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

  actions: {
    switchFractal(fractalType?: FractalType) {
      if (fractalType) {
        this.currentFractal = fractalType;
      }
      const defaults = FRACTAL_DEFAULTS[this.currentFractal];
      const copy = (obj: any) => JSON.parse(JSON.stringify(obj));

      this.$patch({
        initialParams: copy(defaults),
        sliderParams: copy(defaults),
        liveParams: copy(defaults),
        frozenValues: {},
      });
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

    bindVariable(varName: keyof FractalParams) {
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
      const keys = Object.keys(this.sliderParams) as Array<keyof FractalParams>;

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

    getCurrentState(): FractalState {
      return {
        type: this.currentFractal,
        zoom: this.zoom,
        offsetX: this.offsetShiftX,
        offsetY: this.offsetShiftY,
        params: { ...this.sliderParams },
        paletteId: usePaletteStore().selectedPalette.id,
      };
    },

    loadState(state: FractalState) {
      this.currentFractal = state.type;
      this.zoom = state.zoom;
      this.offsetShiftX = state.offsetX;
      this.offsetShiftY = state.offsetY;

      Object.assign(this.sliderParams, state.params);
      usePaletteStore().setPalette(state.paletteId);
    },
  },
});
