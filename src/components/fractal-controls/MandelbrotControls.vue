<script setup lang="ts">
import { computed } from "vue";
import { useFractalStore } from "../../store/fractalStore";
import SlidableValue from "./../SlidableValue.vue";
import type { MandelbrotParams } from "../../types/mandelbrot-params";

const store = useFractalStore();
const params = computed(() => store.sliderParams as MandelbrotParams);
</script>

<template>
  <div id="formula-display">
    z<sub>n+1</sub> = z<sub>n</sub
    ><sup
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
    <span>
      + (z<sub>n-1</sub> &times; (<SlidableValue
        v-model="params.memoryR"
        varName="memoryR"
        color="#00ffaa"
        :step="0.01"
      />
      +
      <SlidableValue
        v-model="params.memoryI"
        varName="memoryI"
        color="#00ffaa"
        :step="0.01"
      />i))
    </span>
    -
    <SlidableValue
      v-model="params.subtrahend"
      varName="subtrahend"
      color="#ffffff"
      :step="0.01"
    />

    <div class="iteration-row">
      Iterations:
      <SlidableValue
        v-model="params.maxIterations"
        varName="maxIterations"
        :step="1"
        color="#ffffff"
      />
    </div>
  </div>

  <div class="control-group">
    <div class="label">Seed:</div>
    <SlidableValue
      v-model="params.seedX"
      varName="seedX"
      color="#ff55ff"
      :step="0.005"
    />
    <span> + </span>
    <SlidableValue
      v-model="params.seedY"
      varName="seedY"
      color="#ff55ff"
      :step="0.005"
    />
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
    <span class="hint">(0 = Mandel, 1 = Julia)</span>
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

.iteration-row {
  margin-top: 10px;
  font-size: 14px;
  font-family: sans-serif;
  opacity: 0.8;
}

.control-group {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  min-width: 90px;
  font-size: 14px;
  font-weight: bold;
  color: #aaa;
}

.hint {
  font-size: 11px;
  opacity: 0.5;
  font-style: italic;
}
</style>
