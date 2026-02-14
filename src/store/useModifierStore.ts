import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { MODIFIER_METADATA } from "../constants/modifiers";
import type {
  ModifiedParameter,
  ModifierConfig,
  ModifierId,
} from "../types/parameter";

export const useModifierStore = defineStore("modifiers", () => {
  // The state now just holds the config for the 3 key slots
  const modifiers = ref<Record<ModifiedParameter, ModifierConfig>>({
    z: { modifierId: "NONE", intensity: 0, conditionId: "ALWAYS" },
    c: { modifierId: "NONE", intensity: 0, conditionId: "ALWAYS" },
    zPrev: { modifierId: "NONE", intensity: 0, conditionId: "ALWAYS" },
  });

  const modifierIds = Object.keys(MODIFIER_METADATA) as ModifierId[];

  const setModifier = (
    target: ModifiedParameter,
    config: Partial<ModifierConfig>,
  ) => {
    modifiers.value[target] = { ...modifiers.value[target], ...config };
  };

  /**
   * Cycles through available modifiers
   */
  const stepModifier = (
    modifiedParameter: ModifiedParameter,
    direction: 1 | -1,
  ) => {
    const currentModifierId = modifiers.value[modifiedParameter].modifierId;
    const currentIndex = modifierIds.indexOf(currentModifierId);

    const nextIndex =
      (currentIndex + direction + modifierIds.length) % modifierIds.length;

    modifiers.value[modifiedParameter].modifierId = modifierIds[nextIndex];
  };

  /**
   * Generates a flat object of defines for the shader re-compile.
   * e.g., { Z_POLAR: true, ZPREV_ABS_BOTH: true }
   */
  const shaderDefines = computed(() => {
    const defines: Record<string, boolean> = {};

    for (const [slot, config] of Object.entries(modifiers.value)) {
      // 1. Only bake if it's not NONE
      if (config.modifierId !== "NONE") {
        const prefix = slot === "zPrev" ? "MEM" : slot.toUpperCase() + "MOD";

        // Define the Modifier: e.g., ZMOD_SIN
        defines[`${prefix}_${config.modifierId}`] = true;

        // Define the Condition: e.g., ZMOD_COND_X_POS
        defines[`${prefix}_COND_${config.conditionId}`] = true;
      }
    }
    return defines;
  });

  return {
    modifiers,
    setModifier,
    stepModifier,
    shaderDefines,
    availableModifiers: MODIFIER_METADATA,
  };
});
