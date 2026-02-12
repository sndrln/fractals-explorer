<script setup lang="ts">
import gsap from "gsap";
import { computed, onUnmounted, ref, watch } from "vue";
import { useFractalStore } from "../../store/useFractalStore";
import { useInputStore } from "../../store/useInputStore";
import type { FractalParams } from "../../types/fractal";

const props = defineProps<{
  modelValue: number;
  step: number;
  min?: number;
  max?: number;
  color: string;
  paramKey: keyof FractalParams;
}>();

const fractal = useFractalStore();
const input = useInputStore();
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
  return fractal.params.live[key];
});

const handleClick = (e: MouseEvent) => {
  if (input.activeAxis) {
    input.bindVariable(props.paramKey);
  } else {
    startDrag(e);
  }
};

const handleReset = (e: MouseEvent) => {
  e.stopPropagation();
  const defaultValue = fractal.params.initial[props.paramKey];

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
  const delta = (e.clientX - startX) * sensitivity * input.sensitivity;

  const rawVal = startValue + delta;

  const nearestInt = Math.round(rawVal);
  const distance = rawVal - nearestInt;
  const gravityRadius = 0.15;

  let targetVal;

  if (Math.abs(distance) < gravityRadius && !e.shiftKey) {
    const strength = Math.pow(Math.abs(distance) / gravityRadius, 2);
    targetVal = nearestInt + distance * strength;
  } else {
    targetVal = rawVal;
  }

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
      'is-pickable': input.activeAxis !== null,
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
