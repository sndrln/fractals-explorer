<script setup lang="ts">
import { useFractalStore } from "../store/fractalStore";

const store = useFractalStore();
const getVarColor = (varName: string): string => {
  const colors: Record<string, string> = {
    relaxation: "#ff6464",
    powerMain: "#64ff64",
    juliaMorph: "#ff00aa",
  };
  return colors[varName] || "#646cff";
};
</script>

<template>
  <div class="axis-container">
    <div
      v-for="axis in (['x', 'y'] as const)"
      :key="axis"
      class="axis-well"
      :class="{ active: store.activeTargetAxis === axis }"
    >
      <div class="well-header">
        <span>Mouse {{ axis.toUpperCase() }}</span>
        <button @click.stop="store.toggleTargetAxis(axis)" class="plus-btn">
          +
        </button>
      </div>
      <div class="pill-box">
        <div
          v-for="v in axis === 'x' ? store.bindingsX : store.bindingsY"
          :key="v"
          class="pill"
          :style="{ borderColor: getVarColor(v) }"
        >
          {{ v }} <span @click="store.unbindVariable(v, axis)">×</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.axis-container {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
.axis-well {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px;
  min-height: 60px;
  transition: all 0.3s;
}
.axis-well.active {
  border-color: #646cff;
  background: rgba(100, 108, 255, 0.1);
}
.well-header {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 5px;
}
.plus-btn {
  background: none;
  border: 1px solid #555;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  padding: 0 5px;
}
.pill-box {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.pill {
  font-size: 11px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.3);
  border-left: 3px solid;
  border-radius: 3px;
  display: flex;
  gap: 5px;
}
.pill span {
  cursor: pointer;
  opacity: 0.5;
}
.pill span:hover {
  opacity: 1;
}
</style>
