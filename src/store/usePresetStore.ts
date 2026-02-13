import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import type { Preset } from "../types/preset";
import { generateId } from "../utils/generateId";
import { useCameraStore } from "./useCameraStore";
import { useColoringStore } from "./useColoringStore";
import { useFractalStore } from "./useFractalStore";
import { useInputStore } from "./useInputStore";
import { usePaletteStore } from "./usePaletteStore";

export const usePresetStore = defineStore("presets", () => {
  const fractal = useFractalStore();
  const camera = useCameraStore();
  const palette = usePaletteStore();
  const input = useInputStore();
  // const modifier = useModifierStore();
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

    // Distribute data to the specific stores
    fractal.formulaId = preset.formulaId;
    // modifier.modifiers = { ...preset.modifiers };
    coloring.currentMode = preset.coloringMode || "DEFAULT";
    fractal.parameters.slider = { ...preset.parameterValues };

    // We do NOT load configMap anymore, as it is deprecated
    fractal.updateAnchorParameters();

    camera.zoom = preset.cameraZoom;
    camera.offset = { ...preset.cameraOffset };

    palette.setPalette(preset.palette);
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
    // Clean up GSAP internal properties if they exist
    const cleanValues = { ...fractal.parameters.slider };
    delete (cleanValues as any)._gsap;

    const newPreset: Preset = {
      id: generateId(),
      label,
      fractalType: fractal.currentType,
      formulaId: fractal.formulaId,
      maxIterations: fractal.maxIterations,
      // Removed parameterConfigMap
      parameterValues: cleanValues,
      // modifiers: JSON.parse(JSON.stringify(modifier.modifiers)),
      coloringMode: coloring.currentMode,
      sensitivity: input.sensitivity,
      cameraZoom: camera.zoom,
      cameraOffset: { ...camera.offset },
      palette: JSON.parse(JSON.stringify(palette.selectedPalette)),
    };

    savedPresets.value.push(newPreset);
    localStorage.setItem("fractal_presets", JSON.stringify(savedPresets.value));
  }

  function deletePreset(id: string) {
    const index = savedPresets.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      savedPresets.value.splice(index, 1);
      localStorage.setItem(
        "fractal_presets",
        JSON.stringify(savedPresets.value),
      );

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
