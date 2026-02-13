<script setup lang="ts">
import { computed } from "vue";
import { FORMULAS } from "../constants/formulas";
import { useFractalStore } from "../store/useFractalStore";

import { useUiPanelStore } from "../store/useUiPanelstore";
import IconMinimize from "./icons/IconMinimize.vue";
import IconSettings from "./icons/IconSettings.vue";

const uiPanel = useUiPanelStore();
const fractal = useFractalStore();

const categories = [
  { id: "escape", color: "var(--color-danger)" },
  { id: "newton", color: "var(--color-info)" },
  { id: "nova", color: "var(--color-accent)" },
  { id: "kleinian", color: "var(--color-success)" },
];

const currentTypeColor = computed(() => {
  return (
    categories.find((c) => c.id === fractal.currentType)?.color ||
    "var(--text-primary)"
  );
});

const currentFormulaName = computed(() => {
  const formula = FORMULAS.find((f) => f.id === fractal.formulaId);
  return formula?.name;
});
</script>

<template>
  <header class="utility-header">
    <button
      @click="uiPanel.toggleUiPanel"
      class="hitbox-button"
      title="Toggle UI (H)"
    >
      <div class="button-primary">
        <IconMinimize />
      </div>
    </button>

    <div
      class="fractal-title-widget"
      @click="uiPanel.toggleFractalSelection"
      :class="{ 'is-active': uiPanel.isFractalSelectionOpen }"
    >
      <div class="formula-display-name" :style="{ color: currentTypeColor }">
        {{ currentFormulaName }}
        <div
          class="chevron-wrapper"
          :class="{ 'is-flipped': uiPanel.isFractalSelectionOpen }"
        >
          <IconMinimize class="chevron-icon" />
        </div>
      </div>
    </div>

    <button
      @click="uiPanel.toggleSettings"
      class="hitbox-button"
      :class="{ 'is-active': uiPanel.activeTab === 'settings' }"
      title="Graphics Settings"
    >
      <div class="button-primary">
        <IconSettings
          class="settings-gear"
          :class="{ spinning: uiPanel.activeTab === 'settings' }"
        />
      </div>
    </button>
  </header>
</template>

<style lang="scss" scoped>
.utility-header {
  height: 60px;
  display: flex;
  align-items: stretch;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid var(--border-subtle);
}

.hitbox-button {
  appearance: none;
  background: transparent;
  border: none;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: var(--border-subtle);
  }

  .button-primary {
    pointer-events: none;
  }

  &.is-active .button-primary {
    background: rgba(100, 108, 255, 0.2);
    border-color: var(--color-primary);
  }
}

.fractal-title-widget {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--border-subtle);
  }

  &.is-active {
    background: rgba(255, 255, 255, 0.1);
    .chevron-icon {
      opacity: 1;
    } /* Inherits the formula color when open */
  }
}

.formula-display-name {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 28px;
  font-size: 16px; /* Bigger, since we have space now */
  transition: color 0.3s ease;
  /* Prevent text jumping if names are long */
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chevron-wrapper {
  display: flex;
  align-items: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: rotate(-90deg);

  &.is-flipped {
    transform: rotate(90deg);
  }
}

.chevron-icon {
  width: 18px;
  height: 18px;
  opacity: 0.6;
}

.settings-gear.spinning {
  transform: rotate(90deg);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
