<script setup lang="ts">
import { computed } from "vue";
import { useModifierStore } from "../../store/useModifierStore";
import BaseDropdown from "../ui/BaseDropdown.vue";

const modifier = useModifierStore();

// This is much more stable than doing it in-line
const activeLabel = computed(() => {
  return (
    modifier.allOptions.find((m) => m.value === modifier.slots.memory)?.label ||
    "None"
  );
});
</script>

<template>
  <BaseDropdown
    label="Memory Operator"
    v-model="modifier.slots.memory"
    :options="modifier.allOptions"
    identityKey="value"
    :displayValue="activeLabel"
  />
</template>
