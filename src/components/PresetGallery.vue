<!-- <script setup lang="ts">
import { usePresetStore } from "../store/presetStore";
import { useFractalStore } from "../store/fractalStore";

const presetStore = usePresetStore();
const fractalStore = useFractalStore();

const applyPreset = (preset: any) => {
  fractalStore.loadState(preset);
};

const handleSave = () => {
  const name = prompt("Name your masterpiece:");
  if (name) {
    presetStore.saveCurrentState(name, fractalStore.getCurrentState());
  }
};
</script>

<template>
  <div class="preset-manager">
    <button @click="handleSave" class="save-btn">Save</button>

    <div class="section">
      <div class="grid">
        <div
          v-for="p in presetStore.defaultPresets"
          :key="p.id"
          @click="applyPreset(p)"
          class="card"
        >
          {{ p.name }}
        </div>
      </div>
    </div>

    <div class="section" v-if="presetStore.userPresets.length">
      <div class="grid">
        <div
          v-for="p in presetStore.userPresets"
          :key="p.id"
          class="card user-card"
        >
          <span @click="applyPreset(p)">{{ p.name }}</span>
          <button @click="presetStore.deletePreset(p.id)" class="delete">
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.save-btn {
  margin-top: 10px;
}
.card {
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: 0.2s;
  font-size: 12px;
}
.card:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #ffaa00;
}
.user-card {
  display: flex;
  justify-content: space-between;
}
.section {
  margin: 5px 0;
}
.delete {
  background: none;
  border: none;
  color: #ff5555;
  cursor: pointer;
}
</style> -->
