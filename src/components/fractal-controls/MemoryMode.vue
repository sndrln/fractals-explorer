<script setup lang="ts">
import { useMemoryStore } from "../../store/useMemoryStore";

const memory = useMemoryStore();

const handleModeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  memory.currentMode = target.value as any;
};
</script>

<template>
  <div class="control-group">
    <label class="control-label">Memory Operator</label>
    <select
      :value="memory.currentMode"
      @change="handleModeChange"
      class="mode-dropdown"
    >
      <option
        v-for="mode in memory.modes"
        :key="mode.value"
        :value="mode.value"
      >
        {{ mode.label }}
      </option>
    </select>
  </div>
</template>

<style lang="scss" scoped>
/* Identical styles to maintain UI consistency */
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
  border: 1px solid var(--border-medium);
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    border-color: var(--color-primary);
  }
}
</style>
