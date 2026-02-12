import { onMounted, onUnmounted } from "vue";
import { useColoringStore } from "../store/useColoringStore";
import { useFractalStore } from "../store/useFractalStore";
import { useInputStore } from "../store/useInputStore";
import { useModifierStore } from "../store/useModifierStore";
import { usePaletteStore } from "../store/usePaletteStore";
import { usePresetStore } from "../store/usePresetStore";
import { useUIStore } from "../store/useUIstore";
import { useViewStore } from "../store/useViewStore";
import { captureThumbnail, downloadImage } from "../utils/screenshot";

export function useKeyboardShortcuts() {
  const fractal = useFractalStore();
  const palette = usePaletteStore();
  const input = useInputStore();
  const view = useViewStore();
  const ui = useUIStore();
  const coloring = useColoringStore();
  const preset = usePresetStore();
  const modifier = useModifierStore();

  const handleKeyDown = (e: KeyboardEvent) => {
    // Prevent triggering while typing in text boxes
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

    if (e.code === "KeyQ" || e.code === "KeyE") {
      e.preventDefault();
      const direction = e.code === "KeyQ" ? -1 : 1;

      if (e.shiftKey) {
        modifier.stepOperator("memory", direction);
      } else if (e.ctrlKey || e.metaKey) {
        modifier.stepOperator("cMod", direction);
      } else {
        modifier.stepOperator("zMod", direction);
      }
      return;
    }

    const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (arrowKeys.includes(e.code)) {
      e.preventDefault();

      if (e.code === "ArrowUp") {
        e.shiftKey ? coloring.prevMode() : palette.prevPalette();
      } else if (e.code === "ArrowDown") {
        e.shiftKey ? coloring.nextMode() : palette.nextPalette();
      } else if (e.code === "ArrowLeft") {
        if (e.shiftKey) preset.prevPreset();
        else fractal.prevFormula();
      } else if (e.code === "ArrowRight") {
        if (e.shiftKey) preset.nextPreset();
        else fractal.nextFormula();
      }
      return;
    }

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
        ui.toggleUi();
        break;
      case "KeyH":
        ui.toggleSettings();
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
