<script setup lang="ts">
import { computed } from "vue";
import { useFractalStore } from "../store/fractalStore";
import type { MandelbrotParams } from "../types/mandelbrot-params";
import SlidableValue from "./SlidableValue.vue";
const store = useFractalStore();

const params = computed(() => store.sliderParams as MandelbrotParams);
</script>

<template>
  <div id="formula-display">
    z<sub>n+1</sub> = z<sub>n</sub
    ><sup>
      <SlidableValue
        v-model="params.power"
        varName="power"
        :step="0.01"
        color="#64ff64"
      />
    </sup>
    + c
  </div>
  <div>
    Iterations:
    <SlidableValue
      v-model="params.maxIterations"
      varName="maxIterations"
      :step="1"
    />
  </div>
</template>
