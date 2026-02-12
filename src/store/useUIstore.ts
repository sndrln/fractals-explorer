import { defineStore } from "pinia";
import { ref } from "vue";
import type { ActivePanelTab } from "../types/ui";

export const useUiPanelStore = defineStore("uiPanel", () => {
  const isUiPanelVisible = ref(true);
  const isFractalSelectionOpen = ref(false);
  const activeTab = ref<ActivePanelTab>("controls");

  // const selectedParameterKey = ref<ParameterKey | null>(null); // to be added

  const toggleUiPanel = () =>
    (isUiPanelVisible.value = !isUiPanelVisible.value);
  const toggleFractalSelection = () =>
    (isFractalSelectionOpen.value = !isFractalSelectionOpen.value);
  const toggleSettings = (): void => {
    activeTab.value = activeTab.value === "settings" ? "controls" : "settings";
    isFractalSelectionOpen.value = false;
  };

  return {
    isUiPanelVisible,
    isFractalSelectionOpen,
    activeTab,
    toggleUiPanel,
    toggleFractalSelection,
    toggleSettings,
  };
});
