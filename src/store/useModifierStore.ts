import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ALL_MODIFIERS, type ModifierID } from "../constants/modifiers";

// Define our "Sockets"
export type ModifierSlot = "zMod" | "cMod" | "memory";

export const useModifierStore = defineStore("modifiers", () => {
  // 1. State: One entry per slot
  const slots = ref<Record<ModifierSlot, ModifierID>>({
    zMod: "NONE",
    cMod: "NONE",
    memory: "NONE",
  });

  // 2. Actions: Flexible targeting
  const setModifier = (slot: ModifierSlot, id: ModifierID) => {
    slots.value[slot] = id;
  };

  const stepOperator = (slot: ModifierSlot, direction: 1 | -1) => {
    const currentId = slots.value[slot];
    const index = ALL_MODIFIERS.findIndex((m) => m.value === currentId);
    const nextIndex =
      (index + direction + ALL_MODIFIERS.length) % ALL_MODIFIERS.length;
    slots.value[slot] = ALL_MODIFIERS[nextIndex].value;
  };

  // 3. Shader Integration Helper
  // Generates defines like: { Z_PRE_ABS: true, C_FEEDBACK_SIN: true }
  const getShaderDefines = computed(() => {
    const defines: Record<string, boolean> = {};

    Object.entries(slots.value).forEach(([slot, mode]) => {
      if (mode !== "NONE") {
        const key = `${slot.toUpperCase()}_${mode}`;
        defines[key] = true;
      }
    });

    return defines;
  });
  return {
    slots,
    setModifier,
    stepOperator,
    getShaderDefines,
    allOptions: ALL_MODIFIERS,
  };
});
