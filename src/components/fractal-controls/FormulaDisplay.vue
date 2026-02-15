<script setup lang="ts">
import { useFractalStore } from "../../store/useFractalStore";
import FormulaRenderer from "./FormulaRenderer.vue";

const fractal = useFractalStore();
</script>

<template>
  <div id="formula-display">
    <FormulaRenderer
      :notation="fractal.currentFormula.mathNotation"
      :show-prefix="true"
    />
  </div>
</template>

<style lang="scss" scoped>
#formula-display {
  text-align: center;
  font-style: italic;
  border-radius: 8px;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
  font-size: 24px;
}

.sub-formula {
  opacity: 0.6;
}

.math-exponent {
  font-size: 0.65em; // Shrink P so it doesn't compete with Z
  vertical-align: super; // Move it to the top right
  margin-left: 1px; // Tiny gap so it doesn't touch the Z
  position: relative;
  bottom: 5px;
}
</style>
