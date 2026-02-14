<script setup lang="ts">
import { computed } from "vue";
import {
  CONDITION_METADATA,
  MODIFIER_METADATA,
} from "../../constants/modifiers";
import { useModifierStore } from "../../store/useModifierStore";
import type { ModifiedParameter } from "../../types/parameter";
import BaseDropdown from "../ui/BaseDropdown.vue";

const props = defineProps<{
  target: ModifiedParameter;
  color: string;
}>();

const modStore = useModifierStore();
const config = computed(() => modStore.modifiers[props.target]);

// Transform Metadata Objects to Dropdown-friendly Arrays
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
  <div class="modifier-control" :style="{ '--target-color': color }">
    <div class="control-header">
      <span class="target-label">{{ target }} Modifier</span>
    </div>

    <div class="settings-grid">
      <div class="settings-section">
        <label class="control-label">Transformation</label>
        <BaseDropdown
          :modelValue="config.modifierId"
          @update:modelValue="(val) => update({ modifierId: val })"
          identityKey="value"
          :options="modifierOptions"
          :displayValue="currentModLabel"
        />
      </div>

      <div class="settings-section">
        <label class="control-label">Condition</label>
        <BaseDropdown
          :modelValue="config.conditionId"
          @update:modelValue="(val) => update({ conditionId: val })"
          identityKey="value"
          :options="conditionOptions"
          :displayValue="currentCondLabel"
        />
      </div>

      <div class="input-group full-width">
        <div class="label-row">
          <label>Intensity</label>
          <span class="value">{{ (config.intensity * 100).toFixed(0) }}%</span>
        </div>
        <input
          type="range"
          :value="config.intensity"
          @input="
            (e) =>
              update({
                intensity: parseFloat((e.target as HTMLInputElement).value),
              })
          "
          min="0"
          max="1"
          step="0.01"
          class="intensity-slider"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modifier-control {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  padding: 14px;
  border-left: 3px solid var(--target-color);
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.full-width {
  grid-column: span 2;
  margin-top: 5px;
}

.control-label {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.intensity-slider {
  width: 100%;
  accent-color: var(--target-color);
  background: rgba(255, 255, 255, 0.1);
  height: 4px;
  border-radius: 2px;
  cursor: pointer;
}
</style>
