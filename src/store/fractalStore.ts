import { defineStore } from "pinia";
import gsap from "gsap";
import { palettes } from "../constants/palettes";
import type { ParamRange } from "../types/param-range";
import { FRACTAL_DEFAULTS } from "../constants/fractal-defaults";
import type { FractalParams } from "../types/fractal-params";
import type { FractalType } from "../types/fractal-type";

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
      juliaMorph: { min: -1.0, max: 3.0 },
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
    selectedPalette: 0,
    isPaused: false,
    frozenValues: {} as Record<string, number>,
    isUiVisible: true,
  }),
  actions: {
    switchFractal() {
      const defaults = FRACTAL_DEFAULTS[this.currentFractal];

      const copy = (obj: any) => JSON.parse(JSON.stringify(obj));

      this.$patch({
        initialParams: copy(defaults),
        sliderParams: copy(defaults),
        liveParams: copy(defaults),
        frozenValues: {},
      });
    },
    setPalette(id: number) {
      this.selectedPalette = id;
    },
    nextPalette() {
      const len = palettes.length;
      this.selectedPalette = (this.selectedPalette + 1) % len;
    },
    prevPalette() {
      const len = palettes.length;
      this.selectedPalette = (this.selectedPalette - 1 + len) % len;
    },
    togglePause() {
      this.isPaused = !this.isPaused;
    },
    toggleUi() {
      this.isUiVisible = !this.isUiVisible;
      if (!this.isUiVisible) {
        this.activeTargetAxis = null; // Clean up selection mode when hiding UI
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
  },
});
