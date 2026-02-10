<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import FractalUI from "./components/FractalUI.vue";
import { useFractalEngine } from "./composables/useFractalEngine";
import { useKeyboardShortcuts } from "./composables/useKeyboardShortcuts";
import { useMouseInteraction } from "./composables/useMouseInteraction";
import { useFractalStore } from "./store/useFractalStore";
import { useInputStore } from "./store/useInputStore";
import { usePresetStore } from "./store/usePresetStore";

const canvasRef = ref<HTMLCanvasElement | null>(null);
const input = useInputStore();

const engine = useFractalEngine(canvasRef);
useKeyboardShortcuts();
useMouseInteraction(canvasRef);

const route = useRoute();
const router = useRouter();
const fractal = useFractalStore();
const preset = usePresetStore();

watch(
  () => [route.params.formulaId, route.params.presetId],
  ([formulaId, presetId]) => {
    if (formulaId && formulaId !== fractal.formulaId) {
      fractal.setFormula(formulaId as string);
    }

    if (presetId) {
      if (presetId !== preset.currentPresetId) {
        preset.loadPresetById(presetId as string);
      }
    } else {
      preset.currentPresetId = null;
    }
  },
  { immediate: true },
);

watch(
  () => [fractal.formulaId, preset.currentPresetId],
  ([formulaId, presetId]) => {
    // Construct path: /mandelbrot or /mandelbrot/a1b2c3d4
    const targetPath = presetId ? `/${formulaId}/${presetId}` : `/${formulaId}`;

    if (route.path !== targetPath) {
      router.push(targetPath);
    }
  },
);

onMounted(() => {
  // 2. Now that the component is mounted, canvasRef.value is the real DOM element.
  // We trigger the init manually.
  useFractalEngine(canvasRef);
});
</script>

<template>
  <div
    class="app-container"
    :class="{
      'selecting-x': input.activeAxis === 'x',
      'selecting-y': input.activeAxis === 'y',
    }"
  >
    <FractalUI />
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style lang="scss">
.app-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: var(--bg-app);
  overflow: hidden;
}

.app-container.selecting-x,
.app-container.selecting-y {
  cursor: crosshair !important;
}

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
}

canvas {
  width: 100%; /* Fill the parent width */
  height: 100%; /* Fill the parent height */
  display: block;
  margin: 0 auto;
  object-fit: contain; /* Keeps the fractal's shape if you use fixed aspect ratios */
}

hr {
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 20px 0;
}
</style>
