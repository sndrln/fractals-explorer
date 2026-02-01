<script setup lang="ts">
import { useFractalStore } from "../store/useFractalStore";
import PaletteSelector from "./PaletteSelector.vue";
import FractalRandomizer from "./FractalRandomizer.vue";
import InputAxisBindings from "./InputAxisBindings.vue";
import { computed } from "vue";
import { FORMULAS } from "../constants/formulas";
import FractalControls from "./fractal-controls/FractalControls.vue";
import { useViewStore } from "../store/useViewStore";
import MemoryMode from "./fractal-controls/MemoryMode.vue";

const fractalStore = useFractalStore();
const viewStore = useViewStore();
const availableFormulas = computed(() => {
  return FORMULAS.filter((f) => f.fractalType === fractalStore.currentType);
});
</script>

<template>
  <Transition name="fade">
    <div id="ui" v-show="viewStore.isUiVisible">
      <div class="ui-header">
        <select
          v-model="fractalStore.currentType"
          class="fractal-selector"
          @change="fractalStore.switchFractalType()"
        >
          <option value="escape">Escape Time</option>
          <option value="newton">Root Finding</option>
          <option value="nova">Nova</option>
        </select>
        <button class="close-ui-btn" @click="viewStore.toggleUi()">
          <span class="icon">◀</span>
        </button>
      </div>

      <div class="formula-selector-container">
        <select
          :value="fractalStore.formulaId"
          @change="
            (e) =>
              fractalStore.setFormula((e.target as HTMLSelectElement).value)
          "
          class="sub-selector"
        >
          <option
            v-for="formula in availableFormulas"
            :key="formula.id"
            :value="formula.id"
          >
            {{ formula.displayString }} ({{ formula.name }})
          </option>
        </select>
      </div>
      <FractalControls></FractalControls>

      <InputAxisBindings />

      <MemoryMode />
      <div class="footer-actions">
        <PaletteSelector />
        <div class="button-row">
          <button @click="viewStore.resetView" class="button-primary">⟲</button>
          <FractalRandomizer />
        </div>
        <!-- <PresetGallery /> -->
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

#ui {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background: rgba(10, 10, 10, 0.85);
  padding: 20px;
  border-radius: 12px;
  color: white;
  width: 370px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.ui-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.ui-header h1 {
  margin: 0;
  font-size: 1.5rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #646cff;
}

.close-ui-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-ui-btn:hover {
  background: rgba(100, 108, 255, 0.2);
  color: #fff;
  border-color: #646cff;
}

.close-ui-btn .icon {
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}

.close-ui-btn:hover .icon {
  transform: translateX(-2px);
}

.fractal-selector {
  background: none;
  border: none;
  color: #646cff;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  outline: none;
}
.fractal-selector option {
  background: #111;
  color: white;
}

.formula-selector-container {
  padding: 0 0 15px;
  position: relative;
}

.formula-selector-container::after {
  content: "▼";
  font-size: 12px;
  position: absolute;
  right: 12px;
  top: 18px;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none;
}

.formula-selector-container:hover::after {
  color: #ffaa00;
}

.sub-selector {
  width: 100%;
  background: rgba(40, 40, 40, 0.8);
  border: 1px solid #444;
  color: #ccc;
  padding: 8px 16px;
  border-radius: 4px;
  font-family: "Courier New", Courier, monospace;
  font-size: 0.9em;
  outline: none;
  appearance: none;
  cursor: pointer;
}

.sub-selector:hover {
  border-color: #ffaa00;
}

h1 {
  margin: 0;
  font-size: 1.2rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.9;
}

.button-row {
  display: flex;
  gap: 8px;
}
</style>
