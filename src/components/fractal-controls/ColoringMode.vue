<script setup lang="ts">
import { useColoringStore } from "../../store/useColoringStore";

const coloring = useColoringStore();

const handleModeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  coloring.currentMode = target.value as any;
};
</script>

<template>
  <div class="control-group">
    <label class="control-label">Coloring Mode</label>
    <select
      :value="coloring.currentMode"
      @change="handleModeChange"
      class="mode-dropdown"
    >
      <option
        v-for="mode in coloring.modes"
        :key="mode.value"
        :value="mode.value"
      >
        {{ mode.label }}
      </option>
    </select>
  </div>
</template>

<style lang="scss" scoped>
.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.control-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}
.mode-dropdown {
  background: var(--bg-surface);
  color: var(--text-primary);
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s;
  &:hover {
    border-color: var(--color-primary);
  }
}
</style>
