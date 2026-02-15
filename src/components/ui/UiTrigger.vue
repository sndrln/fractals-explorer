<script setup lang="ts">
import { useUiPanelStore } from "../../store/useUiPanelStore";

const ui = useUiPanelStore();
</script>

<template>
  <div
    class="ui-edge-sliver"
    :class="{ 'is-hidden': ui.isUiPanelVisible }"
    @click="ui.toggleUiPanel"
  >
    <div class="glow-line"></div>
    <div class="hint-arrow">〉</div>
  </div>
</template>

<style scoped>
.ui-edge-sliver {
  position: fixed;
  top: 0;
  left: 0;
  width: 12px; /* The "hitbox" area */
  height: 100vh;
  z-index: 9999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ui-edge-sliver.is-hidden {
  display: none;
}

/* The actual visual line */
.glow-line {
  position: absolute;
  left: 0;
  top: 0;
  width: 2px;
  height: 100%;
  background: var(--bg-elevated);
  opacity: 0;
  transition:
    opacity 0.3s ease,
    width 0.3s ease;
}

.hint-arrow {
  color: white;
  font-size: 14px;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  user-select: none;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

/* Hover Effects */
.ui-edge-sliver:hover .glow-line {
  opacity: 0.6;
  width: 4px;
}

.ui-edge-sliver:hover .hint-arrow {
  opacity: 1;
  transform: translateX(2px);
}

/* Add a subtle gradient background on hover to show the hit area */
.ui-edge-sliver:hover {
  background: linear-gradient(to right, rgba(255, 255, 255, 0.05), transparent);
}
</style>
