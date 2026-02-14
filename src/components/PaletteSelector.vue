<script setup lang="ts">
import { computed, ref } from "vue";
import { palettes } from "../constants/palettes";
import { usePaletteStore } from "../store/usePaletteStore";
import { getPaletteCSS } from "../utils/getPaletteCss";
import IconChevron from "./icons/IconChevron.vue";
import IconRandom from "./icons/IconRandom.vue";
import BaseDropdown from "./ui/BaseDropdown.vue";

const palette = usePaletteStore();
const dropdown = ref<InstanceType<typeof BaseDropdown> | null>(null);

const paletteOptions = computed(() => {
  return palettes.map((p, index) => ({ value: index, colors: p }));
});

const handlePaletteSelect = (opt: any) => {
  palette.setPaletteByIndex(opt.value);
};

const handleGridClick = (index: number) => {
  palette.setPaletteByIndex(index);
  dropdown.value?.close();
};
</script>

<template>
  <div class="palette-container">
    <div class="dropdown-wrapper">
      <BaseDropdown
        ref="dropdown"
        label="Color Palette"
        v-model="palette.currentIndex"
        :options="paletteOptions"
        identityKey="value"
        @select="handlePaletteSelect"
        menuWidth="240px"
      >
        <template #trigger="{ isOpen, isFocused }">
          <div
            class="interactive-surface palette-trigger"
            :class="{ 'is-focused': isFocused }"
          >
            <div
              class="preview-bar"
              :style="{ background: getPaletteCSS(palette.selectedPalette) }"
            />
            <IconChevron :is-open="isOpen" />
          </div>
        </template>

        <template #list>
          <div class="palette-grid custom-scrollbar">
            <div
              v-for="(p, index) in palettes"
              :key="index"
              class="palette-brick"
              :class="{
                active: !palette.isRandom && palette.currentIndex === index,
              }"
              :style="{ background: getPaletteCSS(p) }"
              @click="handleGridClick(index)"
            >
              <div
                v-if="!palette.isRandom && palette.currentIndex === index"
                class="check"
              >
                ✓
              </div>
            </div>
          </div>
        </template>
      </BaseDropdown>
    </div>

    <button
      class="button-primary randomize-btn"
      @click="palette.generateRandomPalette"
      title="Randomize Colors"
    >
      <IconRandom />
    </button>
  </div>
</template>

<style scoped lang="scss">
.palette-container {
  display: grid;
  grid-template-columns: 1fr 32px;
  align-items: flex-end;
  gap: 8px;
  width: 100%;
}
.dropdown-wrapper {
  min-width: 0;
  width: 100%;
}

.palette-trigger {
  width: 100%;
  height: 32px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  min-width: 0;

  &.is-focused {
    border-color: var(--accent-color);
  }

  .preview-bar {
    flex-grow: 1;
    height: 12px;
    border-radius: 2px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

.palette-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 8px;
}

.palette-brick {
  aspect-ratio: 1;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.1s;

  &:hover {
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.4);
  }
  &.active {
    border: 2px solid var(--accent-color);
  }
}

.check {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-shadow: 0 0 4px black;
  font-weight: bold;
}

.randomize-btn {
  height: 32px;
  width: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
