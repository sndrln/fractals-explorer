<script setup lang="ts">
import { useFractalStore } from "../store/useFractalStore";
import IconRandom from "./icons/IconRandom.vue";
const fractal = useFractalStore();
</script>

<template>
  <button @click="fractal.randomizeParams" class="button-primary">
    <IconRandom />
  </button>
</template>
