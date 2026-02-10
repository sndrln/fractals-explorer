<script setup lang="ts">
import { ref } from "vue";
import { palettes } from "../constants/palettes";
import { usePaletteStore } from "../store/usePaletteStore";
import { getPaletteCSS } from "../utils/getPaletteCss";
import IconRandom from "./icons/IconRandom.vue";

const palette = usePaletteStore();
const isDropdownExpanded = ref(false);
</script>

<template>
  <div class="palette-controls">
    <div class="palette-dropdown">
      <button
        class="dropdown-trigger"
        @click="isDropdownExpanded = !isDropdownExpanded"
      >
        <div
          class="preview-bar"
          :style="{
            background: getPaletteCSS(palette.selectedPalette),
          }"
        ></div>
        <span class="arrow">{{ isDropdownExpanded ? "▲" : "▼" }}</span>
      </button>

      <transition name="fade">
        <div v-if="isDropdownExpanded" class="dropdown-menu">
          <div class="palette-grid">
            <div
              v-for="(p, index) in palettes"
              class="palette-brick"
              :class="{
                active: !palette.isRandom && palette.currentIndex === index,
              }"
              :style="{ background: getPaletteCSS(p) }"
              @click="
                palette.setPaletteByIndex(index);
                isDropdownExpanded = false;
              "
            >
              <div
                v-if="!palette.isRandom && palette.currentIndex === index"
                class="check"
              >
                ✓
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <button
      class="button-primary"
      title="Randomize Colors"
      @click="palette.generateRandomPalette"
    >
      <IconRandom />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.palette-dropdown {
  position: relative;
  flex-grow: 1;
  width: 100%;
}

.palette-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-trigger {
  width: 100%;
  height: 32px;
  background: var(--bg-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
  gap: 10px;
}

.preview-bar {
  flex-grow: 1;
  height: 12px;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.arrow {
  font-size: 10px;
  color: var(--text-secondary);
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background: var(--bg-surface);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 8px;
  z-index: 100;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.palette-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.palette-brick {
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition:
    transform 0.1s,
    border-color 0.2s;
}

.palette-brick:hover {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.5);
}

.palette-brick.active {
  border: 2px solid #646cff;
}

.check {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
  font-size: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
