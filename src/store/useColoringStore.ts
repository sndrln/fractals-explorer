import { defineStore } from "pinia";
import { ref } from "vue";
import type { ColoringMode } from "../types/coloring";

export const useColoringStore = defineStore("coloring", () => {
  const modes: { label: string; value: ColoringMode }[] = [
    { label: "Default", value: "DEFAULT" },
    { label: "Orbit Trap", value: "ORBIT_TRAP" },
    { label: "Stalks", value: "STALKS" },
    { label: "Curvature", value: "CURVATURE" },
    { label: "Stripes", value: "STRIPES" },
    { label: "Grid", value: "GRID" },
    { label: "Delta", value: "DELTA" },
    { label: "Binary", value: "BINARY" },
    { label: "Exp", value: "EXP" },
  ];

  const currentMode = ref<ColoringMode>("DEFAULT");

  const nextMode = () => {
    const index = modes.findIndex((m) => m.value === currentMode.value);
    currentMode.value = modes[(index + 1) % modes.length].value;
  };

  const prevMode = () => {
    const index = modes.findIndex((m) => m.value === currentMode.value);
    currentMode.value = modes[(index - 1 + modes.length) % modes.length].value;
  };

  return { modes, currentMode, nextMode, prevMode };
});
