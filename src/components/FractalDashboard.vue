<script setup lang="ts">
import { useCameraStore } from "../store/useCameraStore";
import { useFractalStore } from "../store/useFractalStore";
import { useGraphicsStore } from "../store/useGraphicsStore";
import { useInputStore } from "../store/useInputStore";
import BaseSlider from "./fractal-controls/BaseSlider.vue";
import ColoringMode from "./fractal-controls/ColoringMode.vue";
import FormulaDisplay from "./fractal-controls/FormulaDisplay.vue";
import FractalControls from "./fractal-controls/FractalControls.vue";
import PresetGallery from "./fractal-controls/PresetGallery.vue";
import InputAxisBindings from "./InputAxisBindings.vue";
import PaletteSelector from "./PaletteSelector.vue";

const fractal = useFractalStore();
const view = useCameraStore();
const input = useInputStore();
const graphics = useGraphicsStore();
// const modifier = useModifierStore();

// const zModLabel = computed(() => {
//   const option = modifier.allOptions.find(
//     (opt) => opt.value === modifier.slots.zMod,
//   );
//   return option ? option.label : "None";
// });

// // Finds the label for the C-Mod slot
// const cModLabel = computed(() => {
//   const option = modifier.allOptions.find(
//     (opt) => opt.value === modifier.slots.cMod,
//   );
//   return option ? option.label : "None";
// });
</script>

<template>
  <div class="dashboard-container">
    <FormulaDisplay />
    <section class="dashboard-section">
      <FractalControls />
      <InputAxisBindings />
    </section>

    <div class="slider-row">
      <div class="slider-container">
        <span class="slider-label">Sensitivity</span>
        <BaseSlider
          v-model="input.sensitivity"
          :min="0"
          :max="2"
          default-value="1"
        />
      </div>
      <div class="slider-container">
        <span class="slider-label">Zoom</span>
        <BaseSlider v-model="view.zoom" is-zoom :base-reference="2.5" />
      </div>
      <div class="slider-container">
        <span class="slider-label">Iterations</span>
        <BaseSlider
          v-model="fractal.maxIterations"
          :min="10"
          :step="1"
          default-value="100"
          :max="graphics.currentIterationLimit"
        />
      </div>
      <div class="slider-container"></div>
      <!-- intentional for 1/4 width division  -->
    </div>

    <!-- <MemoryMode />
    <div class="settings-section">
      <label class="control-label">Structure (Z-Mod)</label>
      <BaseDropdown
        v-model="modifier.slots.zMod"
        identityKey="value"
        :options="modifier.allOptions"
        :displayValue="zModLabel"
      />
    </div>

    <div class="settings-section">
      <label class="control-label">Evolution (C-Mod)</label>
      <BaseDropdown
        v-model="modifier.slots.cMod"
        identityKey="value"
        :options="modifier.allOptions"
        :displayValue="cModLabel"
      />
    </div> -->
    <section class="modes-grid">
      <PaletteSelector />
      <ColoringMode />
    </section>

    <section class="dashboard-section">
      <PresetGallery />

      <div class="action-row"></div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slider-row {
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
}

.slider-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  gap: 4px;

  .slider-label {
    font-size: 12px;
    opacity: 0.6;
  }
}
.modes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
}
</style>
