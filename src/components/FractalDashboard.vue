<script setup lang="ts">
import { useCameraStore } from "../store/useCameraStore";
import { useFractalStore } from "../store/useFractalStore";
import { useInputStore } from "../store/useInputStore";
import BaseSlider from "./fractal-controls/BaseSlider.vue";
import ColoringMode from "./fractal-controls/ColoringMode.vue";
import FormulaDisplay from "./fractal-controls/FormulaDisplay.vue";
import FractalControls from "./fractal-controls/FractalControls.vue";
import ParameterSettings from "./fractal-controls/ParameterSettings.vue";
import PresetGallery from "./fractal-controls/PresetGallery.vue";
import InputAxisBindings from "./InputAxisBindings.vue";
import PaletteSelector from "./PaletteSelector.vue";

const fractal = useFractalStore();
const camera = useCameraStore();
const input = useInputStore();
</script>

<template>
  <div class="dashboard-container">
    <FormulaDisplay />
    <section class="dashboard-section">
      <FractalControls />
      <ParameterSettings />
      <InputAxisBindings />
    </section>

    <div class="slider-row">
      <div class="slider-container">
        <span class="slider-label">Sensitivity</span>
        <BaseSlider
          v-model="input.baseSensitivity"
          :min="0"
          :max="2"
          default-value="1"
        />
      </div>
      <div class="slider-container">
        <span class="slider-label">Zoom</span>
        <BaseSlider v-model="camera.zoom" is-zoom :base-reference="2.5" />
      </div>
      <div class="slider-container">
        <span class="slider-label">Iterations</span>
        <BaseSlider
          v-model="fractal.maxIterations"
          :min="10"
          :step="1"
          default-value="100"
        />
      </div>
      <div class="slider-container"></div>
      <!-- intentional for 1/4 width division  -->
    </div>
    <section class="modes-grid">
      <PaletteSelector />
      <ColoringMode />
    </section>

    <section class="dashboard-section">
      <PresetGallery />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  padding: 0 8px 8px;
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
