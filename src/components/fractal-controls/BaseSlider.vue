<script setup lang="ts">
import gsap from "gsap";
import { computed, onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  modelValue: number;
  step?: number;
  color?: string;
  defaultValue?: string;
  isZoom?: boolean;
  baseReference?: number;
}>();

const emit = defineEmits(["update:modelValue", "change"]);
const isDragging = ref(false);

const tweenTarget = { val: props.modelValue };

watch(
  () => props.modelValue,
  (newVal) => {
    if (!isDragging.value) {
      tweenTarget.val = newVal;
    }
  },
);

let startX = 0;
let startValue = 0;

const magnification = computed(() => {
  if (!props.isZoom || !props.baseReference) return 1;
  return props.baseReference / props.modelValue;
});

const zoomLabel = computed(() => {
  const mag = magnification.value;
  if (mag < 1000) return mag.toFixed(1) + "x"; // Show "1.0x" to "999x"

  // Convert to scientific notation: 1.2e4
  const exp = Math.floor(Math.log10(mag));
  const leading = (mag / Math.pow(10, exp)).toFixed(2);
  return `${leading}e${exp}`;
});

const handleReset = (e: MouseEvent) => {
  e.stopPropagation();
  // If zooming, we reset to the baseReference; otherwise use defaultValue
  const resetValue = props.isZoom
    ? props.baseReference
    : Number(props.defaultValue);
  if (resetValue === undefined) return;

  gsap.to(tweenTarget, {
    val: resetValue,
    duration: 0.5,
    ease: "power2.out",
    onUpdate: () => emit("update:modelValue", tweenTarget.val),
  });
};

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  startX = e.clientX;
  startValue = props.modelValue;

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  document.body.style.cursor = "ew-resize";
};

const onDrag = (e: MouseEvent) => {
  const sensitivity = props.step || 0.01;
  const delta = (e.clientX - startX) * sensitivity;

  let finalVal;

  if (props.isZoom && props.baseReference) {
    // We use Base 2 for the DRAGGING feel (much smoother)
    // but the LABEL above will show Base 10.
    const startExp = Math.log2(props.baseReference / startValue);
    let targetExp = startExp + delta;

    // Clamp at roughly 11-12 to avoid the "32-bit jitter"
    targetExp = Math.min(targetExp, 12.0);

    finalVal = props.baseReference / Math.pow(2, targetExp);
  } else {
    let rawVal = startValue + delta;
    const nearestInt = Math.round(rawVal);
    const distance = rawVal - nearestInt;
    const gravityRadius = 0.2;

    if (Math.abs(distance) < gravityRadius && !e.shiftKey) {
      const strength = Math.pow(Math.abs(distance) / gravityRadius, 2);
      finalVal = nearestInt + distance * strength;
    } else {
      finalVal = rawVal;
    }
  }
  gsap.to(tweenTarget, {
    val: finalVal,
    duration: 0.05,
    overwrite: true,
    onUpdate: () => emit("update:modelValue", tweenTarget.val),
  });
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.body.style.cursor = "default";
  emit("change");
};

onUnmounted(() => {
  gsap.killTweensOf(tweenTarget);
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
});
</script>

<template>
  <span
    class="slidable-number"
    :class="{ 'is-dragging': isDragging }"
    @mousedown="startDrag"
    @dblclick="handleReset"
  >
    <template v-if="isZoom"> {{ zoomLabel }} </template>
    <template v-else>
      {{ modelValue?.toFixed(2) ?? "0.00" }}
    </template>
  </span>
</template>

<style lang="scss" scoped>
.slidable-number {
  cursor: ew-resize;
  padding: 0 4px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
  user-select: none;
  display: inline-block;
  transition:
    background 0.2s,
    color 0.2s;
  min-width: 60px;
  text-align: center;
}

.slidable-number:hover {
  background: rgba(255, 255, 255, 0.15);
}

.is-dragging {
  background: rgba(100, 108, 255, 0.4);
  border-bottom-style: solid;
}
</style>
