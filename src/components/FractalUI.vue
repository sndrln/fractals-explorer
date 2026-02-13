<script setup lang="ts">
import { computed } from "vue";
import { useUiPanelStore } from "../store/useUiPanelstore";
import FractalDashboard from "./FractalDashboard.vue";
import FractalHeader from "./FractalHeader.vue";
import FractalNavigation from "./FractalNavigation.vue";
import GraphicsSettings from "./GraphicsSettings.vue";

const uiPanel = useUiPanelStore();

const activePanel = computed(() => {
  return uiPanel.activeTab === "settings" ? GraphicsSettings : FractalDashboard;
});
</script>

<template>
  <Transition name="ui-fade">
    <div id="ui-shell" v-show="uiPanel.isUiPanelVisible">
      <FractalHeader />

      <div class="main-container">
        <FractalNavigation />

        <div class="scroll-area">
          <Transition name="fade-slide" mode="out-in">
            <component :is="activePanel" />
          </Transition>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
#ui-shell {
  position: absolute;
  width: 360px;
  z-index: 100;
  background: rgba(10, 10, 10, 0.85);
  border-bottom-right-radius: 10px;
  backdrop-filter: blur(5px);
}

.main-container {
  flex: 1;
  position: relative;
  height: 100%;
}

.scroll-area {
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
}

/* Animations */
.ui-fade-enter-active,
.ui-fade-leave-active {
  transition: all 0.4s ease;
}
.ui-fade-enter-from,
.ui-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
