<script setup lang="ts">
import { useFractalStore } from "../store/useFractalStore";
import PaletteSelector from "./PaletteSelector.vue";
import FractalRandomizer from "./FractalRandomizer.vue";
import InputAxisBindings from "./InputAxisBindings.vue";
import FractalControls from "./fractal-controls/FractalControls.vue";
import { useViewStore } from "../store/useViewStore";
import MemoryMode from "./fractal-controls/MemoryMode.vue";
import PresetGallery from "./fractal-controls/PresetGallery.vue";
import BaseSlider from "./fractal-controls/BaseSlider.vue";
import { useInputStore } from "../store/useInputStore";
import ColoringMode from "./fractal-controls/ColoringMode.vue";
import FractalNavigation from "./fractal-controls/FractalNavigation.vue";

const emit = defineEmits<{
  (e: "trigger-record"): void;
}>();

const handleRecordClick = () => {
  emit("trigger-record");
};

const fractal = useFractalStore();
const input = useInputStore();
const view = useViewStore();
</script>

<template>
  <Transition name="fade">
    <div id="ui" v-show="view.isUiVisible">
      <FractalNavigation />
      <main class="main">
        <FractalControls></FractalControls>

        <InputAxisBindings />

        <div class="slider-row">
          <div class="slider-label">Intensity</div>
          <BaseSlider v-model="input.intensity" default-value="1.0" />
        </div>
        <div class="slider-row">
          <div class="slider-label">Zoom</div>
          <BaseSlider v-model="view.zoom" is-zoom :base-reference="2.5" />
        </div>
        <!-- 
        <div class="slider-row">
          <div class="slider-label">Hybrid Morph</div>
          <BaseSlider
            v-model="fractalStore.params.slider.hybridMorph"
            default-value="1.0"
          />
        </div> -->

        <MemoryMode />
        <ColoringMode />

        <PresetGallery />
        <div class="footer-actions">
          <PaletteSelector />
          <div class="button-row">
            <FractalRandomizer />
            <button @click="fractal.resetParams" class="button-primary">
              ⟲
            </button>
            <button @click="handleRecordClick" class="button-primary">◯</button>
          </div>
        </div>
      </main>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#ui {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  background: rgba(10, 10, 10, 0.85);
  color: white;
  width: 370px;
  height: 100%;
  box-sizing: border-box;
  backdrop-filter: blur(8px);
}

.main {
  padding: 12px;
}

.ui-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 4px;
  transition: background-color 0.2s ease;
  border-radius: 4px;
}

.slider-label {
  width: 110px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
  user-select: none;
}

.button-row {
  display: flex;
  gap: 8px;
}
</style>
