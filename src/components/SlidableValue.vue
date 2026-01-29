<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from "vue";
import gsap from "gsap";
import { useFractalStore } from "../store/fractalStore";
import type { FractalParams } from "../types/fractal-params";

const props = defineProps<{
  modelValue: number;
  step?: number;
  varName: string;
  color?: string;
}>();

const store = useFractalStore();
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
  const key = props.varName as keyof typeof store.liveParams;
  return store.liveParams[key];
});

const handleClick = (e: MouseEvent) => {
  if (store.activeTargetAxis) {
    store.bindVariable(props.varName as keyof FractalParams);
  } else {
    startDrag(e);
  }
};

const handleReset = (e: MouseEvent) => {
  e.stopPropagation();
  // @ts-ignore
  const defaultValue = store.initialParams[props.varName];

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

  // Clamping based on config
  const config = store.paramConfigs[props.varName as string];
  if (config) {
    if (config.min !== undefined) targetVal = Math.max(config.min, targetVal);
    if (config.max !== undefined) targetVal = Math.min(config.max, targetVal);
  }

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
      'is-pickable': store.activeTargetAxis !== null,
    }"
    :style="{ color: color || '#646cff' }"
    @mousedown="handleClick"
    @dblclick="handleReset"
  >
    {{ currentValue?.toFixed(2) ?? "0.00" }}
  </span>
</template>

<style scoped>
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
