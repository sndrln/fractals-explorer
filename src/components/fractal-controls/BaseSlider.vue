<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import gsap from "gsap";
import { useFractalStore } from "../../store/useFractalStore";
import { useInputStore } from "../../store/useInputStore";
import type { FractalParams } from "../../types/fractal";

const props = defineProps<{
  modelValue: number;
  step: number;
  min: number;
  max: number;
  color: string;
  paramKey: keyof FractalParams;
}>();

const fractalStore = useFractalStore();
const inputStore = useInputStore();
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

const currentValue = computed(() => {
  const key = props.paramKey;
  return fractalStore.params.live[key];
});

const handleClick = (e: MouseEvent) => {
  if (inputStore.activeAxis) {
    inputStore.bindVariable(props.paramKey);
  } else {
    startDrag(e);
  }
};

const handleReset = (e: MouseEvent) => {
  e.stopPropagation();
  const defaultValue = fractalStore.params.initial[props.paramKey];

  if (defaultValue === undefined) return;

  gsap.to(tweenTarget, {
    val: defaultValue,
    duration: 0.5,
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

  // 1. Calculate the "raw" target value based on mouse movement
  let targetVal = startValue + delta;

  // 2. Sticky/Snap Logic
  // This defines how "sticky" the round numbers are (e.g., 0.1 means
  // it will stay at 1.00 while the raw value is between 0.90 and 1.10)
  const snapThreshold = 0.1;
  const nearestInt = Math.round(targetVal);

  if (Math.abs(targetVal - nearestInt) < snapThreshold) {
    targetVal = nearestInt;
  } else {
    // Optional: Smooth the transition out of the snap zone
    // If you want it to feel less "jumpy" when it breaks free,
    // you could subtract the threshold, but usually, a clean break feels better.
    targetVal =
      targetVal > nearestInt
        ? targetVal - snapThreshold + 0.01 // Adjusting to prevent jumping back immediately
        : targetVal + snapThreshold - 0.01;
  }

  // 3. Clamp to boundaries
  if (props.min !== undefined) targetVal = Math.max(props.min, targetVal);
  if (props.max !== undefined) targetVal = Math.min(props.max, targetVal);

  gsap.to(tweenTarget, {
    val: targetVal,
    duration: 0.05,
    overwrite: true,
    onUpdate: () => {
      emit("update:modelValue", tweenTarget.val);
    },
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
    :class="{
      'is-dragging': isDragging,
      'is-pickable': inputStore.activeAxis !== null,
    }"
    :style="{ color: color || '#646cff' }"
    @mousedown="handleClick"
    @dblclick="handleReset"
  >
    {{ currentValue?.toFixed(2) ?? "0.00" }}
  </span>
</template>

<style lang="scss" scoped>
.slidable-number {
  cursor: ew-resize;
  font-weight: bold;
  font-family: "Courier New", Courier, monospace;
  padding: 0 4px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
  user-select: none;
  display: inline-block;
  transition:
    background 0.2s,
    color 0.2s;
}

.slidable-number:hover {
  background: rgba(255, 255, 255, 0.15);
}

.is-dragging {
  background: rgba(100, 108, 255, 0.4);
  border-bottom-style: solid;
}

.is-pickable {
  cursor: cell !important;
  outline: 2px dashed rgba(255, 255, 255, 0.5);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
