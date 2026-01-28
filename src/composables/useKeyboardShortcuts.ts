import { onMounted, onUnmounted } from "vue";
import { useFractalStore } from "../store/fractalStore";

export function useKeyboardShortcuts() {
  const store = useFractalStore();

  const shortcuts: Record<string, (e: KeyboardEvent) => void> = {
    Space: (e) => {
      e.preventDefault();
      store.togglePause();
    },
    KeyW: (e) => {
      e.preventDefault();
      store.resetView();
    },
    Backquote: (e) => {
      e.preventDefault();
      store.toggleUi();
    },
    KeyQ: () => store.prevPalette(),
    KeyE: () => store.nextPalette(),
    KeyR: () => store.randomizeParams(),
    KeyA: () => store.toggleTargetAxis("x"),
    KeyD: () => store.toggleTargetAxis("y"),
    KeyG: () => store.unbindAllVariables(),

    Digit1: () => store.switchFractal("mandelbrot"),
    Digit2: () => store.switchFractal("nova"),
    Digit3: () => store.switchFractal("burningShip"),
    Digit4: () => store.switchFractal("newton"),
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const action = shortcuts[e.code];
    if (action) action(e);
  };

  onMounted(() => window.addEventListener("keydown", handleKeyDown));
  onUnmounted(() => window.removeEventListener("keydown", handleKeyDown));
}
