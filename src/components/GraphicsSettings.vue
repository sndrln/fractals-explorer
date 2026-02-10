<script setup lang="ts">
import { useGraphicsStore, type QualityLevel } from "../store/useGraphicsStore";

const graphics = useGraphicsStore();
const qualityLevels: QualityLevel[] = ["low", "medium", "high", "ultra"];
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
      <label class="settings-label">Target Resolution</label>
      <div class="select-wrapper">
        <select v-model="graphics.resolutionPreset" class="settings-select">
          <option
            v-for="(res, id) in graphics.RESOLUTION_MODES"
            :key="id"
            :value="id"
          >
            {{ res.label }}
          </option>
        </select>
      </div>
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

/* Custom Select Dropdowns */
.settings-select {
  appearance: none;
  background: var(--border-subtle);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  width: 100%;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: rgba(59, 130, 246, 0.5);
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
</style>
