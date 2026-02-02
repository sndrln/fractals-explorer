<script setup lang="ts">
import { computed } from "vue";
import { useFractalStore } from "../../store/useFractalStore";
import { useInputStore } from "../../store/useInputStore";
import { useFractalTheme } from "../../composables/useFractalTheme";
import BaseSlider from "./BaseSlider.vue";
import FormulaDisplay from "./FormulaDisplay.vue";

import { BASE_CONTROL_GROUPS } from "../../constants/ui/base-control-groups";
import { FORMULAS } from "../../constants/formulas";
import { BASE_SLIDER_CONSTRAINTS } from "../../constants/ui/base-slider-constraints";
import type { ControlGroup, SliderSchema } from "../../types/ui";

const fractalStore = useFractalStore();
const inputStore = useInputStore();
const { getColor } = useFractalTheme();

const activeControls = computed<ControlGroup[]>(() => {
  const formula = FORMULAS.find((f) => f.id === fractalStore.formulaId);
  if (!formula) return [];

  const groups =
    formula.customUI || BASE_CONTROL_GROUPS[formula.fractalType] || [];

  const iterationGroup: ControlGroup = {
    label: "Iterations",
    colorKey: "iter",
    sliders: [{ paramKey: "maxIterations" }],
  };

  return [...groups, iterationGroup];
});

const getSliderProps = (slider: SliderSchema) => ({
  ...BASE_SLIDER_CONSTRAINTS[slider.paramKey],
  ...slider,
});

const handleGroupLabelClick = (group: ControlGroup) => {
  const sliders = group.sliders;
  if (!sliders.length) return;

  if (sliders.length >= 2) {
    inputStore.toggleGroupBinding({
      x: sliders[0].paramKey,
      y: sliders[1].paramKey,
    });
  } else {
    inputStore.toggleGroupBinding({
      x: sliders[0].paramKey,
    });
  }
};

const isGroupBound = (group: ControlGroup) => {
  return group.sliders.some((s) => inputStore.isParamBound(s.paramKey));
};
</script>

<template>
  <div class="fractal-controls">
    <FormulaDisplay />

    <div class="controls-wrapper">
      <div
        v-for="group in activeControls"
        :key="group.label"
        class="control-group"
        :class="{ 'group-active': isGroupBound(group) }"
      >
        <div
          class="label clickable"
          :style="{ color: getColor(group.colorKey) }"
          @click="handleGroupLabelClick(group)"
        >
          {{ group.label }}:
          <span v-if="isGroupBound(group)" class="live-indicator">●</span>
        </div>

        <div class="slider-stack">
          <template v-for="slider in group.sliders" :key="slider.paramKey">
            <span
              v-if="slider.showPlus"
              :style="{ color: getColor(group.colorKey) }"
              class="math-operator"
              >+</span
            >

            <BaseSlider
              v-model="fractalStore.params.slider[slider.paramKey]"
              :paramKey="slider.paramKey"
              :color="getColor(group.colorKey)"
              :is-bound="!!inputStore.isParamBound(slider.paramKey)"
              v-bind="getSliderProps(slider)"
              @change="fractalStore.updateAnchorParams()"
            />

            <span
              v-if="slider.suffix"
              :style="{ color: getColor(group.colorKey) }"
              class="slider-suffix"
            >
              {{ slider.suffix }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fractal-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.controls-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 4px;
  transition: background-color 0.2s ease;
  border-radius: 4px;
}

.control-group.group-active {
  background: rgba(255, 255, 255, 0.05);
}

.slider-stack {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.label {
  width: 110px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
  user-select: none;
}

.label.clickable {
  cursor: pointer;
  transition:
    opacity 0.2s,
    text-shadow 0.2s;
}

.label.clickable:hover {
  opacity: 1;
  text-shadow: 0 0 8px currentColor;
}

.live-indicator {
  font-size: 8px;
  margin-left: 4px;
  display: inline-block;
  vertical-align: middle;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
}

.math-operator {
  font-family: monospace;
  font-weight: bold;
}

.slider-suffix {
  font-size: 14px;
  font-family: serif;
  font-style: italic;
  opacity: 0.9;
  min-width: 10px;
}
</style>
