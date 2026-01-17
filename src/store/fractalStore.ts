import { defineStore } from "pinia";
import gsap from "gsap";

interface ParamConfig {
  min?: number;
  max?: number;
}

export const palettes = [
  {
    id: 0,
    brightness: [0.5, 0.5, 0.5],
    contrast: [0.5, 0.5, 0.5],
    osc: [1.0, 1.0, 1.0],
    phase: [0.0, 0.33, 0.67],
  },
  {
    id: 1,
    brightness: [0.5, 0.5, 0.5],
    contrast: [0.5, 0.5, 0.5],
    osc: [1.0, 1.0, 1.0],
    phase: [0.0, 0.1, 0.2],
  },
  {
    id: 2,
    brightness: [0.5, 0.5, 0.5],
    contrast: [0.5, 0.5, 0.5],
    osc: [1.0, 1.0, 0.5],
    phase: [0.8, 0.9, 0.3],
  },
  {
    id: 3,
    brightness: [0.8, 0.5, 0.4],
    contrast: [0.2, 0.4, 0.2],
    osc: [2.0, 1.0, 1.0],
    phase: [0.0, 0.25, 0.25],
  },
  {
    id: 4,
    brightness: [0.5, 0.5, 0.5],
    contrast: [0.5, 0.5, 0.5],
    osc: [1.0, 0.7, 0.4],
    phase: [0.0, 0.15, 0.2],
  },
  {
    id: 5,
    brightness: [0.5, 0.5, 0.5],
    contrast: [0.5, 0.5, 0.5],
    osc: [1.0, 1.0, 1.0],
    phase: [0.3, 0.2, 0.2],
  },
  {
    id: 6,
    brightness: [0.5, 0.5, 0.5],
    contrast: [0.5, 0.5, 0.5],
    osc: [0.8, 0.8, 0.5],
    phase: [0.0, 0.2, 0.5],
  },
  {
    id: 7,
    brightness: [0.2, 0.1, 0.0],
    contrast: [0.8, 0.8, 0.8],
    osc: [1.0, 0.5, 0.2],
    phase: [0.0, 0.1, 0.2],
  },
];

export const useFractalStore = defineStore("fractal", {
  state: () => ({
    zoom: 2.0,
    params: {
      relaxation: 0.3,
      powerMain: 3.0,
      powerMainImaginary: 0.0,
      powerDerivative: 2.0,
      powerDerivativeImaginary: 0.0,
      subtrahend: 1.0,
      maxIterations: 80,
      memoryR: 0.0,
      memoryI: 0.0,
      // seedX: 1.0,
      seedX: 0.0,
      seedY: 0.0,
      juliaMorph: 0.0,
    },
    paramConfigs: {
      relaxation: { min: -2.0, max: 2.0 },
      powerMain: { min: -10.0, max: 10.0 },
      maxIterations: { min: 1, max: 200 },
      juliaMorph: { min: -1.0, max: 3.0 },
    } as Record<string, ParamConfig>,
    // isJulia: false,
    offsetShiftX: 0.0,
    offsetShiftY: 0.0,
    liveParams: {} as Record<string, number>,
    time: 0,
    mouseX: 0, // The "Target" (where the mouse actually is)
    mouseY: 0,
    smoothedX: 0, // The "Current" (the value that follows with a delay)
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
    bindVariable(varName: string) {
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
        offsetShiftX: 0,
        offsetShiftY: 0,
        duration: 1.5,
        ease: "expo.inOut",
      });
    },
    smoothZoom(delta: number) {
      const zoomSpeed = 0.2;
      const factor = delta > 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
      const newZoom = this.zoom * factor;

      // 1. Correct Delta Math
      // The amount of shift needed is relative to the scale change
      const dx = this.mouseX * (this.zoom - newZoom);
      const dy = this.mouseY * (this.zoom - newZoom);

      // 2. Correct Property Names (matching your state keys)
      gsap.to(this, {
        zoom: newZoom,
        offsetShiftX: this.offsetShiftX + dx,
        offsetShiftY: this.offsetShiftY + dy,
        duration: 0.4,
        ease: "power2.out",
      });
    },
  },
});
