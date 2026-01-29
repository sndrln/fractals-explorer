import { onMounted, onUnmounted } from "vue";
import { useFractalStore } from "../store/fractalStore";

export function useMouseInteraction(canvasRef: {
  value: HTMLCanvasElement | null;
}) {
  const fractalStore = useFractalStore();
  let isCanvasDragging = false;

  const updateMousePos = (e: MouseEvent) => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const divisor = Math.min(canvas.clientWidth, canvas.clientHeight);

    const x = (e.clientX - rect.left - canvas.clientWidth / 2) / divisor;
    const y = -(e.clientY - rect.top - canvas.clientHeight / 2) / divisor;

    fractalStore.updateMouse(x, y);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isCanvasDragging && e.buttons === 1) {
      const canvas = canvasRef.value;
      if (!canvas) return;
      const divisor = Math.min(canvas.clientWidth, canvas.clientHeight);

      fractalStore.offsetShiftX -= (e.movementX / divisor) * fractalStore.zoom;
      fractalStore.offsetShiftY += (e.movementY / divisor) * fractalStore.zoom;
    }

    updateMousePos(e);
  };
  const handleGlobalClick = (e: MouseEvent) => {
    if (!fractalStore.activeTargetAxis) return;
    if (!(e.target as HTMLElement).closest(".slidable-number")) {
      fractalStore.activeTargetAxis = null;
    }
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    fractalStore.smoothZoom(e.deltaY);
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
