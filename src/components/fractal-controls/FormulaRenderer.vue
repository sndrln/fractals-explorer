<script setup lang="ts">
import { computed } from "vue";
import { UI_COLORS } from "../../constants/ui/theme";

const props = defineProps<{
  notation: string;
  showPrefix?: boolean;
}>();

/**
 * Formats math text while strictly avoiding characters inside existing HTML tags.
 */
const formatSegment = (text: string) => {
  if (!text) return "";

  // 1. Handle Exponents and Variables first
  let html = text
    .replace(/\^(\{?[A-Za-z0-9\+-]+\}?)/g, (_match, p1) => {
      let val = p1.replace(/[{}]/g, "");
      val = val.replace(
        /P/g,
        `<span style="color: ${UI_COLORS.power}">P</span>`,
      );
      return `<sup class="math-exponent">${val}</sup>`;
    })
    .replace(/z̅/g, `<span style="color: ${UI_COLORS.seed}">z̅</span>`)
    .replace(
      /(?<![A-Za-z])(z)(?![A-Za-z])/g,
      `<span style="color: ${UI_COLORS.seed}">z</span>`,
    )
    .replace(
      /(?<![A-Za-z])(c)(?![A-Za-z])/g,
      `<span style="color: ${UI_COLORS.seed}">c</span>`,
    )
    .replace(
      /(?<![A-Za-z])(R)(?![A-Za-z])/g,
      `<span style="color: ${UI_COLORS.relaxation}">R</span>`,
    )
    .replace(
      /(?<![A-Za-z])(S)(?![A-Za-z])/g,
      `<span style="color: ${UI_COLORS.subtrahend}">S</span>`,
    )
    .replace(
      /(?<![A-Za-z])(P)(?![A-Za-z])/g,
      `<span style="color: ${UI_COLORS.power}">P</span>`,
    )
    .replace(/(?<![A-Za-z])(e)(?![A-Za-z])/g, `e`);

  // 2. Safe Operator Replacement: Only replace outside of < > tags
  // This prevents breaking style="color:..." attributes
  return html.replace(/(?![^<]*>)([\+\-\=\·\*\/])/g, (match) => {
    const char = match === "*" ? "·" : match;
    return `<span class="math-op">${char}</span>`;
  });
};

const processedFormula = computed(() => {
  const fracRegex = /\\frac\{(.*?)\}\{(.*?)\}/;
  const match = props.notation.match(fracRegex);

  if (match) {
    return {
      type: "fraction",
      before: formatSegment(props.notation.substring(0, match.index)),
      numerator: formatSegment(match[1]),
      denominator: formatSegment(match[2]),
      // Use match[0].length to skip the entire \frac{}{} block perfectly
      after: formatSegment(
        props.notation.substring(match.index! + match[0].length),
      ),
    };
  }

  return { type: "inline", content: formatSegment(props.notation) };
});
</script>

<template>
  <div class="formula-container" :class="{ 'is-compact': !showPrefix }">
    <span v-if="showPrefix" class="prefix"> z<sub>n+1</sub> = </span>

    <span
      v-if="processedFormula.type === 'inline'"
      v-html="processedFormula.content"
    />

    <div v-else class="fraction-wrapper">
      <span class="inline-math" v-html="processedFormula.before" />
      <div class="fraction">
        <div class="numerator" v-html="processedFormula.numerator" />
        <div class="denominator" v-html="processedFormula.denominator" />
      </div>
      <span class="inline-math" v-html="processedFormula.after" />
    </div>
  </div>
</template>

<style lang="scss">
.formula-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Cambria Math", "Times New Roman", serif;
  font-style: italic;
  white-space: nowrap;

  &.is-compact {
    font-size: 0.9em;
  }

  .prefix {
    margin-right: 8px;
    font-weight: 400;
    font-style: normal;
  }

  /* This fixes the "z-R" margin issue */
  .math-op {
    display: inline-block;
    font-style: normal;
    margin-left: 4px;
  }

  .math-exponent {
    font-size: 0.75em;
    vertical-align: super;
    line-height: 0;
  }

  .inline-math {
    display: flex;
    align-items: center;
  }

  .fraction-wrapper {
    display: inline-flex;
    align-items: center;
  }

  .fraction {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 0 2px;
    .numerator {
      border-bottom: 1px solid currentColor;
      width: 100%;
      text-align: center;
      padding: 0 4px;
    }
    .denominator {
      width: 100%;
      text-align: center;
      padding: 0 4px;
    }
  }
}
</style>
