<script setup lang="ts">
import gsap from "gsap";
import { computed, onUnmounted, ref, watch } from "vue";
import { useFractalStore } from "../../store/useFractalStore";
import { useInputStore } from "../../store/useInputStore";
import type { ParameterUnitId } from "../../types/parameter";

const props = defineProps<{
  modelValue: number;
  step?: number;
  min?: number;
  max?: number;
  color: string;
  parameterUnitId: ParameterUnitId;
}>();

const fractal = useFractalStore();
const input = useInputStore();
const emit = defineEmits(["update:modelValue", "change"]);
const isDragging = ref(false);

const tweenTarget = { val: props.modelValue };

const isAltPressed = ref(false);
let velocityRaf = 0;
let currentMouseX = 0;
const deadzone = 10;

const velocityLoop = () => {
  if (!isDragging.value) return;

  // Only apply "Speed" if Alt is held
  if (isAltPressed.value) {
    const diff = currentMouseX - startX;

    if (Math.abs(diff) > deadzone) {
      const direction = diff > 0 ? 1 : -1;
      // Cubic curve for smoother "fine-tuning" near the center
      const normalizedDiff = (Math.abs(diff) - deadzone) * 0.01;
      const speed =
        Math.pow(normalizedDiff, 2) * direction * (props.step || 1.0);

      let nextVal = tweenTarget.val + speed;

      tweenTarget.val = nextVal;
      emit("update:modelValue", nextVal);
    }
  }

  velocityRaf = requestAnimationFrame(velocityLoop);
};

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
  const key = props.parameterUnitId;
  return fractal.parameters.live[key];
});

const handleClick = (e: MouseEvent) => {
  if (input.activeAxis) {
    input.bindVariable(props.parameterUnitId);
  } else {
    startDrag(e);
  }
};

const handleReset = (e: MouseEvent) => {
  e.stopPropagation();
  const defaultValue = fractal.parameters.initial[props.parameterUnitId];

  if (defaultValue === undefined) return;

  gsap.to(tweenTarget, {
    val: defaultValue,
    duration: 0.5,
    onUpdate: () => emit("update:modelValue", tweenTarget.val),
  });
};

const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  isAltPressed.value = e.altKey;
  startX = e.clientX;
  currentMouseX = e.clientX;
  startValue = props.modelValue;

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  document.body.style.cursor = "ew-resize";

  velocityLoop();
};

const onDrag = (e: MouseEvent) => {
  currentMouseX = e.clientX;
  isAltPressed.value = e.altKey;

  // If Alt is held, skip the "Direct Mapping" logic below
  if (e.altKey) return;

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
  isAltPressed.value = false;
  cancelAnimationFrame(velocityRaf);
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
