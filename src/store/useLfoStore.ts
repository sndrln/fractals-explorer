import { defineStore } from "pinia";
import type { LFOConfig, ParameterUnitId } from "../types/parameter";
import { generateId } from "../utils/generateId"; // Using your function

export const useLfoStore = defineStore("lfo", {
  state: () => ({
    assignments: {} as Partial<Record<ParameterUnitId, LFOConfig[]>>,
  }),

  actions: {
    addLfo(parameterUnitId: ParameterUnitId) {
      if (!this.assignments[parameterUnitId]) {
        this.assignments[parameterUnitId] = [];
      }

      this.assignments[parameterUnitId]!.push({
        id: generateId(),
        frequency: 0.5,
        amplitude: 0.1,
        phase: 0,
        active: true,
      });
    },

    removeLfo(parameterUnitId: ParameterUnitId, lfoId: string) {
      const list = this.assignments[parameterUnitId];
      if (list) {
        this.assignments[parameterUnitId] = list.filter(
          (lfo) => lfo.id !== lfoId,
        );
      }
    },
  },
});
