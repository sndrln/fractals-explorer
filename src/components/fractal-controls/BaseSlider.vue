<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";
import gsap from "gsap";

const props = defineProps<{
  modelValue: number;
  step?: number;
  color?: string;
  defaultValue?: string;
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

const handleClick = (e: MouseEvent) => {
  startDrag(e);
};

const handleReset = (e: MouseEvent) => {
  e.stopPropagation();
  if (props.defaultValue === undefined) return;

  gsap.to(tweenTarget, {
    val: props.defaultValue,
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

  let rawVal = startValue + delta;

  const nearestInt = Math.round(rawVal);
  const distance = rawVal - nearestInt; // How far are we from the integer?
  const gravityRadius = 0.2; // How far away the "pull" starts

  let finalVal;

  if (Math.abs(distance) < gravityRadius && !e.shiftKey) {
    const strength = Math.pow(Math.abs(distance) / gravityRadius, 2);
    finalVal = nearestInt + distance * strength;
  } else {
    finalVal = rawVal;
  }

  gsap.to(tweenTarget, {
    val: finalVal,
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
    }"
    :style="{ color: color || '#646cff' }"
    @mousedown="handleClick"
    @dblclick="handleReset"
  >
    {{ modelValue?.toFixed(2) ?? "0.00" }}
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
</style>
