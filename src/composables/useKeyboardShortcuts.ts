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

    KeyR: () => fractalStore.randomizeParams(),
    KeyA: () => fractalStore.toggleTargetAxis("x"),
    KeyD: () => fractalStore.toggleTargetAxis("y"),
    KeyG: () => fractalStore.unbindAllVariables(),

    Digit1: () => fractalStore.switchFractal("mandelbrot"),
    Digit2: () => fractalStore.switchFractal("nova"),
    Digit3: () => fractalStore.switchFractal("burningShip"),
    Digit4: () => fractalStore.switchFractal("newton"),
    Digit5: () => fractalStore.switchFractal("magnet"),
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const action = shortcuts[e.code];
    if (action) action(e);
  };

  onMounted(() => window.addEventListener("keydown", handleKeyDown));
  onUnmounted(() => window.removeEventListener("keydown", handleKeyDown));
}
