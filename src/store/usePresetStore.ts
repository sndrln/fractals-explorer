import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { useFractalStore } from "./useFractalStore";
import { useViewStore } from "./useViewStore";
import { usePaletteStore } from "./usePaletteStore";
import { useInputStore } from "./useInputStore";
import type { Preset } from "../types/preset";

export const usePresetStore = defineStore("presets", () => {
  const fractalStore = useFractalStore();
  const viewStore = useViewStore();
  const paletteStore = usePaletteStore();
  const inputStore = useInputStore();

  const savedPresets = ref<Preset[]>(
    JSON.parse(localStorage.getItem("fractal_presets") || "[]"),
  );

  watch(
    savedPresets,
    (newPresets) => {
      localStorage.setItem("fractal_presets", JSON.stringify(newPresets));
    },
    { deep: true },
  );

  function saveCurrentAsPreset(label: string) {
    const newPreset: Preset = {
      label,
      fractalType: fractalStore.currentType,
      formulaId: fractalStore.formulaId,
      memoryMode: fractalStore.memoryMode,
      fractalParams: { ...fractalStore.params.slider },
      bindings: JSON.parse(JSON.stringify(inputStore.bindings)),
      zoom: viewStore.zoom,
      offset: { x: viewStore.offset.x, y: viewStore.offset.y },
      palette: JSON.parse(JSON.stringify(paletteStore.selectedPalette)),
    };

    savedPresets.value.push(newPreset);
  }

  function applyPreset(preset: Preset) {
    console.log(preset);

    fractalStore.formulaId = preset.formulaId;
    fractalStore.memoryMode = preset.memoryMode;
    fractalStore.params.slider = { ...preset.fractalParams };
    fractalStore.updateAnchorParams();

    viewStore.zoom = preset.zoom;
    viewStore.offset.x = preset.offset.x;
    viewStore.offset.y = preset.offset.y;

    paletteStore.setPalette(preset.palette);
    inputStore.bindings = JSON.parse(JSON.stringify(preset.bindings));
  }

  function deletePreset(index: number) {
    savedPresets.value.splice(index, 1);
  }

  return {
    savedPresets,
    saveCurrentAsPreset,
    applyPreset,
    deletePreset,
  };
});
