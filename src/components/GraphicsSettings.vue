<script setup lang="ts">
import { computed } from "vue";
import BaseDropdown from "./ui/BaseDropdown.vue";

import { useFractalEngine } from "../composables/useFractalEngine";
import { useGraphicsStore } from "../store/useGraphicsStore";
import type { QualityLevel } from "../types/engine";

const graphics = useGraphicsStore();
const fractalEngine = useFractalEngine();
const qualityLevels: QualityLevel[] = ["low", "medium", "high", "ultra"];

const resolutionOptions = computed(() => {
  return Object.entries(graphics.RESOLUTION_MODES).map(([id, res]) => ({
    id,
    label: res.label,
  }));
});

const activeLabel = computed(() => {
  return (
    graphics.RESOLUTION_MODES[graphics.resolutionPreset]?.label ||
    "Select Resolution"
  );
});

const handleSelect = (option: { id: string }) => {
  graphics.resolutionPreset = option.id as any;
};
</script>

<template>
  <div class="graphics-settings-panel">
    <div class="settings-section">
      <label class="settings-label">Render Quality</label>
      <div class="quality-tabs">
        <button
          v-for="level in qualityLevels"
          :key="level"
          @click="graphics.setQuality(level)"
          class="quality-tab-btn"
          :class="{ active: graphics.qualityLevel === level }"
        >
          {{ level }}
        </button>
      </div>
    </div>

    <div class="settings-section">
      <BaseDropdown
        label="Resolution"
        :model-value="graphics.resolutionPreset"
        :options="resolutionOptions"
        identity-key="id"
        :display-value="activeLabel"
        @select="handleSelect"
      />
    </div>

    <div class="settings-section advanced-options">
      <div class="toggle-row">
        <div class="toggle-info">
          <h4 class="option-title">Supersampling (SSAA)</h4>
          <p class="option-desc">
            Renders at 4x internal resolution for edge smoothing.
          </p>
        </div>
        <div
          class="toggle-track"
          :class="{ on: graphics.useSSAA }"
          @click="graphics.toggleSSAA()"
        >
          <div class="toggle-thumb"></div>
        </div>
      </div>

      <div class="toggle-row">
        <div class="toggle-info">
          <h4 class="option-title">Framerate Cap</h4>
          <p class="option-desc">Reduces GPU heat during idle exploration.</p>
        </div>
        <select v-model="graphics.fpsCap" class="mini-select">
          <option :value="30">30 FPS</option>
          <option :value="60">60 FPS</option>
          <option :value="120">Uncapped</option>
        </select>
      </div>
    </div>

    <button
      @click="fractalEngine.startRecording(15)"
      class="button-primary button-record"
      title="Record"
    >
      ◯
    </button>
  </div>
</template>

<style lang="scss" scoped>
.graphics-settings-panel {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: white;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-label {
  font-size: 10px;
  opacity: 0.4;
  font-weight: 700;
}

/* Quality Tab Group */
.quality-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.04);
  padding: 4px;
  border-radius: 8px;
  gap: 4px;
}

.quality-tab-btn {
  flex: 1;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  padding: 8px 0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.03);
  }

  &.active {
    background: var(--border-medium);
    color: var(--text-primary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
}

/* Advanced Options Area */
.advanced-options {
  gap: 20px;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.option-title {
  font-size: 13px;
  font-weight: 500;
  margin: 0 0 2px 0;
}

.option-desc {
  font-size: 10px;
  opacity: 0.4;
  margin: 0;
  line-height: 1.4;
}

/* SSAA Toggle Switch */
.toggle-track {
  width: 42px;
  height: 22px;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;
  flex-shrink: 0;

  &.on {
    background: var(--color-info);
    .toggle-thumb {
      transform: translateX(20px);
    }
  }
}

.toggle-thumb {
  width: 16px;
  height: 16px;
  background: var(--text-primary);
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.mini-select {
  background: transparent;
  color: var(--text-primary);
  font-size: 12px;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2px 0;
  cursor: pointer;
  outline: none;

  option {
    background: var(--bg-surface);
  }
}

.button-record {
  color: var(--color-danger);

  &:hover {
    border-color: var(--color-danger);
  }
}
</style>
