<script setup lang="ts">
import { computed } from "vue";
import { useFractalStore } from "../../store/fractalStore";
import SlidableValue from "../SlidableValue.vue";

const store = useFractalStore();
const params = computed(() => store.sliderParams as any);
</script>

<template>
  <div id="formula-display">
    z<sub>n+1</sub> = (|Re(z<sub>n</sub>)| + i|Im(z<sub>n</sub>)|)<sup
      >(<SlidableValue
        v-model="params.power"
        varName="power"
        color="#ffaa00"
        :step="0.01"
      />
      +
      <SlidableValue
        v-model="params.powerImaginary"
        varName="powerImaginary"
        color="#ffaa00"
        :step="0.01"
      />i)</sup
    >
    + c
  </div>

  <div class="control-group">
    <div class="label">Iterations:</div>
    <SlidableValue
      v-model="params.maxIterations"
      varName="maxIterations"
      :step="1"
      color="#ffffff"
    />
  </div>

  <div class="control-group">
    <div class="label">Memory:</div>
    <SlidableValue v-model="params.memoryR" varName="memoryR" color="#00ffaa" />
    <span> + </span>
    <SlidableValue v-model="params.memoryI" varName="memoryI" color="#00ffaa" />
    <span>i</span>
  </div>

  <div class="control-group">
    <div class="label">Julia Morph:</div>
    <SlidableValue
      v-model="params.juliaMorph"
      varName="juliaMorph"
      color="#55aaff"
      :step="0.01"
    />
  </div>

  <div class="control-group">
    <div class="label">Subtrahend:</div>
    <SlidableValue
      v-model="params.subtrahend"
      varName="subtrahend"
      color="#ffffff"
      :step="0.01"
    />
  </div>
</template>

<style scoped>
#formula-display {
  background: rgba(20, 10, 0, 0.6);
  padding: 15px;
  border-left: 4px solid #ffaa00;
  border-radius: 4px;
  margin-bottom: 20px;
  font-family: "Times New Roman", serif;
  font-style: italic;
  font-size: 18px;
  color: #ffcc88;
}

.control-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.label {
  width: 100px;
  font-size: 13px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
