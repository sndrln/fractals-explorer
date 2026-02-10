import { onMounted, onUnmounted, shallowRef, watch, type Ref } from "vue";
import { FractalEngine } from "../engine/FractalEngine";
import { useColoringStore } from "../store/useColoringStore";
import { useFractalStore } from "../store/useFractalStore";
import { useGraphicsStore } from "../store/useGraphicsStore";
import { useInputStore } from "../store/useInputStore";
import { useMemoryStore } from "../store/useMemoryStore";
import { usePaletteStore } from "../store/usePaletteStore";
import { useViewStore } from "../store/useViewStore";

const engineInstance = shallowRef<FractalEngine | null>(null);

export function useFractalEngine(canvasRef?: Ref<HTMLCanvasElement | null>) {
  const fractal = useFractalStore();
  const input = useInputStore();
  const view = useViewStore();
  const palette = usePaletteStore();
  const memory = useMemoryStore();
  const coloring = useColoringStore();
  const graphics = useGraphicsStore();

  const state = { fractal, input, view, palette, memory, coloring, graphics };

  const init = () => {
    if (canvasRef?.value && !engineInstance.value) {
      engineInstance.value = new FractalEngine(canvasRef.value);

      syncShader();
      syncResolution();
      engineInstance.value.render(state);
    }
  };

  const syncShader = () => {
    engineInstance.value?.updateActiveShader({
      formulaId: fractal.formulaId,
      memoryMode: memory.currentMode,
      coloringMode: coloring.currentMode,
      useSSAA: graphics.useSSAA,
    });
  };

  const syncResolution = () => {
    const res = graphics.activeResolution;
    const scale = graphics.internalScale;
    const dpr = window.devicePixelRatio || 1;

    let w: number;
    let h: number;

    if (graphics.isManual && res.width && res.height) {
      // 1. Manual Mode: Use the preset dimensions
      w = res.width * scale;
      h = res.height * scale;
    } else {
      // 2. Native Mode: Use the current window size
      w = window.innerWidth * dpr * scale;
      h = window.innerHeight * dpr * scale;
    }

    engineInstance.value?.setResolution(w, h);
  };

  watch(
    [
      () => fractal.formulaId,
      () => memory.currentMode,
      () => coloring.currentMode,
      () => graphics.useSSAA,
    ],
    syncShader,
  );

  watch(
    [() => graphics.activeResolution, () => graphics.internalScale],
    syncResolution,
  );

  if (canvasRef) init();

  onMounted(() => {
    window.addEventListener("resize", syncResolution);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", syncResolution);
  });

  return {
    engine: engineInstance,
    startRecording: (dur?: number) =>
      engineInstance.value?.startRecording(dur || 15, state),
  };
}
