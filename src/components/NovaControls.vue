<script setup lang="ts">
import { computed } from "vue";
import { useFractalStore } from "../store/fractalStore";
import SlidableValue from "./SlidableValue.vue";
import type { NovaParams } from "../types/nova-params";

const store = useFractalStore();

const params = computed(() => store.sliderParams as NovaParams);
</script>

<template>
  <div id="formula-display">
    z<sub>n+1</sub> = z<sub>n</sub> -
    <SlidableValue
      v-model="params.relaxation"
      varName="relaxation"
      color="#ff55ff"
      :step="0.005"
    />
    &times; (z<sup
      ><SlidableValue
        v-model="params.powerMain"
        varName="powerMain"
        color="#ffaa00"
        :step="0.01"
    /></sup>
    -
    <SlidableValue
      v-model="params.subtrahend"
      varName="subtrahend"
      :step="0.01"
      color="#ffffff"
    />) / z<sup
      ><SlidableValue
        v-model="params.powerDerivative"
        varName="powerDerivative"
        color="#00ffaa"
        :step="0.01"
    /></sup>
    <div>
      Iterations:
      <SlidableValue
        v-model="params.maxIterations"
        varName="maxIterations"
        :step="1"
        color="#ffffff"
      />
    </div>
  </div>

  <div>
    <span>Seed: </span>
    <SlidableValue v-model="params.seedX" varName="seedX" color="#ff00aa" />
    <span> + </span>
    <SlidableValue v-model="params.seedY" varName="seedY" color="#ff00aa" />
    <span>i</span>
  </div>

  <div>
    <span>Power I: </span>
    <SlidableValue
      v-model="params.powerMainImaginary"
      varName="powerMainImaginary"
      color="#ff00aa"
    />
    <span> + </span>
    <SlidableValue
      v-model="params.powerDerivativeImaginary"
      varName="powerDerivativeImaginary"
      color="#ff00aa"
    />
    <span>i</span>
  </div>

  <div>
    <span>Memory </span>
    <SlidableValue v-model="params.memoryR" varName="memoryR" color="#ff00aa" />
    <span> + </span>
    <SlidableValue v-model="params.memoryI" varName="memoryI" color="#ff00aa" />
    <span>i</span>
  </div>

  <div>
    <span>Julia morph</span>
    <SlidableValue
      v-model="params.juliaMorph"
      varName="juliaMorph"
      color="#ff00aa"
      :step="0.01"
    />
    <span>i</span>
  </div>
</template>

<style scoped>
#formula-display {
  background: rgba(0, 0, 0, 0.4);
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  font-family: "Times New Roman", serif;
  font-style: italic;
  font-size: 17px;
  line-height: 1.8;
  min-height: 40px;
  color: #eee;
}
</style>
