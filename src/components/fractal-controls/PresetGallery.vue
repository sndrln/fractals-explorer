<script setup lang="ts">
import { nextTick, ref } from "vue";
import { useFractalStore } from "../../store/useFractalStore";
import { usePresetStore } from "../../store/usePresetStore";
import type { Preset } from "../../types/preset";
import IconSave from "../icons/IconSave.vue";

const presets = usePresetStore();
const fractal = useFractalStore();

const isDropdownOpen = ref(false);
const isSaving = ref(false);
const newPresetName = ref("");
const saveInputRef = ref<HTMLInputElement | null>(null);

const handleSelect = (preset: Preset) => {
  presets.applyPreset(preset);
  isDropdownOpen.value = false;
};

const confirmDelete = (e: Event, id: string) => {
  e.stopPropagation();
  if (confirm("Delete this preset?")) {
    presets.deletePreset(id);
  }
};

const startSaving = async () => {
  isSaving.value = true;
  isDropdownOpen.value = false;
  newPresetName.value = `Cool ${fractal.formulaId}`;

  await nextTick();
  saveInputRef.value?.focus();
  saveInputRef.value?.select();
};

const confirmSave = () => {
  if (newPresetName.value.trim()) {
    presets.saveCurrentAsPreset(newPresetName.value.trim());
    isSaving.value = false;
  }
};

const cancelSave = () => {
  isSaving.value = false;
};
</script>

<template>
  <div class="preset-manager">
    <label class="control-label">Preset</label>
    <div class="manager-row">
      <div class="main-area">
        <div class="dropdown-wrapper" :class="{ 'is-hidden': isSaving }">
          <div
            class="select-header"
            :class="{ open: isDropdownOpen }"
            @click="isDropdownOpen = !isDropdownOpen"
          >
            <span class="placeholder">{{ presets.currentPresetName }}</span>
            <div class="arrow">▼</div>
          </div>

          <Transition name="slide-up">
            <div v-if="isDropdownOpen" class="dropdown-list">
              <div
                v-for="preset in presets.savedPresets"
                :key="preset.id"
                class="preset-item"
                :class="{ active: presets.currentPresetId === preset.id }"
                @click="handleSelect(preset)"
              >
                <div class="preset-info">
                  <span class="preset-name">{{ preset.label }}</span>
                  <span class="preset-meta">{{ preset.formulaId }}</span>
                </div>
                <button
                  class="button-delete"
                  @click.stop="(e) => confirmDelete(e, preset.id)"
                >
                  ×
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <Transition name="fade">
          <div>
            <div v-if="isSaving" class="inline-save-overlay">
              <input
                ref="saveInputRef"
                v-model="newPresetName"
                @keyup.enter="confirmSave"
                @keyup.esc="cancelSave"
                type="text"
                placeholder="Preset Name..."
                autocomplete="off"
              />
              <div class="actions">
                <button
                  class="button-primary button-confirm"
                  @click="confirmSave"
                >
                  ✓
                </button>
                <button
                  class="button-primary button-cancel"
                  @click="cancelSave"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <button
        v-if="!isSaving"
        class="button-primary button-save"
        @click="startSaving"
        title="Save Preset"
      >
        <IconSave />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.preset-manager {
  width: 100%;
  color: white;
}

.manager-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  position: relative;
}

.main-area {
  flex: 1;
  position: relative;
  height: 100%;
}

.control-label {
  font-size: 0.75rem;
  margin-bottom: 8px;
  color: var(--text-secondary);
}

/* 1. DROP-DOWN STYLES */
.dropdown-wrapper {
  width: 100%;
  height: 32px;
  transition: opacity 0.2s;

  &.is-hidden {
    opacity: 0;
    pointer-events: none;
  }
}

.select-header {
  height: 100%;
  background: var(--bg-surface);
  border-radius: 6px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &.open {
    border-color: var(--accent-color);
  }

  .placeholder {
    font-size: 0.85rem;
    opacity: 0.8;
  }
  .arrow {
    font-size: 0.7rem;
    opacity: 0.5;
  }
}

/* 2. SAVE OVERLAY STYLES (Flicker Proof) */
.inline-save-overlay {
  position: absolute;
  top: 0;
  left: 0;
  /* Extends to cover the space of the dropdown AND the save button */
  width: calc(100%);
  height: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  input {
    flex: 1;
    background: var(--bg-surface);
    border: none;
    color: white;
    outline: none;
    font-size: 0.9rem;
    padding: 0 8px;
    margin-right: 8px;
    height: 32px;
    width: 100%;
  }

  .actions {
    display: flex;
    gap: 8px;
  }
}

.button-save,
.button-confirm {
  color: var(--color-success);
  &:hover {
    border-color: var(--color-success);
  }
}

.button-cancel {
  color: var(--color-danger);
  &:hover {
    border-color: var(--color-danger);
  }
}

/* 4. DROPDOWN LIST STYLES */
.dropdown-list {
  position: absolute;
  bottom: 115%;
  left: 0;
  right: 0;
  background: var(--bg-surface);
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
  border-bottom: 1px solid var(--border-subtle);
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  &.active {
    border-left: 3px solid var(--accent-color);
    background: rgba(255, 255, 255, 0.03);
  }

  .preset-info {
    display: flex;
    flex-direction: column;
    .preset-name {
      font-size: 0.85rem;
    }
    .preset-meta {
      font-size: 0.7rem;
      opacity: 0.4;
      font-family: monospace;
    }
  }
}

.button-delete {
  background: none;
  border: none;
  color: var(--color-danger);
  font-size: 1.2rem;
  padding: 4px 8px;
  cursor: pointer;
  opacity: 0.3;
  &:hover {
    opacity: 1;
  }
}

/* 5. TRANSITIONS */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
