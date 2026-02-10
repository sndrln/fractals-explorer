<script setup lang="ts">
import { computed } from "vue";
import { useFractalTheme } from "../../composables/useFractalTheme";
import { useFractalStore } from "../../store/useFractalStore";
import { useInputStore } from "../../store/useInputStore";

import { FORMULAS } from "../../constants/formulas";
import { BASE_CONTROL_GROUPS } from "../../constants/ui/base-control-groups";
import { BASE_SLIDER_CONSTRAINTS } from "../../constants/ui/base-slider-constraints";
import type { ControlGroup, SliderSchema } from "../../types/ui";
import IconRandom from "../icons/IconRandom.vue";
import IconReset from "../icons/IconReset.vue";
import ParamSlider from "./ParamSlider.vue";

const fractal = useFractalStore();
const input = useInputStore();
const { getColor } = useFractalTheme();

const activeControls = computed<ControlGroup[]>(() => {
  const formula = FORMULAS.find((f) => f.id === fractal.formulaId);
  if (!formula) return [];

  return formula.customUI || BASE_CONTROL_GROUPS[formula.fractalType] || [];
});

const getSliderProps = (slider: SliderSchema) => ({
  ...BASE_SLIDER_CONSTRAINTS[slider.paramKey],
  ...slider,
});

const handleGroupLabelClick = (group: ControlGroup) => {
  const sliders = group.sliders;
  if (!sliders.length) return;

  if (sliders.length >= 2) {
    input.toggleGroupBinding({
      x: sliders[0].paramKey,
      y: sliders[1].paramKey,
    });
  } else {
    input.toggleGroupBinding({
      x: sliders[0].paramKey,
    });
  }
};

const isGroupBound = (group: ControlGroup) => {
  return group.sliders.some((s) => input.isParamBound(s.paramKey));
};
</script>

<template>
  <div class="fractal-controls parameter-section">
    <header class="section-toolbar">
      <span class="section-title">Parameters</span>

      <div class="toolbar-actions">
        <div class="random-group">
          <button
            @click="fractal.randomizeParams"
            class="button-primary icon-button"
            title="Randomize (R)"
          >
            <IconRandom />
          </button>
        </div>

        <button
          @click="fractal.resetParams"
          class="button-primary icon-button"
          title="Reset to Defaults"
        >
          <IconReset />
        </button>
      </div>
    </header>

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

            <ParamSlider
              v-model="fractal.params.slider[slider.paramKey]"
              :paramKey="slider.paramKey"
              :color="getColor(group.colorKey)"
              :is-bound="!!input.isParamBound(slider.paramKey)"
              v-bind="getSliderProps(slider)"
              @change="fractal.updateAnchorParams()"
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
.parameter-section {
  background: var(--bg-surface);
  border-radius: 12px;
  border: 1px solid var(--border-subtle);
  overflow: hidden;
}

.section-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid var(--border-subtle);

  .section-title {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
  }
}

.toolbar-actions {
  display: flex;
  gap: 4px;
}

.icon-button {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: var(--text-primary);
    background: var(--border-subtle);
  }
}
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
  background: var(--border-subtle);
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
  margin-bottom: 4px;
}

.slider-suffix {
  font-size: 16px;
  font-family: serif;
  font-style: italic;
  opacity: 0.9;
  margin-left: -5px;
}
</style>
