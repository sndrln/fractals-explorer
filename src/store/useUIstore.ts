import { defineStore } from "pinia";
import { ref } from "vue";

export const useUIStore = defineStore("ui", () => {
  const isUiVisible = ref(true);
  const isNavOpen = ref(false); // New state for formula overlay
  const activeTab = ref<"controls" | "settings">("controls");

  const toggleUi = () => (isUiVisible.value = !isUiVisible.value);
  const openUi = () => (isUiVisible.value = true);
  const toggleNav = () => (isNavOpen.value = !isNavOpen.value);
  const toggleSettings = () => {
    activeTab.value = activeTab.value === "settings" ? "controls" : "settings";
    if (activeTab.value === "settings") isNavOpen.value = false; // Close nav if settings open
  };

  return {
    isUiVisible,
    isNavOpen,
    activeTab,
    toggleUi,
    openUi,
    toggleNav,
    toggleSettings,
  };
});
