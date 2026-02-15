<script setup lang="ts">
import { computed } from "vue";
import { useFractalTheme } from "../../composables/useFractalTheme";
import { useFractalStore } from "../../store/useFractalStore";
import { useInputStore } from "../../store/useInputStore";
import { useLfoStore } from "../../store/useLfoStore";
import { useModifierStore } from "../../store/useModifierStore";
import { useUiPanelStore } from "../../store/useUiPanelStore";

import { FORMULAS } from "../../constants/formulas";
import { DEFAULT_SLIDER_CONSTRAINTS } from "../../constants/ui/default-slider-constraints";
import { DEFAULT_SLIDER_GROUPS } from "../../constants/ui/default-slider-groups";
import type { SliderGroup, SliderSchema } from "../../types/ui";

import IconRandom from "../icons/IconRandom.vue";
import IconReset from "../icons/IconReset.vue";
import IconSettings from "../icons/IconSettings.vue";
import ParameterSettings from "./ParameterSettings.vue";
import ParameterSlider from "./ParameterSlider.vue";

const fractal = useFractalStore();
const input = useInputStore();
const uiPanel = useUiPanelStore();
const modStore = useModifierStore();
const lfoStore = useLfoStore();
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
  input.toggleGroupBinding({
    x: sliders[0].parameterUnitId,
    ...(sliders.length >= 2 ? { y: sliders[1].parameterUnitId } : {}),
  });
};

const toggleParameterSettings = (parameterId: any) => {
  if (uiPanel.activeParameter === parameterId) {
    uiPanel.setActiveParameter(null);
  } else {
    uiPanel.setActiveParameter(parameterId);
  }
};

const isGroupBound = (group: SliderGroup) => {
  return group.sliders.some((slider) =>
    input.isParamBound(slider.parameterUnitId),
  );
};

// --- Visual Indicator Checks ---
const hasModifiers = (parameterId: string) => {
  if (parameterId === "seed")
    return (
      modStore.modifiers.z.modifierId !== "NONE" ||
      modStore.modifiers.c.modifierId !== "NONE"
    );
  if (parameterId === "memory")
    return modStore.modifiers.zPrev.modifierId !== "NONE";
  return false;
};

const hasLfos = (group: SliderGroup) => {
  return group.sliders.some((slider) => {
    const lfos = lfoStore.assignments[slider.parameterUnitId];
    return lfos && lfos.length > 0;
  });
};
</script>

<template>
  <div class="fractal-controls parameter-section">
    <header class="section-toolbar">
      <span class="section-title">Parameters</span>
      <div class="toolbar-actions">
        <button
          @click="fractal.randomizeParameters"
          class="button-primary icon-button"
          title="Randomize (R)"
        >
          <IconRandom />
        </button>
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
        :key="group.parameterId"
        :id="`slider-group-${group.parameterId}`"
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

        <div class="settings-actions">
          <div class="indicators">
            <span v-if="hasModifiers(group.parameterId)" class="badge badge-m"
              >M</span
            >
            <span v-if="hasLfos(group)" class="badge badge-l">L</span>
          </div>

          <button
            class="gear-button"
            :class="{
              'is-active': uiPanel.activeParameter === group.parameterId,
            }"
            @click.stop="toggleParameterSettings(group.parameterId)"
            title="Parameter Settings"
          >
            <IconSettings class="gear-icon" />
          </button>
        </div>
      </div>
    </div>

    <ParameterSettings />
  </div>
</template>

<style lang="scss" scoped>
.parameter-section {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
}

.section-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid var(--border-subtle);

  .section-title {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-primary);
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
  margin: -12px -8px 0;
}

.sliders-wrapper {
  gap: 4px;
  display: grid;
  grid-template-rows: 1fr;
}

.slider-group {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
  min-height: 32px;
  transition: background-color 0.2s ease;
  border-radius: 4px;
}

.slider-group.group-active {
  background: var(--border-subtle);
}

.label-container {
  display: flex;
  align-items: center;
  width: 90px;
}

.label {
  font-size: 11px;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
}

.label.clickable {
  cursor: pointer;
  transition:
    opacity 0.2s,
    text-shadow 0.2s;
  &:hover {
    opacity: 1;
    text-shadow: 0 0 8px currentColor;
  }
}

.live-indicator {
  font-size: 8px;
  margin-left: 4px;
  display: inline-block;
  vertical-align: middle;
  animation: pulse 2s infinite;
}

.slider-stack {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.settings-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.indicators {
  display: flex;
  gap: 2px;
}

.badge {
  font-size: 8px;
  font-weight: 800;
  padding: 1px 4px;
  border-radius: 3px;
  color: #fff;
}
.badge-m {
  background: rgba(255, 140, 0, 0.4);
  border: 1px solid rgba(255, 140, 0, 0.6);
}
.badge-l {
  background: rgba(0, 150, 255, 0.4);
  border: 1px solid rgba(0, 150, 255, 0.6);
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
  opacity: 0.3;
  transition: all 0.2s ease;

  .gear-icon {
    width: 14px;
    height: 14px;
  }

  &:hover {
    color: var(--text-primary);
    transform: rotate(45deg);
    opacity: 1;
  }

  &.is-active {
    opacity: 1;
    color: var(--accent-color);
  }
}

.slider-group:hover .gear-button {
  opacity: 0.8;
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
</style>
