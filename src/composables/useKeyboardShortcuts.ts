import { onMounted, onUnmounted } from "vue";
import { useCameraStore } from "../store/useCameraStore";
import { useColoringStore } from "../store/useColoringStore";
import { useFractalStore } from "../store/useFractalStore";
import { useInputStore } from "../store/useInputStore";
import { useModifierStore } from "../store/useModifierStore";
import { usePaletteStore } from "../store/usePaletteStore";
import { usePresetStore } from "../store/usePresetStore";
import { useUiPanelStore } from "../store/useUIstore";
import { captureThumbnail, downloadImage } from "../utils/screenshot";

export function useKeyboardShortcuts() {
  const fractal = useFractalStore();
  const palette = usePaletteStore();
  const input = useInputStore();
  const view = useCameraStore();
  const uiPanel = useUiPanelStore();
  const coloring = useColoringStore();
  const preset = usePresetStore();
  const modifier = useModifierStore();

  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

    if (e.code === "KeyQ" || e.code === "KeyE") {
      e.preventDefault();
      const direction = e.code === "KeyQ" ? -1 : 1;

      // Updated to use new stepModifier action and ModifiedParameter strings
      if (e.shiftKey) {
        modifier.stepModifier("zPrev", direction);
      } else if (e.ctrlKey || e.metaKey) {
        modifier.stepModifier("c", direction);
      } else {
        modifier.stepModifier("z", direction);
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
        view.resetCamera();
        break;
      case "KeyX":
        fractal.resetParameters();
        break;
      case "Backquote":
        uiPanel.toggleUiPanel();
        break;
      case "KeyH":
        uiPanel.toggleSettings();
        break;
      case "KeyR":
        fractal.randomizeParameters();
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
