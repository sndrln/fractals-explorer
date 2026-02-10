import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import type { Preset } from "../types/preset";
import { generateId } from "../utils/generateId";
import { useColoringStore } from "./useColoringStore";
import { useFractalStore } from "./useFractalStore";
import { useInputStore } from "./useInputStore";
import { useMemoryStore } from "./useMemoryStore";
import { usePaletteStore } from "./usePaletteStore";
import { useViewStore } from "./useViewStore";

export const usePresetStore = defineStore("presets", () => {
  const fractal = useFractalStore();
  const view = useViewStore();
  const palette = usePaletteStore();
  const input = useInputStore();
  const memory = useMemoryStore();
  const coloring = useColoringStore();
  const router = useRouter();

  const savedPresets = ref<Preset[]>(
    JSON.parse(localStorage.getItem("fractal_presets") || "[]"),
  );

  const currentPresetId = ref<string | null>(null);

  const currentPreset = computed(() =>
    savedPresets.value.find((p) => p.id === currentPresetId.value),
  );

  const currentIndex = computed(() =>
    savedPresets.value.findIndex((p) => p.id === currentPresetId.value),
  );

  const currentPresetName = computed(
    () => currentPreset.value?.label || "Presets",
  );

  function loadPresetById(id: string) {
    const target = savedPresets.value.find((p) => p.id === id);
    if (target) {
      currentPresetId.value = id;
      applyPreset(target);
    }
  }

  function applyPreset(preset: Preset) {
    currentPresetId.value = preset.id;

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
    const nextIndex = (currentIndex.value + 1) % savedPresets.value.length;
    const nextPreset = savedPresets.value[nextIndex];

    router.push(`/${nextPreset.formulaId}/${nextPreset.id}`);
  }

  function prevPreset() {
    const len = savedPresets.value.length;
    if (len === 0) return;
    const prevIndex = (currentIndex.value - 1 + len) % len;
    const prevPreset = savedPresets.value[prevIndex];
    router.push(`/${prevPreset.formulaId}/${prevPreset.id}`);
  }

  function saveCurrentAsPreset(label: string) {
    // TODO
    delete (fractal.params.slider as any)._gsap;
    const newPreset: Preset = {
      id: generateId(),
      label,
      fractalType: fractal.currentType,
      formulaId: fractal.formulaId,
      memoryMode: memory.currentMode,
      coloringMode: coloring.currentMode,
      fractalParams: { ...fractal.params.slider },
      bindings: JSON.parse(JSON.stringify(input.bindings)),
      sensitivity: input.sensitivity,
      zoom: view.zoom,
      offset: { x: view.offset.x, y: view.offset.y },
      palette: JSON.parse(JSON.stringify(palette.selectedPalette)),
    };

    savedPresets.value.push(newPreset);
  }

  function deletePreset(id: string) {
    const index = savedPresets.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      savedPresets.value.splice(index, 1);
      if (currentPresetId.value === id) {
        currentPresetId.value = null;
        router.push(`/${fractal.formulaId}`);
      }
    }
  }

  return {
    savedPresets,
    currentPresetId,
    currentPresetName,
    loadPresetById,
    saveCurrentAsPreset,
    applyPreset,
    deletePreset,
    nextPreset,
    prevPreset,
  };
});
