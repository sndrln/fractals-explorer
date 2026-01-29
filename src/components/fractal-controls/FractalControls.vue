<script setup lang="ts">
import { computed } from "vue";
import { useFractalStore } from "../../store/fractalStore";
import SlidableValue from "../SlidableValue.vue";

const store = useFractalStore();
const params = computed(() => store.sliderParams as any);

const colors = {
  seed: "#55aaff",
  power: "#ffaa00",
  morph: "#ff00aa",
  memory: "#00ffaa",
  iter: "#ffffff",
};

const zStyle = computed(() => ({
  color: colors.seed,
  opacity: 0.3 + store.sliderParams.juliaMorph * 0.7,
  transition: "opacity 0.3s ease",
}));

const cStyle = computed(() => ({
  color: colors.seed,
  opacity: 1.0 - store.sliderParams.juliaMorph * 0.7,
  transition: "opacity 0.3s ease",
}));
</script>

<template>
  <div class="fractal-controls">
    <div id="formula-display">
      <template v-if="store.currentFormulaId === 'mandelbrot'">
        <span :style="zStyle">z</span
        ><sup :style="{ color: colors.power }">P</sup> +
        <span :style="cStyle">c</span>
      </template>

      <template v-else-if="store.currentFormulaId === 'burning-ship'">
        (|Re(<span :style="zStyle">z</span>)| + i|Im(<span :style="zStyle"
          >z</span
        >)|)<sup :style="{ color: colors.power }">P</sup> +
        <span :style="cStyle">c</span>
      </template>

      <template v-else-if="store.currentFormulaId === 'tricorn'">
        <span :style="zStyle">z̅</span
        ><sup :style="{ color: colors.power }">P</sup> +
        <span :style="cStyle">c</span>
      </template>

      <template v-else-if="store.currentFormulaId === 'buffalo'">
        |<span :style="zStyle">z</span
        ><sup :style="{ color: colors.power }">P</sup>| +
        <span :style="cStyle">c</span>
      </template>

      <template v-else-if="store.currentFormulaId === 'celtic'">
        |Re(<span :style="zStyle">z</span
        ><sup :style="{ color: colors.power }">P</sup>)| + iIm(<span
          :style="zStyle"
          >z</span
        ><sup :style="{ color: colors.power }">P</sup>) +
        <span :style="cStyle">c</span>
      </template>

      <template v-else-if="store.currentFormulaId === 'magnet'">
        ((<span :style="zStyle">z</span>² + <span :style="cStyle">c</span> - 1)
        / (2<span :style="zStyle">z</span> + <span :style="cStyle">c</span> -
        2))<sup :style="{ color: colors.power }">P</sup>
      </template>
    </div>

    <div class="control-group">
      <div class="label" :style="{ color: colors.power }">Power (P):</div>
      <SlidableValue
        v-model="params.power"
        varName="power"
        :color="colors.power"
        :step="0.01"
      />
      <span :style="{ color: colors.power }">+</span>
      <SlidableValue
        v-model="params.powerI"
        varName="powerI"
        :color="colors.power"
        :step="0.01"
      />
      <span :style="{ color: colors.power }">i</span>
    </div>

    <div class="control-group">
      <div class="label" :style="{ color: colors.morph }">Julia Morph:</div>
      <SlidableValue
        v-model="params.juliaMorph"
        varName="juliaMorph"
        :color="colors.morph"
        :step="0.01"
      />
    </div>

    <div class="control-group">
      <div class="label" :style="{ color: colors.seed }">Seed Offset:</div>
      <SlidableValue
        v-model="params.seedX"
        varName="seedX"
        :color="colors.seed"
      />
      <span :style="{ color: colors.seed }">+</span>
      <SlidableValue
        v-model="params.seedY"
        varName="seedY"
        :color="colors.seed"
      />
      <span :style="{ color: colors.seed }">i</span>
    </div>

    <hr class="divider" />

    <div class="control-group">
      <div class="label" :style="{ color: colors.memory }">Memory (zₙ₋₁):</div>
      <SlidableValue
        v-model="params.memoryR"
        varName="memoryR"
        :color="colors.memory"
      />
      <span :style="{ color: colors.memory }">+</span>
      <SlidableValue
        v-model="params.memoryI"
        varName="memoryI"
        :color="colors.memory"
      />
      <span :style="{ color: colors.memory }">i</span>
    </div>

    <div class="control-group">
      <div class="label">Iterations:</div>
      <SlidableValue
        v-model="params.maxIterations"
        varName="maxIterations"
        :step="1"
        color="#fff"
      />
    </div>
  </div>
</template>

<style scoped>
.fractal-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

#formula-display {
  background: rgba(0, 0, 0, 0.4);
  padding: 20px;
  text-align: center;
  font-family: "Times New Roman", serif;
  font-style: italic;
  font-size: 24px;
  border-radius: 8px;
  margin-bottom: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
}

.label {
  width: 110px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
}

.divider {
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 10px 0;
}
</style>
