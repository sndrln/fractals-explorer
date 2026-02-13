<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { FORMULAS } from "../constants/formulas";
import { useFractalStore } from "../store/useFractalStore";
import { useUiPanelStore } from "../store/useUiPanelstore";
import FormulaDisplay from "./fractal-controls/FormulaDisplay.vue";

const fractal = useFractalStore();
const uiPanel = useUiPanelStore();
const activeTab = ref(0);

const categories = [
  { id: "escape", name: "Escape", color: "var(--color-danger)" },
  { id: "newton", name: "Newton", color: "var(--color-info)" },
  { id: "nova", name: "Nova", color: "var(--color-accent)" },
  { id: "kleinian", name: "Kleinian", color: "var(--color-success)" },
];

const hoveredFormulas = computed(() => {
  return FORMULAS.filter(
    (f) => f.fractalType === categories[activeTab.value].id,
  );
});

// Sync active tab with current fractal type on mount
onMounted(() => {
  const idx = categories.findIndex((c) => c.id === fractal.currentType);
  if (idx !== -1) activeTab.value = idx;
});

const handleKeyDown = (e: KeyboardEvent) => {
  const key = parseInt(e.key);
  if (key >= 1 && key <= 4 && !uiPanel.isFractalSelectionOpen) {
    activeTab.value = key - 1;
    uiPanel.isFractalSelectionOpen = true;
    return;
  }
  if (uiPanel.isFractalSelectionOpen && !isNaN(key)) {
    const index = key === 0 ? 9 : key - 1;
    const target = hoveredFormulas.value[index];
    if (target) {
      fractal.setFormula(target.id);
      uiPanel.isFractalSelectionOpen = false;
    }
  }
  if (e.key === "Escape") uiPanel.isFractalSelectionOpen = false;
};

onMounted(() => window.addEventListener("keydown", handleKeyDown));
onUnmounted(() => window.removeEventListener("keydown", handleKeyDown));

const getThumb = (id: string) =>
  new URL(`../assets/thumbs/${id}.webp`, import.meta.url).href;
</script>

<template>
  <Transition name="panel-zoom">
    <div v-if="uiPanel.isFractalSelectionOpen" class="navigation-overlay">
      <div class="tabs">
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
        class="grid"
        :style="{ borderTopColor: categories[activeTab].color }"
      >
        <div
          v-for="(f, i) in hoveredFormulas"
          :key="f.id"
          class="tile"
          :class="{ 'is-current': f.id === fractal.formulaId }"
          @click="
            fractal.setFormula(f.id);
            uiPanel.isFractalSelectionOpen = false;
          "
        >
          <div class="thumb">
            <img :src="getThumb(f.id)" />
            <div class="index">{{ (i + 1) % 10 }}</div>
          </div>
          <div class="meta">
            <div class="name">{{ f.name }}</div>
            <FormulaDisplay class="formula-mini" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.navigation-overlay {
  width: 100%;
  height: calc(100vh - 60px);
  z-index: 50;
  display: flex;
  flex-direction: column;
  color: white;
}

.tabs {
  display: flex;
  height: 48px;
  button {
    flex: 1;
    background: rgba(255, 255, 255, 0.03);
    border: none;
    color: white;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    &.active {
      background: var(--accent);
      color: white;
    }
    .num {
      margin-right: 4px;
    }
  }
}

.grid {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  border-top: 3px solid;
}

.tile {
  background: var(--bg-surface);
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid transparent;
  transition: 0.2s;

  &:hover {
    background: var(--bg-elevated);
  }
  &.is-current {
    border-color: rgba(255, 255, 255, 0.2);
    background: var(--bg-elevated);
  }

  .thumb {
    height: 70px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .index {
      position: absolute;
      bottom: 4px;
      right: 6px;
      font-size: 9px;
      color: white;
    }
  }
  .meta {
    padding: 8px;
  }
  .name {
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 2px;
  }
  .formula-mini {
    font-size: 9px;
  }
}

.panel-zoom-enter-active,
.panel-zoom-leave-active {
  transition: all 0.25s ease;
}
.panel-zoom-enter-from,
.panel-zoom-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}
</style>
