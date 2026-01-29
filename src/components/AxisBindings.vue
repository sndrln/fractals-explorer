<script setup lang="ts">
import { useFractalStore } from "../store/fractalStore";

const store = useFractalStore();

const getVarColor = (varName: string): string => {
  const colors: Record<string, string> = {
    relaxation: "#ff6464",
    powerMain: "#ffaa00",
    juliaMorph: "#ff00aa",
    subtrahend: "#ffffff",
    powerDerivative: "#00ffaa",
  };
  return colors[varName] || "#646cff";
};

const getBindings = (axis: "x" | "y") =>
  axis === "x" ? store.bindingsX : store.bindingsY;
</script>

<template>
  <div class="axis-container">
    <div
      v-for="axis in ['x', 'y'] as const"
      :key="axis"
      class="axis-well"
      :class="{
        active: store.activeTargetAxis === axis,
        empty: getBindings(axis).length === 0,
      }"
      @click="store.toggleTargetAxis(axis)"
    >
      <div class="well-header">
        <span>Mouse {{ axis.toUpperCase() }}</span>
        <div v-if="getBindings(axis).length > 0" class="plus-btn-small">+</div>
      </div>

      <div v-if="getBindings(axis).length > 0" class="pill-box">
        <div
          v-for="v in getBindings(axis)"
          :key="v"
          class="pill"
          :style="{ borderColor: getVarColor(v) }"
          title="Click to remove"
          @click.stop="store.unbindVariable(v, axis)"
        >
          {{ v }}
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="big-plus">+</div>
        <span class="empty-text">Bind variable</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.axis-container {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.axis-well {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  min-height: 80px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
}

.axis-well:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.2);
}

.axis-well.active {
  border-color: #646cff;
  background: rgba(100, 108, 255, 0.12);
  box-shadow: 0 0 15px rgba(100, 108, 255, 0.1);
}

.well-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #666;
  margin-bottom: 8px;
}

.axis-well.active .well-header {
  color: #aaa;
}

.plus-btn-small {
  font-size: 16px;
  line-height: 1;
  color: #888;
}

.pill-box {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pill {
  font-size: 11px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.4);
  border-left: 3px solid;
  border-radius: 4px;
  color: #eee;
  transition:
    transform 0.1s,
    background 0.2s;
}

.pill:hover {
  background: rgba(255, 0, 0, 0.2);
  transform: translateY(-1px);
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
  transition: opacity 0.2s;
}

.axis-well:hover .empty-state {
  opacity: 0.6;
}

.big-plus {
  font-size: 24px;
  font-weight: 200;
  margin-bottom: 2px;
}

.empty-text {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.axis-well.active .empty-state {
  opacity: 0.8;
  color: #646cff;
}
</style>
