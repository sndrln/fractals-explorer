import { defineStore } from "pinia";
import { computed, ref } from "vue";

export type QualityLevel = "low" | "medium" | "high" | "ultra" | "custom";

export interface ResolutionConfig {
  label: string;
  width?: number;
  height?: number;
  scale: number;
}

export const useGraphicsStore = defineStore("graphics", () => {
  const qualityLevel = ref<QualityLevel>("medium");
  const fpsCap = ref(60);
  const useSSAA = ref(false);
  const resolutionPreset = ref("native");

  const QUALITY_PRESETS: Record<Exclude<QualityLevel, "custom">, any> = {
    low: { useSSAA: false, fpsCap: 30, iterLimit: 250, scale: 0.5 },
    medium: { useSSAA: false, fpsCap: 60, iterLimit: 800, scale: 1.0 },
    high: { useSSAA: true, fpsCap: 60, iterLimit: 1500, scale: 1.0 },
    ultra: { useSSAA: true, fpsCap: 60, iterLimit: 5000, scale: 1.0 },
  };

  const RESOLUTION_MODES: Record<string, ResolutionConfig> = {
    native: { label: "Native (Window)", scale: 1.0 },
    "720p": { label: "HD (720p)", width: 1280, height: 720, scale: 1.0 },
    "1080p": {
      label: "Full HD (1080p)",
      width: 1920,
      height: 1080,
      scale: 1.0,
    },
    "4k": { label: "4K (Ultra HD)", width: 3840, height: 2160, scale: 1.0 },
    smartphone: {
      label: "Mobile (Vertical)",
      width: 1080,
      height: 1920,
      scale: 1.0,
    },
  };

  const isManual = computed(() => resolutionPreset.value !== "native");

  const activeResolution = computed(
    () => RESOLUTION_MODES[resolutionPreset.value],
  );

  const internalScale = computed(() => {
    if (qualityLevel.value === "custom") return 1.0;
    return QUALITY_PRESETS[qualityLevel.value].scale;
  });

  const currentIterationLimit = computed(() => {
    if (qualityLevel.value === "custom") return 10000;
    return QUALITY_PRESETS[qualityLevel.value].iterLimit;
  });

  function setQuality(level: QualityLevel) {
    qualityLevel.value = level;
    if (level !== "custom") {
      const p = QUALITY_PRESETS[level];
      useSSAA.value = p.useSSAA;
      fpsCap.value = p.fpsCap;
    }
  }

  function toggleSSAA() {
    useSSAA.value = !useSSAA.value;
    qualityLevel.value = "custom";
  }

  return {
    qualityLevel,
    fpsCap,
    useSSAA,
    resolutionPreset,
    RESOLUTION_MODES,
    isManual,
    currentIterationLimit,
    activeResolution,
    internalScale,
    setQuality,
    toggleSSAA,
  };
});
