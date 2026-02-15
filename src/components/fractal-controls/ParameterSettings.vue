<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useFractalTheme } from "../../composables/useFractalTheme";
import { PARAMETER_MAP } from "../../constants/parameter-map";
import { useLfoStore } from "../../store/useLfoStore";
import { useUiPanelStore } from "../../store/useUiPanelStore";
import type { ParameterUnitId } from "../../types/parameter";
import BaseSlider from "../fractal-controls/BaseSlider.vue";
import ModifierControl from "./ModifierControl.vue";

const uiPanel = useUiPanelStore();
const lfoStore = useLfoStore();
const fractalTheme = useFractalTheme();

const panelRef = ref<HTMLElement | null>(null);
const popoverStyle = ref({ top: "0px", left: "0px", width: "0px" });

const close = () => {
  if (uiPanel.activeParameter) uiPanel.setActiveParameter(null);
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") close();
};

// Calculate absolute position on the screen to follow the active group
const updatePosition = () => {
  if (!uiPanel.activeParameter) return;
  const anchor = document.getElementById(
    `slider-group-${uiPanel.activeParameter}`,
  );
  if (anchor) {
    const rect = anchor.getBoundingClientRect();
    popoverStyle.value = {
      top: `${rect.bottom + 4}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
    };
  }
};

watch(
  () => uiPanel.activeParameter,
  () => {
    if (uiPanel.activeParameter) requestAnimationFrame(updatePosition);
  },
);

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("scroll", updatePosition, true);
  window.addEventListener("resize", updatePosition);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("scroll", updatePosition, true);
  window.removeEventListener("resize", updatePosition);
});

onClickOutside(panelRef, close, {
  ignore: [".gear-button", '[class*="dropdown"]', '[role="listbox"]'],
});

const activeUnits = computed(() => {
  const id = uiPanel.activeParameter;
  return id ? PARAMETER_MAP[id] : [];
});

const getLfosForUnit = (unitId: ParameterUnitId) => {
  return lfoStore.assignments[unitId] || [];
};
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-down">
      <div
        v-if="uiPanel.activeParameter"
        ref="panelRef"
        class="parameter-settings-popover"
        :style="popoverStyle"
      >
        <div class="scroll-container custom-scrollbar">
          <section
            v-if="uiPanel.activeParameter === 'seed'"
            class="settings-section"
          >
            <ModifierControl target="z" />
            <ModifierControl target="c" />
          </section>

          <section
            v-if="uiPanel.activeParameter === 'memory'"
            class="settings-section"
          >
            <ModifierControl target="zPrev" />
          </section>

          <section
            v-for="unitId in activeUnits"
            :key="unitId"
            class="settings-section"
          >
            <div class="section-header">
              <span
                class="unit-title"
                :style="{
                  color: fractalTheme.getColor(uiPanel.activeParameter!),
                }"
              >
                {{ unitId.replace(/[RI]$|(?<=kleinian)[AB]/, "") }} ({{
                  unitId.slice(-1)
                }}) LFOs
              </span>
              <button
                @click="lfoStore.addLfo(unitId)"
                class="button-primary add-button"
              >
                + Add
              </button>
            </div>

            <div
              v-for="lfo in getLfosForUnit(unitId)"
              :key="lfo.id"
              class="lfo-row"
            >
              <div class="slider-container">
                <span class="slider-label">Freq</span>
                <BaseSlider
                  v-model="lfo.frequency"
                  :min="0"
                  :max="5"
                  :step="0.01"
                />
              </div>
              <div class="slider-container">
                <span class="slider-label">Amp</span>
                <BaseSlider
                  v-model="lfo.amplitude"
                  :min="0"
                  :max="1"
                  :step="0.001"
                />
              </div>
              <div class="slider-container">
                <span class="slider-label">Phase</span>
                <BaseSlider
                  v-model="lfo.phase"
                  :min="0"
                  :max="Math.PI * 2"
                  :step="0.1"
                />
              </div>
              <div class="delete-container">
                <button
                  @click="lfoStore.removeLfo(unitId, lfo.id)"
                  class="button-delete"
                  title="Remove LFO"
                >
                  ×
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.parameter-settings-popover {
  position: fixed; /* Fixed to viewport since we're tracking bounding rect */
  z-index: 9999;

  background: rgba(15, 15, 15, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  transform-origin: top center;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.25s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-8px) scaleY(0.95);
  opacity: 0;
}

.scroll-container {
  max-height: 350px;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 4px;
}

.unit-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.add-button {
  height: 22px;
  padding: 0 8px;
  font-size: 0.7rem;
  width: auto;
}

.lfo-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 28px;
  gap: 8px;
  align-items: flex-end;
  padding: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.slider-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.slider-label {
  font-size: 0.65rem;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.delete-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 100%;
}

.button-delete {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-dim);
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: var(--color-danger, #ff4a4a);
    background: rgba(255, 74, 74, 0.1);
    border-color: rgba(255, 74, 74, 0.3);
  }
}
</style>
