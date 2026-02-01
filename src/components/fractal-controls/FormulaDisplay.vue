<script setup lang="ts">
import { computed } from "vue";
import { useFractalStore } from "../../store/useFractalStore";
import { useFractalTheme } from "../../composables/useFractalTheme";

const fractalStore = useFractalStore();
const { colors, mathStyles } = useFractalTheme();

const currentFormulaId = computed(() => fractalStore.formulaId);
</script>

<template>
  <div id="formula-display">
    <template v-if="currentFormulaId === 'mandelbrot'">
      <span :style="mathStyles.zStyle">z<sub>n+1</sub></span> =
      <span :style="mathStyles.zStyle">z<sub>n</sub></span
      ><sup :style="{ color: colors.power }">P</sup> +
      <span :style="mathStyles.cStyle">c</span>
    </template>

    <template v-if="currentFormulaId === 'burning-ship'">
      <span :style="mathStyles.zStyle">z<sub>n+1</sub></span> = (|Re(<span
        :style="mathStyles.zStyle"
        >z<sub>n</sub></span
      >)| + i|Im(<span :style="mathStyles.zStyle">z<sub>n</sub></span
      >)|) <sup :style="{ color: colors.power }">P</sup> +
      <span :style="mathStyles.cStyle">c</span>
    </template>

    <template v-if="currentFormulaId === 'tricorn'">
      <span :style="mathStyles.zStyle">z<sub>n+1</sub></span> =
      <span :style="mathStyles.zStyle">z̅<sub>n</sub></span
      ><sup :style="{ color: colors.power }">P</sup> +
      <span :style="mathStyles.cStyle">c</span>
    </template>

    <template v-if="currentFormulaId === 'buffalo'">
      <span :style="mathStyles.zStyle">z<sub>n+1</sub></span> = |<span
        :style="mathStyles.zStyle"
        >z<sub>n</sub></span
      ><sup :style="{ color: colors.power }">P</sup>| +
      <span :style="mathStyles.cStyle">c</span>
    </template>

    <template v-if="currentFormulaId === 'celtic'">
      <span :style="mathStyles.zStyle">z<sub>n+1</sub></span> = |Re(<span
        :style="mathStyles.zStyle"
        >z<sub>n</sub></span
      ><sup :style="{ color: colors.power }">P</sup>)| + iIm(<span
        :style="mathStyles.zStyle"
        >z<sub>n</sub></span
      ><sup :style="{ color: colors.power }">P</sup>) +
      <span :style="mathStyles.cStyle">c</span>
    </template>

    <template v-if="currentFormulaId === 'magnet'">
      <span :style="mathStyles.zStyle">z<sub>n+1</sub></span> = ((<span
        :style="mathStyles.zStyle"
        >z<sub>n</sub></span
      >² + <span :style="mathStyles.cStyle">c</span> - 1) / (2<span
        :style="mathStyles.zStyle"
        >z<sub>n</sub></span
      >
      + <span :style="mathStyles.cStyle">c</span> - 2))
      <sup :style="{ color: colors.power }">P</sup>
    </template>

    <template v-if="currentFormulaId === 'inv-mandel'">
      <span :style="mathStyles.zStyle">z<sub>n+1</sub></span> =
      <span :style="mathStyles.zStyle">z<sub>n</sub></span
      ><sup :style="{ color: colors.power }">P</sup> + 1/
      <span :style="mathStyles.cStyle">c</span>
    </template>

    <template v-if="currentFormulaId === 'inv-exp'">
      <span :style="mathStyles.zStyle">z<sub>n+1</sub></span> = 1/<span
        :style="mathStyles.zStyle"
        >z<sub>n</sub></span
      ><sup :style="{ color: colors.power }">P</sup> +
      <span :style="mathStyles.cStyle">c</span>
    </template>

    <template v-if="currentFormulaId === 'lambda'">
      <span :style="mathStyles.zStyle">z<sub>n+1</sub></span> =
      <span :style="mathStyles.cStyle">c</span> ·
      <span :style="mathStyles.zStyle">z<sub>n</sub></span
      >(1 - <span :style="mathStyles.zStyle">z<sub>n</sub></span
      >)
    </template>

    <template v-if="currentFormulaId === 'spider'">
      <div class="spider-layout">
        <div>
          <span :style="mathStyles.zStyle">z<sub>n+1</sub></span> =
          <span :style="mathStyles.zStyle">z<sub>n</sub></span
          ><sup :style="{ color: colors.power }">P</sup> +
          <span :style="mathStyles.cStyle">c</span>
        </div>
        <div class="sub-formula">
          <span :style="mathStyles.cStyle">c</span> →
          <span :style="mathStyles.cStyle">c</span>/2 +
          <span :style="mathStyles.zStyle">z<sub>n</sub></span>
        </div>
      </div>
    </template>

    <template v-if="currentFormulaId === 'heart'">
      <span :style="mathStyles.zStyle">z<sub>n+1</sub></span> = (|Re(<span
        :style="mathStyles.zStyle"
        >z<sub>n</sub></span
      >)| + iIm(<span :style="mathStyles.zStyle">z<sub>n</sub></span
      >)) <sup :style="{ color: colors.power }">P</sup> +
      <span :style="mathStyles.cStyle">c</span>
    </template>

    <template v-if="currentFormulaId === 'newton-std'">
      <span :style="{ color: colors.relaxation }">a</span> ·
      <span :style="mathStyles.zStyle">z</span
      ><sup :style="{ color: colors.power }">P</sup> - 1 = 0
    </template>

    <template v-if="currentFormulaId === 'newton-sin'">
      <span :style="mathStyles.zStyle">z</span> -
      <span :style="{ color: colors.relaxation }">a</span> · tan(<span
        :style="mathStyles.zStyle"
        >z</span
      >)
    </template>

    <template v-if="currentFormulaId === 'newton-exp'">
      <span :style="{ color: colors.relaxation }">a</span> · ( <span>e</span
      ><sup :style="{ color: colors.power }">Pz</sup> -
      <span :style="{ color: colors.subtrahend }">c</span> = 0 )
    </template>

    <template v-if="currentFormulaId === 'newton-hybrid'">
      <span :style="{ color: colors.relaxation }">a</span> · (
      <span :style="mathStyles.zStyle">z</span
      ><sup :style="{ color: colors.power }">P</sup> · sin(<span
        :style="mathStyles.zStyle"
        >z</span
      >) - <span :style="{ color: colors.subtrahend }">c</span> = 0 )
    </template>

    <template v-else-if="currentFormulaId === 'nova-std'">
      <span :style="mathStyles.zStyle">z</span><sub>n+1</sub> =
      <span :style="mathStyles.zStyle">z</span><sub>n</sub> -
      <span :style="{ color: colors.relaxation }">a</span> ·
      <div class="fraction">
        <div class="numerator">
          <span :style="mathStyles.zStyle">z</span
          ><sup :style="{ color: colors.power }">P</sup> -
          <span :style="{ color: colors.subtrahend }">s</span>
        </div>
        <div class="denominator">
          <span :style="{ color: colors.power }">P</span
          ><span :style="mathStyles.zStyle">z</span
          ><sup :style="{ color: colors.power }">P-1</sup>
        </div>
      </div>
      + <span :style="mathStyles.cStyle">c</span>
    </template>

    <template v-else-if="currentFormulaId === 'nova-sin'">
      <span :style="mathStyles.zStyle">z</span><sub>n+1</sub> =
      <span :style="mathStyles.zStyle">z</span><sub>n</sub> -
      <span :style="{ color: colors.relaxation }">a</span> ·
      <div class="fraction">
        <div class="numerator">
          sin(<span :style="mathStyles.zStyle">z</span>) -
          <span :style="{ color: colors.subtrahend }">s</span>
        </div>
        <div class="denominator">
          cos(<span :style="mathStyles.zStyle">z</span>)
        </div>
      </div>
      + <span :style="mathStyles.cStyle">c</span>
    </template>

    <template v-else-if="currentFormulaId === 'nova-hybrid'">
      <span :style="mathStyles.zStyle">z</span><sub>n+1</sub> =
      <span :style="mathStyles.zStyle">z</span><sub>n</sub> -
      <span :style="{ color: colors.relaxation }">a</span> ·
      <div class="fraction">
        <div class="numerator">
          <span :style="mathStyles.zStyle">z</span><sup>P</sup>sin(<span
            :style="mathStyles.zStyle"
            >z</span
          >) - <span :style="{ color: colors.subtrahend }">s</span>
        </div>
        <div class="denominator">
          (<span :style="mathStyles.zStyle">z</span><sup>P</sup>sin(<span
            :style="mathStyles.zStyle"
            >z</span
          >))'
        </div>
      </div>
      + <span :style="mathStyles.cStyle">c</span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
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
  user-select: none;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spider-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.sub-formula {
  font-size: 0.6em;
  opacity: 0.6;
}
</style>
