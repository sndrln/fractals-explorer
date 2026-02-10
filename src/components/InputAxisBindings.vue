<script setup lang="ts">
import { useFractalTheme } from "../composables/useFractalTheme";
import { useInputStore } from "../store/useInputStore";

const input = useInputStore();
const { getVarColor } = useFractalTheme();

const getBindings = (axis: "x" | "y") =>
  axis === "x" ? input.bindings.x : input.bindings.y;

const handleWellClick = (axis: "x" | "y") => {
  input.toggleTargetAxis(axis);
};
</script>

<template>
  <div class="axis-container">
    <div
      v-for="axis in ['x', 'y'] as const"
      :key="axis"
      class="axis-well"
      :class="{
        'is-active': input.activeAxis === axis,
        'is-empty': getBindings(axis).length === 0,
      }"
      @click="handleWellClick(axis)"
    >
      <div v-if="input.activeAxis === axis" class="active-glow"></div>

      <div class="well-header">
        <span class="axis-label">Mouse {{ axis.toUpperCase() }}</span>
      </div>

      <div v-if="getBindings(axis).length > 0" class="pill-box">
        <div
          v-for="v in getBindings(axis)"
          :key="v"
          class="pill"
          :style="{ borderColor: getVarColor(v), color: getVarColor(v) }"
          title="Click to remove"
          @click.stop="input.unbindVariable(v, axis)"
        >
          {{ v }}
          <span class="remove-x">×</span>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="big-plus">+</div>
        <span class="empty-text">Click to bind variables</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.axis-container {
  display: flex;
  gap: 8px;
}

.axis-well {
  flex: 1;
  min-height: 80px;
  background: var(--border-subtle);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
  color: white;
}

.axis-well:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.axis-well.is-active {
  background: var(--border-medium);
  border-color: var(--color-primary);
}

.active-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(100, 108, 255, 0.1),
    transparent
  );
  animation: slide 2s infinite linear;
}

@keyframes slide {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}

.well-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 10px;
  text-transform: uppercase;
  opacity: 0.6;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.pill-box {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  position: relative;
  z-index: 2;
}

.pill {
  padding: 2px 8px;
  border: 1px solid;
  border-radius: 12px;
  font-size: 11px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 4px;
}

.pill:hover {
  border-color: var(--color-danger) !important;
  color: var(--color-danger) !important;
}

.remove-x {
  font-size: 14px;
  line-height: 1;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 4px;
  opacity: 0.3;
}

.big-plus {
  font-size: 20px;
  margin-bottom: 2px;
}

.empty-text {
  font-size: 10px;
}
</style>
