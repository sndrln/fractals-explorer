import { defineStore } from "pinia";
import type { FractalParams } from "../types/fractal";
import type { PointerBindings } from "../types/ui";
import { useFractalStore } from "./useFractalStore";

export const useInputStore = defineStore("interaction", {
  state: () => ({
    mouse: {
      x: 0,
      y: 0,
      inputX: 0,
      inputY: 0,
      smoothedX: 0,
      smoothedY: 0,
    },
    intensity: 1.0,
    activeAxis: null as "x" | "y" | null,
    bindings: {
      x: ["seedR"],
      y: ["seedI"],
    } as PointerBindings,
    isPaused: false,
  }),

  actions: {
    updateMouse(x: number, y: number) {
      this.mouse.x = x;
      this.mouse.y = y;

      if (!this.isPaused) {
        this.mouse.inputX = x;
        this.mouse.inputY = y;
      }
    },

    setIntensity(val: number) {
      this.intensity = val;
    },

    tickSmoothing() {
      this.mouse.smoothedX += (this.mouse.inputX - this.mouse.smoothedX) * 0.08;
      this.mouse.smoothedY += (this.mouse.inputY - this.mouse.smoothedY) * 0.08;
    },

    toggleTargetAxis(axis: "x" | "y") {
      this.activeAxis = this.activeAxis === axis ? null : axis;
    },

    bindVariable(paramKey: keyof FractalParams) {
      if (!this.activeAxis) return;

      this.unbindVariable(paramKey, "x");
      this.unbindVariable(paramKey, "y");

      this.bindings[this.activeAxis].push(paramKey);
    },
    commitLiveValues(keys: (keyof FractalParams)[]) {
      const fractal = useFractalStore();
      keys.forEach((key) => {
        if (fractal.params.live[key] !== undefined) {
          fractal.params.slider[key] = fractal.params.live[key];
        }
      });
    },

    unbindVariable(paramKey: keyof FractalParams, axis: "x" | "y") {
      if (this.isPaused) {
        this.commitLiveValues([paramKey]);
      }
      this.bindings[axis] = this.bindings[axis].filter(
        (v) => v !== paramKey,
      ) as (keyof FractalParams)[];
    },

    unbindAll() {
      if (this.isPaused) {
        this.commitLiveValues([...this.bindings.x, ...this.bindings.y]);
      }
      this.bindings.x = [];
      this.bindings.y = [];
    },

    toggleGroupBinding(params: {
      x?: keyof FractalParams;
      y?: keyof FractalParams;
    }) {
      const { x, y } = params;

      const xBound = x ? this.bindings.x.includes(x) : true;
      const yBound = y ? this.bindings.y.includes(y) : true;

      if (xBound && yBound) {
        if (x) this.unbindVariable(x, "x");
        if (y) this.unbindVariable(y, "y");
      } else {
        if (x) {
          this.unbindVariable(x, "y");
          if (!this.bindings.x.includes(x)) this.bindings.x.push(x);
        }
        if (y) {
          this.unbindVariable(y, "x");
          if (!this.bindings.y.includes(y)) this.bindings.y.push(y);
        }
      }
    },

    isParamBound(paramKey: keyof FractalParams): "x" | "y" | null {
      if (this.bindings.x.includes(paramKey)) return "x";
      if (this.bindings.y.includes(paramKey)) return "y";
      return null;
    },

    togglePause() {
      this.isPaused = !this.isPaused;
    },
  },
});
