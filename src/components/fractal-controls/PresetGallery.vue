<script setup lang="ts">
import { ref } from "vue";
import { usePresetStore } from "../../store/usePresetStore";
import { useFractalStore } from "../../store/useFractalStore";

const presetStore = usePresetStore();
const fractalStore = useFractalStore();
const isDropdownOpen = ref(false);

const handleSave = () => {
  const name = prompt(
    "Enter a name for this preset:",
    `Cool ${fractalStore.formulaId}`,
  );
  if (name && name.trim()) {
    presetStore.saveCurrentAsPreset(name.trim());
  }
};

const handleSelect = (preset: any) => {
  presetStore.applyPreset(preset);
  isDropdownOpen.value = false;
};

const confirmDelete = (e: Event, index: number) => {
  e.stopPropagation(); // Prevent loading the preset when clicking delete
  if (confirm("Delete this preset?")) {
    presetStore.deletePreset(index);
  }
};
</script>

<template>
  <div class="preset-manager">
    <div class="manager-row">
      <div class="custom-select-wrapper">
        <div
          class="select-header"
          :class="{ open: isDropdownOpen }"
          @click="isDropdownOpen = !isDropdownOpen"
        >
          <span class="placeholder">
            {{
              presetStore.savedPresets.length > 0
                ? "My Presets"
                : "No Presets yet"
            }}
          </span>
          <div class="arrow">▼</div>
        </div>

        <Transition name="slide-up">
          <div v-if="isDropdownOpen" class="dropdown-list">
            <div
              v-for="(preset, index) in presetStore.savedPresets"
              :key="index"
              class="preset-item"
              @click="handleSelect(preset)"
            >
              <div class="preset-info">
                <span class="preset-name">{{ preset.label }}</span>
                <span class="preset-meta">{{ preset.formulaId }}</span>
              </div>
              <button
                class="delete-btn"
                @click="(e) => confirmDelete(e, index)"
              >
                ×
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <button
        class="save-button"
        @click="handleSave"
        title="Save Current State"
      >
        <span class="icon">💾</span> Save
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.preset-manager {
  width: 100%;
  margin-bottom: 10px;
}

.manager-row {
  display: flex;
  gap: 8px;
  height: 40px;
}

.custom-select-wrapper {
  flex: 1;
  position: relative;
}

.select-header {
  height: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &.open {
    border-color: var(--accent, #4caf50);
  }

  .placeholder {
    font-size: 0.9rem;
    opacity: 0.8;
  }
  .arrow {
    font-size: 0.7rem;
    opacity: 0.5;
  }
}

.dropdown-list {
  position: absolute;
  bottom: 110%; // Opens upwards so it doesn't get cut off by bottom of screen
  left: 0;
  right: 0;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  max-height: 250px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.preset-item {
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .preset-info {
    display: flex;
    flex-direction: column;
    .preset-name {
      font-size: 0.85rem;
      font-weight: bold;
    }
    .preset-meta {
      font-size: 0.7rem;
      opacity: 0.5;
      font-family: monospace;
    }
  }
}

.delete-btn {
  background: none;
  border: none;
  color: #ff5555;
  font-size: 1.2rem;
  padding: 4px 8px;
  cursor: pointer;
  opacity: 0.3;
  &:hover {
    opacity: 1;
  }
}

.save-button {
  background: var(--accent, #4caf50);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.1s active;

  &:active {
    transform: scale(0.95);
  }
  &:hover {
    filter: brightness(1.1);
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
