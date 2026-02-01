<script setup lang="ts">
import { useFractalStore } from "../store/useFractalStore";
const fractalStore = useFractalStore();
</script>

<template>
  <button @click="fractalStore.randomizeParams" class="button-primary">
    <span class="icon">🎲</span>
  </button>
</template>
