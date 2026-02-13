<script setup lang="ts">
import { computed } from "vue";
import { PARAMETER_MAP } from "../../constants/parameter-map";
import { useLfoStore } from "../../store/useLfoStore";
import { useUiPanelStore } from "../../store/useUiPanelstore";
import type { ParameterUnitId } from "../../types/parameter";
import BaseSlider from "../fractal-controls/BaseSlider.vue";

const uiPanel = useUiPanelStore();
const lfoStore = useLfoStore();

// Close the panel
const close = () => uiPanel.setActiveParameter(null);

// Get the group of units for the active parameter (e.g. ['seedR', 'seedI'])
const activeUnits = computed(() => {
  const id = uiPanel.activeParameter;
  return id ? PARAMETER_MAP[id] : [];
});

// Helper to get LFOs for a specific unit
const getLfosForUnit = (unitId: ParameterUnitId) => {
  return lfoStore.assignments[unitId] || [];
};
</script>

<template>
  <Transition name="slide-over">
    <div v-if="uiPanel.activeParameter" class="parameter-settings-panel">
      <header class="settings-header">
        <button @click="close" class="back-button">← Back</button>
        <h3>{{ uiPanel.activeParameter.toUpperCase() }}</h3>
      </header>

      <div class="scroll-container">
        <section class="modifiers-section">
          <div class="section-title">Modifiers</div>
          <div class="placeholder-card">
            Modifiers for {{ uiPanel.activeParameter }} coming soon...
          </div>
        </section>

        <section
          v-for="unitId in activeUnits"
          :key="unitId"
          class="unit-section"
        >
          <div class="section-title">
            <span
              >{{ unitId.replace(/[RI]$|(?<=kleinian)[AB]/, "") }} ({{
                unitId.slice(-1)
              }}) LFOs</span
            >
            <button @click="lfoStore.addLfo(unitId)" class="add-button">
              + Add
            </button>
          </div>

          <div v-if="getLfosForUnit(unitId).length === 0" class="empty-state">
            No active LFOs for this unit.
          </div>

          <div
            v-for="lfo in getLfosForUnit(unitId)"
            :key="lfo.id"
            class="lfo-card"
          >
            <div class="lfo-row">
              <label>Freq</label>
              <BaseSlider
                v-model="lfo.frequency"
                :min="0"
                :max="5"
                :step="0.01"
              />
            </div>
            <div class="lfo-row">
              <label>Amp</label>
              <BaseSlider
                v-model="lfo.amplitude"
                :min="0"
                :max="1"
                :step="0.001"
              />
            </div>
            <div class="lfo-row">
              <label>Phase</label>
              <BaseSlider
                v-model="lfo.phase"
                :min="0"
                :max="Math.PI * 2"
                :step="0.1"
              />
            </div>

            <button
              @click="lfoStore.removeLfo(unitId, lfo.id)"
              class="delete-lfo"
            >
              Remove
            </button>
          </div>
        </section>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-over-enter-active,
.slide-over-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.slide-over-enter-from,
.slide-over-leave-to {
  transform: translateX(100%); /* Slides in from the right */
  opacity: 0;
}

.parameter-settings-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-surface);
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.scroll-container {
  overflow-y: auto;
  padding: 1rem;
  flex: 1;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--text-dim);
  margin: 1.5rem 0 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.3rem;
}

.lfo-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 0.8rem;
  margin-bottom: 0.8rem;
}

.lfo-row {
  display: grid;
  grid-template-columns: 45px 1fr;
  align-items: center;
  gap: 8px;
  margin-bottom: 0.4rem;
}

.add-button {
  background: var(--accent-color);
  border: none;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  cursor: pointer;
}

.placeholder-card {
  padding: 1rem;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: var(--text-dim);
  font-style: italic;
  font-size: 0.85rem;
}
</style>
