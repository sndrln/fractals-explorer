<script setup lang="ts">
import { ref } from "vue";
import { useFractalEngine } from "./composables/useFractalEngine";
import { useMouseInteraction } from "./composables/useMouseInteraction";
import { useFractalStore } from "./store/fractalStore";
import FractalUI from "./components/FractalUI.vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const store = useFractalStore();

useFractalEngine(canvasRef);
useMouseInteraction(canvasRef);
</script>

<template>
  <div
    class="app-container"
    :class="{
      'selecting-x': store.activeTargetAxis === 'x',
      'selecting-y': store.activeTargetAxis === 'y',
    }"
  >
    <FractalUI />
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style>
.app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: #050505;
  overflow: hidden;
}

/* Change the cursor globally when selecting a target */
.app-container.selecting-x,
.app-container.selecting-y {
  cursor: crosshair !important;
}

/* Optional: Make the formula look "High-Voltage" when picking */
.app-container.selecting-x #formula-display,
.app-container.selecting-y #formula-display {
  background: rgba(100, 108, 255, 0.05);
  box-shadow: 0 0 20px rgba(100, 108, 255, 0.2);
  border-radius: 8px;
}

.ui-panel {
  width: 350px;
  height: 100%;
  background: rgba(15, 15, 15, 0.9);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  z-index: 10;
  color: white;
}

canvas {
  flex-grow: 1;
  height: 100%;
}

hr {
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 20px 0;
}
</style>
