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
  padding: 10px 0;
}
.control-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #888;
}
.mode-dropdown {
  background: #1a1a1a;
  color: #eee;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s;
  &:hover {
    border-color: #646cff;
  }
}
</style>
