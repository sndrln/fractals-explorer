import { onMounted, onUnmounted } from "vue";
import { useFractalStore } from "../store/fractalStore";
import { usePaletteStore } from "../store/paletteStore";

export function useKeyboardShortcuts() {
  const fractalStore = useFractalStore();
  const paletteStore = usePaletteStore();

  const shortcuts: Record<string, (e: KeyboardEvent) => void> = {
    Space: (e) => {
      e.preventDefault();
      fractalStore.togglePause();
    },
    KeyW: (e) => {
      e.preventDefault();
      fractalStore.resetView();
    },
    Backquote: (e) => {
      e.preventDefault();
      fractalStore.toggleUi();
    },
    KeyQ: () => paletteStore.prevPalette(),
    KeyE: () => paletteStore.nextPalette(),
    KeyT: () => paletteStore.generateRandomPalette(),

    KeyR: () => fractalStore.randomizeParams(),
    KeyA: () => fractalStore.toggleTargetAxis("x"),
    KeyD: () => fractalStore.toggleTargetAxis("y"),
    KeyG: () => fractalStore.unbindAllVariables(),

    Digit1: () => fractalStore.switchFractalType("escape"),
    Digit2: () => fractalStore.switchFractalType("newton"),
    Digit3: () => fractalStore.switchFractalType("nova"),
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const action = shortcuts[e.code];
    if (action) action(e);
  };

  onMounted(() => window.addEventListener("keydown", handleKeyDown));
  onUnmounted(() => window.removeEventListener("keydown", handleKeyDown));
}
