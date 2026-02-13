<script setup lang="ts">
import { computed } from "vue";
import { useFractalTheme } from "../../composables/useFractalTheme";
import { useFractalStore } from "../../store/useFractalStore";
import { useInputStore } from "../../store/useInputStore";

import { FORMULAS } from "../../constants/formulas";
import { DEFAULT_SLIDER_CONSTRAINTS } from "../../constants/ui/default-slider-constraints";
import { DEFAULT_SLIDER_GROUPS } from "../../constants/ui/default-slider-groups";
import { useUiPanelStore } from "../../store/useUiPanelstore";
import type { SliderGroup, SliderSchema } from "../../types/ui";
import IconRandom from "../icons/IconRandom.vue";
import IconReset from "../icons/IconReset.vue";
import IconSettings from "../icons/IconSettings.vue"; // Assuming you have this
import ParameterSlider from "./ParameterSlider.vue";

const fractal = useFractalStore();
const input = useInputStore();
const uiPanel = useUiPanelStore(); // Added
const { getColor } = useFractalTheme();

const activeControls = computed<SliderGroup[]>(() => {
  const formula = FORMULAS.find((f) => f.id === fractal.formulaId);
  if (!formula) return [];

  return (
    formula.customSliders || DEFAULT_SLIDER_GROUPS[formula.fractalType] || []
  );
});

const getSliderProps = (slider: SliderSchema) => ({
  ...DEFAULT_SLIDER_CONSTRAINTS[slider.parameterUnitId],
  ...slider,
});

const handleGroupLabelClick = (group: SliderGroup) => {
  const sliders = group.sliders;
  if (!sliders.length) return;

  if (sliders.length >= 2) {
    input.toggleGroupBinding({
      x: sliders[0].parameterUnitId,
      y: sliders[1].parameterUnitId,
    });
  } else {
    input.toggleGroupBinding({
      x: sliders[0].parameterUnitId,
    });
  }
};

const openParameterSettings = (parameterId: any) => {
  uiPanel.setActiveParameter(parameterId);
};

const isGroupBound = (group: SliderGroup) => {
  return group.sliders.some((slider) =>
    input.isParamBound(slider.parameterUnitId),
  );
};
</script>

<template>
  <div class="fractal-controls parameter-section">
    <header class="section-toolbar">
      <span class="section-title">Parameters</span>

      <div class="toolbar-actions">
        <div class="random-group">
          <button
            @click="fractal.randomizeParameters"
            class="button-primary icon-button"
            title="Randomize (R)"
          >
            <IconRandom />
          </button>
        </div>

        <button
          @click="fractal.resetParameters"
          class="button-primary icon-button"
          title="Reset to Defaults"
        >
          <IconReset />
        </button>
      </div>
    </header>

    <div class="sliders-wrapper">
      <div
        v-for="group in activeControls"
        :key="group.label"
        class="slider-group"
        :class="{
          'group-active': isGroupBound(group),
          'settings-open': uiPanel.activeParameter === group.parameterId,
        }"
      >
        <div class="label-container">
          <div
            class="label clickable"
            :style="{ color: getColor(group.parameterId) }"
            @click="handleGroupLabelClick(group)"
          >
            {{ group.label }}:
            <span v-if="isGroupBound(group)" class="live-indicator">●</span>
          </div>

          <button
            class="gear-button"
            :class="{
              'is-active': uiPanel.activeParameter === group.parameterId,
            }"
            @click="openParameterSettings(group.parameterId)"
            title="Parameter Settings"
          >
            <IconSettings class="gear-icon" />
          </button>
        </div>

        <div class="slider-stack">
          <template
            v-for="slider in group.sliders"
            :key="slider.parameterUnitId"
          >
            <span
              v-if="slider.showPlus"
              :style="{ color: getColor(group.parameterId) }"
              class="math-operator"
              >+</span
            >

            <ParameterSlider
              v-model="fractal.parameters.slider[slider.parameterUnitId]"
              :parameterUnitId="slider.parameterUnitId"
              :color="getColor(group.parameterId)"
              :is-bound="!!input.isParamBound(slider.parameterUnitId)"
              v-bind="getSliderProps(slider)"
              @change="fractal.updateAnchorParameters()"
            />

            <span
              v-if="slider.unitSuffix"
              :style="{ color: getColor(group.parameterId) }"
              class="slider-suffix"
            >
              {{ slider.unitSuffix }}
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

.sliders-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slider-group {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 4px;
  transition: background-color 0.2s ease;
  border-radius: 4px;
}

.slider-group.group-active {
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

.label-container {
  display: flex;
  align-items: center;
  width: 130px; /* Increased slightly to fit gear */
  gap: 4px;
}

.label {
  flex: 1;
  font-size: 11px;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gear-button {
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-dim);
  opacity: 0;
  transition: all 0.2s ease;

  .gear-icon {
    width: 12px;
    height: 12px;
  }

  &:hover {
    color: var(--text-primary);
    transform: rotate(45deg);
  }

  &.is-active {
    opacity: 1;
    color: var(--accent-color);
  }
}

.slider-group:hover .gear-button {
  opacity: 0.6;
}

.gear-button:hover {
  opacity: 1 !important;
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
