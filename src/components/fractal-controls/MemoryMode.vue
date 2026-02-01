<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useFractalStore } from "../../store/useFractalStore";
import type { MemoryMode } from "../../types/fractal";

const fractalStore = useFractalStore();

const modes: { label: string; value: MemoryMode }[] = [
  { label: "Standard (None)", value: "NONE" },
  { label: "Absolute (Z)", value: "ABS_BOTH" },
  { label: "Absolute Real (X)", value: "ABS_X" },
  { label: "Absolute Imaginary (Y)", value: "ABS_Y" },
  { label: "Conjugate", value: "CONJUGATE" },
  { label: "Reverse (Origin)", value: "REVERSE" },
  { label: "Invert (Circle)", value: "INVERT" },
  { label: "Complex Sin", value: "SIN" },
  { label: "Complex Cos", value: "COS" },
  { label: "Complex Tan", value: "TAN" },
  { label: "Exponential", value: "EXP" },
  { label: "Reciprocal (1/z)", value: "RECIPROCAL" },
  { label: "Cubic Memory", value: "POW3" },
  { label: "Fold (Kaleidoscope)", value: "FOLD" },
  { label: "Swizzle", value: "SWIZZLE" },
];
const handleModeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  fractalStore.memoryMode = target.value as MemoryMode;
};

/**
 * Moves to the next memory mode in the list
 */
const nextMemoryMode = () => {
  const currentIndex = modes.findIndex(
    (m) => m.value === fractalStore.memoryMode,
  );
  const nextIndex = (currentIndex + 1) % modes.length;
  fractalStore.memoryMode = modes[nextIndex].value;
};

/**
 * Moves to the previous memory mode in the list
 */
const prevMemoryMode = () => {
  const currentIndex = modes.findIndex(
    (m) => m.value === fractalStore.memoryMode,
  );
  // Add modes.length before modulo to handle negative results from -1
  const prevIndex = (currentIndex - 1 + modes.length) % modes.length;
  fractalStore.memoryMode = modes[prevIndex].value;
};

onMounted(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "]") nextMemoryMode();
    if (e.key === "[") prevMemoryMode();
  };

  window.addEventListener("keydown", handleKeyDown);
  onUnmounted(() => window.removeEventListener("keydown", handleKeyDown));
});
</script>

<template>
  <div class="control-group">
    <label class="control-label">Memory Operator</label>
    <select
      :value="fractalStore.memoryMode"
      @change="handleModeChange"
      class="mode-dropdown"
    >
      <option v-for="mode in modes" :key="mode.value" :value="mode.value">
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
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.control-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #888;
  letter-spacing: 0.05em;
}

.mode-dropdown {
  background: #1a1a1a;
  color: #eee;
  border: 1px solid #333;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  font-family: inherit;
}

.mode-dropdown:hover {
  border-color: #646cff;
}
</style>
