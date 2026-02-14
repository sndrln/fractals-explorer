<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { computed, onUnmounted, ref } from "vue";
import IconChevron from "../icons/IconChevron.vue";

const props = defineProps<{
  label?: string;
  options?: any[];
  modelValue: any;
  identityKey?: string;
  displayValue?: string;
  menuWidth?: string;
}>();

const emit = defineEmits(["update:modelValue", "select"]);

const isOpen = ref(false);
const isUpward = ref(false);
const isFocused = ref(false);

const dropdownRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null); // NEW: Specifically measure the trigger
const menuRef = ref<HTMLElement | null>(null);

const menuStyle = ref({
  top: "auto",
  bottom: "auto",
  left: "0px",
  width: "0px",
});

const currentIndex = computed(() => {
  if (!props.options) return -1;
  return props.options.findIndex((opt) => isSelected(opt));
});

const transitionName = computed(() =>
  isUpward.value ? "slide-up" : "slide-down",
);

const updatePosition = () => {
  if (!triggerRef.value) return; // Anchor precisely to the button, ignoring the label

  const rect = triggerRef.value.getBoundingClientRect();
  const menuMaxHeight = 220;
  const spaceBelow = window.innerHeight - rect.bottom;

  isUpward.value = spaceBelow < menuMaxHeight + 20;

  const style: any = {
    left: `${rect.left}px`,
    width: props.menuWidth || `${rect.width}px`,
    top: "auto",
    bottom: "auto",
  };

  if (isUpward.value) {
    style.bottom = `${window.innerHeight - rect.top + 4}px`; // Now perfectly aligned!
  } else {
    style.top = `${rect.bottom + 4}px`;
  }

  menuStyle.value = style;
};

const toggleDropdown = () => {
  if (!isOpen.value) {
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
  } else {
    cleanup();
  }
  isOpen.value = !isOpen.value;
};

const close = () => {
  if (isOpen.value) {
    isOpen.value = false;
    cleanup();
  }
};

const cleanup = () => {
  window.removeEventListener("scroll", updatePosition, true);
  window.removeEventListener("resize", updatePosition);
};

const select = (opt: any) => {
  const val = props.identityKey ? opt[props.identityKey] : opt;
  emit("update:modelValue", val);
  emit("select", opt);
  close();
};

const cycle = (direction: number) => {
  if (!props.options || props.options.length === 0) return;
  const len = props.options.length;
  const nextIdx = (currentIndex.value + direction + len) % len;
  select(props.options[nextIdx]);
};

const handleKeyDown = (e: KeyboardEvent) => {
  const navKeys = [
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "Enter",
    " ",
    "Escape",
  ];

  if (navKeys.includes(e.key)) {
    e.preventDefault();
    e.stopPropagation(); // Stops global formula/palette changes
  }

  const isUp = e.key === "ArrowUp" || e.key === "ArrowLeft";
  const isDown = e.key === "ArrowDown" || e.key === "ArrowRight";

  if (isUp || isDown) cycle(isUp ? -1 : 1);
  else if (e.key === "Enter" || e.key === " ") toggleDropdown();
  else if (e.key === "Escape") close();
};

const getOptId = (opt: any) =>
  props.identityKey ? opt[props.identityKey] : opt;
const isSelected = (opt: any) => getOptId(opt) === props.modelValue;

onClickOutside(
  dropdownRef,
  (event) => {
    if (menuRef.value?.contains(event.target as Node)) return;
    close();
  },
  { ignore: [menuRef] },
);

onUnmounted(cleanup);
defineExpose({ close, toggle: toggleDropdown });
</script>

<template>
  <div
    class="control-group"
    ref="dropdownRef"
    tabindex="0"
    @keydown="handleKeyDown"
    @focus="isFocused = true"
    @blur="isFocused = false"
  >
    <label v-if="label" class="control-label">{{ label }}</label>

    <div class="dropdown-root">
      <div class="trigger-container" ref="triggerRef" @click="toggleDropdown">
        <slot name="trigger" :is-open="isOpen" :is-focused="isFocused">
          <div
            class="interactive-surface default-trigger"
            :class="{ open: isOpen, 'is-focused': isFocused }"
          >
            <span class="truncate">{{ displayValue }}</span>
            <IconChevron :is-open="isOpen" />
          </div>
        </slot>
      </div>

      <Teleport to="body">
        <Transition :name="transitionName">
          <div
            v-if="isOpen"
            ref="menuRef"
            class="dropdown-menu custom-scrollbar"
            :style="menuStyle"
          >
            <slot name="list">
              <div class="default-list">
                <div
                  v-for="opt in options"
                  :key="getOptId(opt)"
                  class="default-item"
                  :class="{ active: isSelected(opt) }"
                  @click="select(opt)"
                >
                  <slot name="option" :option="opt">
                    {{ opt.label || opt }}
                  </slot>
                </div>
              </div>
            </slot>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<style scoped lang="scss">
.control-group,
.dropdown-root,
.trigger-container {
  min-width: 0;
  width: 100%;
}
.dropdown-root {
  position: relative;
}

.default-trigger {
  height: 32px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 0.85rem;
  user-select: none;
  min-width: 0;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
  text-align: left;
  margin-right: 8px;
}

.default-trigger.is-focused,
.control-group:focus-visible .default-trigger {
  border-color: var(--accent-color);
  background: rgba(255, 255, 255, 0.05);
}

.control-group:focus-visible {
  outline: none;
}

.dropdown-menu {
  position: fixed;
  z-index: 9999;
  max-height: 220px;
  overflow-y: auto;
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
}

.default-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.85rem;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  &.active {
    color: var(--accent-color);
    background: rgba(255, 255, 255, 0.04);
  }
}

.slide-down-enter-active,
.slide-down-leave-active,
.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
