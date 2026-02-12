import { onMounted, onUnmounted } from "vue";
import { useInputStore } from "../store/useInputStore";
import { useViewStore } from "../store/useViewStore";

export function useMouseInteraction(canvasRef: {
  value: HTMLCanvasElement | null;
}) {
  const input = useInputStore();
  const view = useViewStore();
  let isCanvasDragging = false;

  const updateMousePos = (e: MouseEvent) => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const baseDimention = Math.min(canvas.clientWidth, canvas.clientHeight);

    const x = (e.clientX - rect.left - canvas.clientWidth / 2) / baseDimention;
    const y = -(e.clientY - rect.top - canvas.clientHeight / 2) / baseDimention;

    input.updateMouse(x, y, e.shiftKey);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isCanvasDragging && e.buttons === 1) {
      const canvas = canvasRef.value;
      if (!canvas) return;
      const baseDimention = Math.min(canvas.clientWidth, canvas.clientHeight);

      view.offset.x -= (e.movementX / baseDimention) * view.zoom;
      view.offset.y += (e.movementY / baseDimention) * view.zoom;
    }

    updateMousePos(e);
  };
  const handleGlobalClick = (e: MouseEvent) => {
    if (!input.activeAxis) return;
    if (!(e.target as HTMLElement).closest(".axis-container")) {
      input.activeAxis = null;
    }
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    view.smoothZoom(e.deltaY);
  };

  onMounted(() => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    canvas.addEventListener("mousedown", () => (isCanvasDragging = true));
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", () => (isCanvasDragging = false));
    window.addEventListener("mousedown", handleGlobalClick);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
  });

  onUnmounted(() => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mousedown", handleGlobalClick);
    canvas.removeEventListener("wheel", handleWheel);
  });
}
