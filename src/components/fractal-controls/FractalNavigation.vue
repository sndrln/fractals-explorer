<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import FormulaDisplay from "./FormulaDisplay.vue";
import type { FormulaDefinition } from "../../types/ui";
import { useFractalStore } from "../../store/useFractalStore";
import { FORMULAS } from "../../constants/formulas";
import { useViewStore } from "../../store/useViewStore";

const fractal = useFractalStore();
const isOpen = ref(false);
const activeTab = ref(0);

const categories = [
  { id: "escape", name: "Escape Time", color: "#ff4b2b" },
  { id: "newton", name: "Newton", color: "#2196f3" },
  { id: "nova", name: "Nova", color: "#9c27b0" },
  { id: "kleinian", name: "Kleinian", color: "#4caf50" },
];

// Get formulas for the currently HIGHLIGHTED tab in the menu
const hoveredFormulas = computed(() => {
  return FORMULAS.filter(
    (formula: FormulaDefinition) =>
      formula.fractalType === categories[activeTab.value].id,
  );
});

const handleKeyDown = (e: KeyboardEvent) => {
  const key = parseInt(e.key);

  // 1-4 Keys: Tab Switching / Opening
  if (key >= 1 && key <= 4 && !isOpen.value) {
    activeTab.value = key - 1;
    isOpen.value = true;
    useViewStore().openUi();
    return;
  }

  // 0-9 Keys: Selection (Only when open)
  if (isOpen.value && !isNaN(key)) {
    // We'll treat '0' as the 10th item
    const index = key === 0 ? 9 : key - 1;
    const target = hoveredFormulas.value[index];

    if (target) {
      fractal.setFormula(target.id);
      isOpen.value = false;
    }
  }

  if (e.key === "Escape") isOpen.value = false;
};

onMounted(() => window.addEventListener("keydown", handleKeyDown));
onUnmounted(() => window.removeEventListener("keydown", handleKeyDown));

// Helper to get image path
const getThumb = (id: string) =>
  new URL(`../../assets/thumbs/${id}.webp`, import.meta.url).href;
</script>

<template>
  <div class="fractal-nav">
    <div class="master-widget" @click="isOpen = !isOpen">
      <div class="header-row">
        <span
          class="type-label"
          :style="{
            color: categories.find((c) => c.id === fractal.currentType)?.color,
          }"
        >
          {{ fractal.currentType.toUpperCase() }}
        </span>
        <div class="fractal-name">
          {{
            FORMULAS.find(
              (formula: FormulaDefinition) => formula.id === fractal.formulaId,
            )?.name
          }}
        </div>
        <span class="chevron">{{ isOpen ? "▲" : "▼" }}</span>
      </div>

      <FormulaDisplay class="main-formula" />
    </div>

    <Transition name="panel-zoom">
      <div v-if="isOpen" class="overlay">
        <div class="overlay-tabs">
          <button
            v-for="(cat, i) in categories"
            :key="cat.id"
            :class="{ active: activeTab === i }"
            :style="{ '--accent': cat.color }"
            @click="activeTab = i"
          >
            <span class="num">{{ i + 1 }}</span> {{ cat.name }}
          </button>
        </div>

        <div
          class="tiles-container"
          :style="{ borderTopColor: categories[activeTab].color }"
        >
          <div
            v-for="(f, i) in hoveredFormulas"
            :key="f.id"
            class="tile"
            @click="
              fractal.setFormula(f.id);
              isOpen = false;
            "
          >
            <div class="thumb-wrapper">
              <img :src="getThumb(f.id)" :alt="f.name" />
              <div class="tile-index" v-if="i < 10">{{ (i + 1) % 10 }}</div>
            </div>
            <div class="tile-meta">
              <div class="tile-name">{{ f.name }}</div>
              <FormulaDisplay :formula="f.displayString" class="tile-formula" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.fractal-nav {
  position: relative;
}

.master-widget {
  background: #111;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    border-color: #555;
  }
}

.header-row {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.fractal-name {
  margin-left: auto;
  margin-right: 10px;
}

.main-formula {
  font-size: 14px;
  opacity: 0.8;
  margin-top: 4px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #0a0a0a;
  z-index: 1000;

  display: flex;
  flex-direction: column;
}

.overlay-tabs {
  height: 55px;
  display: flex;
  button {
    flex: 1;
    padding: 12px;
    border: none;
    background: #151515;
    color: #666;
    font-weight: bold;
    cursor: pointer;
    &.active {
      background: var(--accent);
      color: white;
    }
    .num {
      opacity: 0.5;
      font-size: 0.8em;
      margin-right: 5px;
    }
  }
}

.tiles-container {
  flex: 1; /* Take up all remaining space in the .overlay */
  overflow-y: auto; /* Enable vertical scrolling */
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: calc(100vh - 55px);
  gap: 10px;
  padding: 15px;
  border-top: 4px solid;

  /* Modern CSS scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    &:hover {
      /* Uses the --accent variable from your tab buttons */
      background: var(--accent, #646cff);
    }
  }
}

.tile {
  background: #181818;
  border-radius: 4px;
  min-height: 100px;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    background: #222;
  }

  .thumb-wrapper {
    height: 80px;
    background: #000;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .tile-index {
      position: absolute;
      top: 4px;
      left: 6px;
      background: rgba(0, 0, 0, 0.7);
      padding: 2px 5px;
      font-size: 10px;
      border-radius: 3px;
    }
  }
  .tile-meta {
    padding: 8px;
  }
  .tile-name {
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 4px;
  }
  .tile-formula {
    font-size: 10px;
    opacity: 0.6;
  }
}

/* Transitions */
.panel-zoom-enter-active,
.panel-zoom-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.panel-zoom-enter-from,
.panel-zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
