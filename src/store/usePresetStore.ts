import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import { useFractalStore } from "./useFractalStore";
import { useViewStore } from "./useViewStore";
import { usePaletteStore } from "./usePaletteStore";
import { useInputStore } from "./useInputStore";
import type { Preset } from "../types/preset";
import { useMemoryStore } from "./useMemoryStore";
import { useColoringStore } from "./useColoringStore";

export const usePresetStore = defineStore("presets", () => {
  const fractal = useFractalStore();
  const view = useViewStore();
  const palette = usePaletteStore();
  const input = useInputStore();
  const memory = useMemoryStore();
  const coloring = useColoringStore();

  const savedPresets = ref<Preset[]>(
    JSON.parse(localStorage.getItem("fractal_presets") || "[]"),
  );

  const currentPresetIndex = ref<number>(-1);

  const currentPresetName = computed(() => {
    if (currentPresetIndex.value === -1 || savedPresets.value.length === 0) {
      return "Presets";
    }
    return savedPresets.value[currentPresetIndex.value]?.label || "None";
  });

  watch(
    savedPresets,
    (newPresets) => {
      localStorage.setItem("fractal_presets", JSON.stringify(newPresets));
    },
    { deep: true },
  );

  function applyPreset(preset: Preset, index?: number) {
    if (index !== undefined) currentPresetIndex.value = index;

    fractal.formulaId = preset.formulaId;
    memory.currentMode = preset.memoryMode || "NONE";
    coloring.currentMode = preset.coloringMode || "DEFAULT";
    fractal.params.slider = { ...preset.fractalParams };
    fractal.updateAnchorParams();

    view.zoom = preset.zoom;
    view.offset.x = preset.offset.x;
    view.offset.y = preset.offset.y;

    palette.setPalette(preset.palette);
    input.bindings = JSON.parse(JSON.stringify(preset.bindings));
  }

  function nextPreset() {
    if (savedPresets.value.length === 0) return;
    const nextIndex =
      (currentPresetIndex.value + 1) % savedPresets.value.length;
    applyPreset(savedPresets.value[nextIndex], nextIndex);
  }

  function prevPreset() {
    const length = savedPresets.value.length;
    if (length === 0) return;
    let prevIndex = (currentPresetIndex.value - 1 + length) % length;

    if (currentPresetIndex.value <= 0) {
      prevIndex = length - 1;
    } else {
      prevIndex = currentPresetIndex.value - 1;
    }

    applyPreset(savedPresets.value[prevIndex], prevIndex);
  }

  function saveCurrentAsPreset(label: string) {
    // TODO
    delete (fractal.params.slider as any)._gsap;
    const newPreset: Preset = {
      label,
      fractalType: fractal.currentType,
      formulaId: fractal.formulaId,
      memoryMode: memory.currentMode,
      coloringMode: coloring.currentMode,
      fractalParams: { ...fractal.params.slider },
      bindings: JSON.parse(JSON.stringify(input.bindings)),
      intensity: input.intensity,
      zoom: view.zoom,
      offset: { x: view.offset.x, y: view.offset.y },
      palette: JSON.parse(JSON.stringify(palette.selectedPalette)),
    };

    savedPresets.value.push(newPreset);
    currentPresetIndex.value = savedPresets.value.length - 1; // Focus on the new one
  }

  function deletePreset(index: number) {
    savedPresets.value.splice(index, 1);
    // Adjust index if we deleted the current or preceding item
    if (currentPresetIndex.value >= index) {
      currentPresetIndex.value = Math.max(-1, currentPresetIndex.value - 1);
    }
  }

  return {
    savedPresets,
    currentPresetIndex,
    currentPresetName,
    saveCurrentAsPreset,
    applyPreset,
    deletePreset,
    nextPreset,
    prevPreset,
  };
});
