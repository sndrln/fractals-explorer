import { onMounted, onUnmounted } from "vue";
import { useFractalStore } from "../store/useFractalStore";
import { usePaletteStore } from "../store/usePaletteStore";
import { useInputStore } from "../store/useInputStore";
import { useViewStore } from "../store/useViewStore";
import { useColoringStore } from "../store/useColoringStore";
import { useMemoryStore } from "../store/useMemoryStore";
import { captureThumbnail, downloadImage } from "../utils/screenshot";
import { usePresetStore } from "../store/usePresetStore";

export function useKeyboardShortcuts() {
  const fractal = useFractalStore();
  const palette = usePaletteStore();
  const input = useInputStore();
  const view = useViewStore();
  const coloring = useColoringStore();
  const memory = useMemoryStore();
  const preset = usePresetStore();

  const handleKeyDown = (e: KeyboardEvent) => {
    // Prevent triggering while typing in text boxes
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

    // Navigation
    const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (arrowKeys.includes(e.code)) {
      e.preventDefault();

      if (e.code === "ArrowUp") {
        e.shiftKey ? coloring.prevMode() : palette.prevPalette();
      } else if (e.code === "ArrowDown") {
        e.shiftKey ? coloring.nextMode() : palette.nextPalette();
      } else if (e.code === "ArrowLeft") {
        if (e.shiftKey) preset.prevPreset();
        else if (e.ctrlKey || e.metaKey) memory.prevOperator();
        else fractal.prevFormula();
      } else if (e.code === "ArrowRight") {
        if (e.shiftKey) preset.nextPreset();
        else if (e.ctrlKey || e.metaKey) memory.nextOperator();
        else fractal.nextFormula();
      }
      return;
    }

    // Command Shortcuts
    switch (e.code) {
      case "Space":
        e.preventDefault();
        input.togglePause();
        break;
      case "KeyW":
        view.resetView();
        break;
      case "KeyX":
        fractal.resetParams();
        break;
      case "Backquote":
        view.toggleUi();
        break;
      case "KeyR":
        fractal.randomizeParams();
        break;
      case "KeyT":
        palette.generateRandomPalette();
        break;
      case "KeyA":
        input.toggleTargetAxis("x");
        break;
      case "KeyD":
        input.toggleTargetAxis("y");
        break;
      case "KeyG":
        input.unbindAll();
        break;
      case "Escape":
        input.activeAxis = null;
        break;
      case "KeyS":
        if (e.ctrlKey || e.metaKey) e.preventDefault();
        const canvas = document.querySelector("canvas");
        if (canvas) {
          captureThumbnail(canvas, 0.1).then((thumb) => {
            downloadImage(thumb, `${fractal.formulaId}.webp`);
          });
        }
        break;
    }
  };

  onMounted(() => window.addEventListener("keydown", handleKeyDown));
  onUnmounted(() => window.removeEventListener("keydown", handleKeyDown));
}
