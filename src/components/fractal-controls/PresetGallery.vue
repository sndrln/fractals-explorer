<script setup lang="ts">
import { nextTick, ref } from "vue";
import { useFractalStore } from "../../store/useFractalStore";
import { usePresetStore } from "../../store/usePresetStore";
import IconChevron from "../icons/IconChevron.vue";
import IconSave from "../icons/IconSave.vue";
import BaseDropdown from "../ui/BaseDropdown.vue";

const presets = usePresetStore();
const fractal = useFractalStore();

const saveInputRef = ref<HTMLInputElement | null>(null);

const isSaving = ref(false);
const newPresetName = ref("");

const startSaving = async () => {
  isSaving.value = true;
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

const handleDelete = (id: string) => {
  if (confirm("Delete this preset?")) {
    presets.deletePreset(id);
  }
};

const handleSelect = (preset: any) => {
  presets.applyPreset(preset);
};
</script>

<template>
  <div class="control-group">
    <div class="manager-grid">
      <div class="main-slot">
        <BaseDropdown
          v-if="!isSaving"
          ref="dropdown"
          v-model="presets.currentPresetId"
          :options="presets.savedPresets"
          identity-key="id"
          @select="handleSelect"
        >
          <template #trigger="{ isOpen, isFocused }">
            <div
              class="interactive-surface preset-trigger"
              :class="{ 'is-focused': isFocused }"
            >
              <span class="truncate">{{ presets.currentPresetName }}</span>
              <IconChevron :is-open="isOpen" />
            </div>
          </template>

          <template #option="{ option }">
            <div class="preset-item">
              <div class="preset-info">
                <span class="preset-name">{{ option.label }}</span>
                <span class="preset-meta">{{ option.formulaId }}</span>
              </div>
              <button
                class="button-delete"
                @click.stop="handleDelete(option.id)"
              >
                ×
              </button>
            </div>
          </template>
        </BaseDropdown>

        <input
          v-else
          ref="saveInputRef"
          v-model="newPresetName"
          class="interactive-surface save-input"
          @keyup.enter="confirmSave"
          @keyup.esc="cancelSave"
          type="text"
          autocomplete="off"
        />
      </div>

      <div class="action-slot">
        <button
          v-if="!isSaving"
          class="button-primary icon-btn"
          @click="startSaving"
          title="Save Preset"
        >
          <IconSave />
        </button>
        <div v-else class="confirm-cancel-group">
          <button class="button-primary confirm" @click="confirmSave">✓</button>
          <button class="button-primary cancel" @click="cancelSave">×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.manager-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  width: 100%;
}

.main-slot {
  min-width: 0;
}

.preset-trigger {
  height: 32px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  min-width: 0;

  &.is-focused {
    border-color: var(--accent-color);
  }
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
  text-align: left;
  margin-right: 8px;
}

.save-input {
  width: 100%;
  height: 32px;
  padding: 0 10px;
  font-size: 0.85rem;
  outline: none;
  background: rgba(255, 255, 255, 0.05);
  &:focus {
    border-color: var(--color-success);
  }
}

.action-slot {
  display: flex;
  align-items: center;
  height: 32px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-cancel-group {
  display: flex;
  gap: 4px;

  .confirm {
    color: var(--color-success);
  }
  .cancel {
    color: var(--color-danger);
  }
}

.preset-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .preset-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex-grow: 1;

    .preset-name {
      font-size: 0.85rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .preset-meta {
      font-size: 0.65rem;
      opacity: 0.4;
      font-family: monospace;
    }
  }
}

.button-delete {
  color: var(--color-danger);
  font-size: 1.2rem;
  opacity: 0.3;
  padding: 0 8px;
  margin-left: 8px;
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
}
</style>
