<script setup lang="ts">
import { ref } from "vue";
import { useFractalStore, palettes } from "../store/fractalStore";
import { getPaletteCSS } from "../utils/getPaletteCss";

const store = useFractalStore();
const isOpen = ref(false);

const selectPalette = (id: number) => {
  store.setPalette(id);
  isOpen.value = false;
};
</script>

<template>
  <div class="palette-dropdown">
    <button class="dropdown-trigger" @click="isOpen = !isOpen">
      <div
        class="preview-bar"
        :style="{
          background: getPaletteCSS(palettes[store.selectedPalette]),
        }"
      ></div>
      <span class="arrow">{{ isOpen ? "▲" : "▼" }}</span>
    </button>

    <transition name="fade">
      <div v-if="isOpen" class="dropdown-menu">
        <div class="palette-grid">
          <div
            v-for="p in palettes"
            :key="p.id"
            class="palette-brick"
            :class="{ active: store.selectedPalette === p.id }"
            :style="{
              background: getPaletteCSS(p),
            }"
            @click="selectPalette(p.id)"
          >
            <div v-if="store.selectedPalette === p.id" class="check">✓</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.palette-dropdown {
  position: relative;
  width: 100%;
  margin: 10px 0;
}

.dropdown-trigger {
  width: 100%;
  height: 32px;
  background: rgba(255, 255, 255, 0.05);
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
  color: #888;
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 8px;
  z-index: 100;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

/* 4-Column Grid */
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
  transition: transform 0.1s, border-color 0.2s;
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

/* Simple Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
