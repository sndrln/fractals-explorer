<script setup lang="ts">
import { computed } from "vue";
import {
  CONDITION_METADATA,
  MODIFIER_METADATA,
} from "../../constants/modifiers";
import { useModifierStore } from "../../store/useModifierStore";
import type { ModifiedParameter } from "../../types/parameter";
import BaseSlider from "../fractal-controls/BaseSlider.vue";
import BaseDropdown from "../ui/BaseDropdown.vue";

const props = defineProps<{
  target: ModifiedParameter;
}>();

const modStore = useModifierStore();
const config = computed(() => modStore.modifiers[props.target]);

const modifierOptions = Object.entries(MODIFIER_METADATA).map(([id, meta]) => ({
  value: id,
  label: meta.label,
}));

const conditionOptions = Object.entries(CONDITION_METADATA).map(
  ([id, meta]) => ({
    value: id,
    label: meta.label,
  }),
);

const currentModLabel = computed(
  () => MODIFIER_METADATA[config.value.modifierId]?.label,
);
const currentCondLabel = computed(
  () => CONDITION_METADATA[config.value.conditionId]?.label,
);

const update = (patch: any) => modStore.setModifier(props.target, patch);
</script>

<template>
  <div class="modifier-row-layout">
    <BaseDropdown
      :modelValue="config.modifierId"
      @update:modelValue="(val) => update({ modifierId: val })"
      :options="modifierOptions"
      :label="`${target === 'zPrev' ? 'Memory' : target.toUpperCase()} Mod`"
      :displayValue="currentModLabel"
      identityKey="value"
    />

    <BaseDropdown
      :modelValue="config.conditionId"
      @update:modelValue="(val) => update({ conditionId: val })"
      :options="conditionOptions"
      label="Condition"
      :displayValue="currentCondLabel"
      identityKey="value"
    />

    <div class="slider-wrapper">
      <BaseSlider
        :modelValue="config.intensity"
        @update:modelValue="(val) => update({ intensity: val })"
        :min="0"
        :max="1"
        :step="0.01"
        default-value="0"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modifier-row-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 8px;
  align-items: flex-end;

  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.slider-wrapper {
  display: flex;
  align-items: center;
  height: 28px;
  padding-bottom: 2px;
}
</style>
