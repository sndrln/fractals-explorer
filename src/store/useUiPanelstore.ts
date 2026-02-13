import { defineStore } from "pinia";
import { ref } from "vue";
import type { ParameterId } from "../types/parameter";
import type { ActivePanelTab } from "../types/ui";

export const useUiPanelStore = defineStore("uiPanel", () => {
  const isUiPanelVisible = ref(true);
  const isFractalSelectionOpen = ref(false);
  const activeTab = ref<ActivePanelTab>("controls");

  const activeParameter = ref<ParameterId | null>(null);

  const toggleUiPanel = () =>
    (isUiPanelVisible.value = !isUiPanelVisible.value);
  const toggleFractalSelection = () =>
    (isFractalSelectionOpen.value = !isFractalSelectionOpen.value);
  const toggleSettings = (): void => {
    activeTab.value = activeTab.value === "settings" ? "controls" : "settings";
    isFractalSelectionOpen.value = false;
  };
  const setActiveParameter = (parameterId: ParameterId | null) => {
    activeParameter.value = parameterId;
  };

  return {
    isUiPanelVisible,
    isFractalSelectionOpen,
    activeTab,
    activeParameter,
    toggleUiPanel,
    toggleFractalSelection,
    toggleSettings,
    setActiveParameter,
  };
});
