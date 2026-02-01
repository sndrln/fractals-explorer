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
const emit = defineEmits(["update:modelValue"]);
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
  const key = props.paramKey as keyof typeof fractalStore.params.live;
  return fractalStore.params.live[key];
});

const handleClick = (e: MouseEvent) => {
  if (inputStore.activeAxis) {
    inputStore.bindVariable(props.paramKey as keyof FractalParams);
  } else {
    startDrag(e);
  }
};

const handleReset = (e: MouseEvent) => {
  e.stopPropagation();

  const defaultValue = fractalStore.params.initial[props.paramKey];

  if (defaultValue === undefined) {
    console.warn(`Could not find default value for ${props.paramKey}`);
    return;
  }

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
  const magnetWidth = 0.1; // How much "extra" mouse movement to stay on the integer

  const delta = (e.clientX - startX) * sensitivity;
  const rawVal = startValue + delta;

  const nearest = Math.round(rawVal);
  const diff = rawVal - nearest;

  let targetVal: number;

  if (Math.abs(diff) < magnetWidth) {
    // We are inside the magnet range: hold the round value
    targetVal = nearest;
  } else {
    // We are outside: subtract the magnet offset so we don't "jump" values
    // This ensures that 2.01 comes right after the magnet releases at 2.00
    targetVal = rawVal - Math.sign(diff) * magnetWidth;
  }

  if (props.min !== undefined) targetVal = Math.max(props.min, targetVal);
  if (props.max !== undefined) targetVal = Math.min(props.max, targetVal);

  gsap.to(tweenTarget, {
    val: targetVal,
    duration: 0.1,
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
