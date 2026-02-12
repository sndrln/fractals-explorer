import { onMounted, onUnmounted, shallowRef, watch, type Ref } from "vue";
import { FractalEngine } from "../engine/FractalEngine";
import { useCameraStore } from "../store/useCameraStore";
import { useColoringStore } from "../store/useColoringStore";
import { useFractalStore } from "../store/useFractalStore";
import { useGraphicsStore } from "../store/useGraphicsStore";
import { useInputStore } from "../store/useInputStore";
import { useModifierStore } from "../store/useModifierStore";
import { usePaletteStore } from "../store/usePaletteStore";

const engineInstance = shallowRef<FractalEngine | null>(null);

export function useFractalEngine(canvasRef?: Ref<HTMLCanvasElement | null>) {
  const fractal = useFractalStore();
  const input = useInputStore();
  const camera = useCameraStore();
  const palette = usePaletteStore();
  const modifier = useModifierStore();
  const coloring = useColoringStore();
  const graphics = useGraphicsStore();

  const state = {
    fractal,
    input,
    camera,
    palette,
    modifier,
    coloring,
    graphics,
  };

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
      // Updated to match new ModifiedParameter keys and ModifierConfig structure
      modifiers: modifier.modifiers,
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
      w = res.width * scale;
      h = res.height * scale;
    } else {
      w = window.innerWidth * dpr * scale;
      h = window.innerHeight * dpr * scale;
    }

    engineInstance.value?.setResolution(w, h);
  };

  watch(
    [
      () => fractal.formulaId,
      // Watching the specific modifierId inside the config objects
      () => modifier.modifiers.zPrev.modifierId,
      () => modifier.modifiers.z.modifierId,
      () => modifier.modifiers.c.modifierId,
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
