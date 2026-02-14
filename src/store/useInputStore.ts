import { defineStore } from "pinia";
import type { ParameterUnitId } from "../types/parameter";
import type { PointerAxis } from "../types/ui";
import { useCameraStore } from "./useCameraStore";
import { useFractalStore } from "./useFractalStore";

export const useInputStore = defineStore("input", {
  state: () => ({
    mouse: {
      x: 0,
      y: 0,
      inputX: 0,
      inputY: 0,
      smoothedX: 0,
      smoothedY: 0,
      anchorX: 0,
      anchorY: 0,
    },
    baseSensitivity: 1.0,
    activeAxis: null as PointerAxis,
    lockedAxis: null as PointerAxis,

    // Maps an axis (x/y) to a list of specific parameters (e.g., "seedR")
    bindings: {
      x: ["memoryR"],
      y: ["memoryI"],
    } as Record<PointerAxis, ParameterUnitId[]>,

    isVelocityMode: false,
    isPaused: false,
  }),
  getters: {
    effectiveSensitivity(state) {
      const camera = useCameraStore();
      return state.baseSensitivity * camera.zoom;
    },
  },
  actions: {
    updateMouse(x: number, y: number, isShiftPressed: boolean) {
      this.mouse.x = x;
      this.mouse.y = y;

      if (!this.isPaused) {
        if (isShiftPressed) {
          if (!this.lockedAxis) {
            this.lockedAxis = Math.abs(x) > Math.abs(y) ? "x" : "y";
          }

          if (this.lockedAxis === "x") {
            this.mouse.inputX = x;
          } else {
            this.mouse.inputY = y;
          }
        } else {
          this.lockedAxis = null;
          this.mouse.inputX = x;
          this.mouse.inputY = y;
        }
      }
    },

    setSensitivity(val: number) {
      this.baseSensitivity = val;
    },

    tickSmoothing() {
      this.mouse.smoothedX += (this.mouse.inputX - this.mouse.smoothedX) * 0.08;
      this.mouse.smoothedY += (this.mouse.inputY - this.mouse.smoothedY) * 0.08;
    },

    toggleTargetAxis(axis: PointerAxis) {
      this.activeAxis = this.activeAxis === axis ? null : axis;
    },

    // Binds a specific unit (e.g., "seedR") to the active axis
    bindVariable(paramKey: ParameterUnitId) {
      if (!this.activeAxis) return;

      this.unbindVariable(paramKey, "x");
      this.unbindVariable(paramKey, "y");
      this.bindings[this.activeAxis].push(paramKey);
    },

    commitLiveValues(keys: ParameterUnitId[]) {
      const fractal = useFractalStore();
      keys.forEach((key) => {
        if (fractal.parameters.live[key] !== undefined) {
          fractal.parameters.slider[key] = fractal.parameters.live[key];
        }
      });
    },

    unbindVariable(paramKey: ParameterUnitId, axis: PointerAxis) {
      if (this.isPaused) {
        this.commitLiveValues([paramKey]);
      }
      this.bindings[axis] = this.bindings[axis].filter((v) => v !== paramKey);
    },

    unbindAll() {
      if (this.isPaused) {
        this.commitLiveValues([...this.bindings.x, ...this.bindings.y]);
      }
      this.bindings.x = [];
      this.bindings.y = [];
    },

    toggleGroupBinding(parameterBindings: {
      x?: ParameterUnitId;
      y?: ParameterUnitId;
    }) {
      const { x, y } = parameterBindings;

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

    isParamBound(paramKey: ParameterUnitId): PointerAxis | null {
      if (this.bindings.x.includes(paramKey)) return "x";
      if (this.bindings.y.includes(paramKey)) return "y";
      return null;
    },

    togglePause() {
      this.isPaused = !this.isPaused;

      if (this.isPaused) {
        this.commitLiveValues([...this.bindings.x, ...this.bindings.y]);
      } else {
        // 2. IMPORTANT: Set the anchor to current smoothed position
        // This makes the delta (smoothedX - anchorX) equal to 0 the instant we unpause.
        this.mouse.anchorX = this.mouse.smoothedX;
        this.mouse.anchorY = this.mouse.smoothedY;
      }
    },
  },
});
