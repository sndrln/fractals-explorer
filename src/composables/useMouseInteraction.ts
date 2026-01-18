import { onMounted, onUnmounted } from "vue";
import { useFractalStore } from "../store/fractalStore";

export function useMouseInteraction(canvasRef: {
  value: HTMLCanvasElement | null;
}) {
  const store = useFractalStore();
  let isCanvasDragging = false;

  const updateMousePos = (e: MouseEvent) => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const relX = e.clientX - rect.left - canvas.clientWidth / 2;
    const relY = e.clientY - rect.top - canvas.clientHeight / 2;
    const divisor = Math.min(canvas.clientWidth, canvas.clientHeight);

    store.mouseX = relX / divisor;
    store.mouseY = -relY / divisor;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isCanvasDragging && e.buttons === 1) {
      const canvas = canvasRef.value;
      if (!canvas) return;

      const divisor = Math.min(canvas.clientWidth, canvas.clientHeight);

      store.offsetShiftX -= (e.movementX / divisor) * store.zoom;
      store.offsetShiftY += (e.movementY / divisor) * store.zoom;
    }

    updateMousePos(e);
  };

  const handleCanvasMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      isCanvasDragging = true;
    }
  };

  const handleGlobalMouseUp = () => {
    isCanvasDragging = false;
  };

  const handleGlobalClick = (e: MouseEvent) => {
    if (!store.activeTargetAxis) return;
    const target = e.target as HTMLElement;
    const isSlidable = target.closest(".slidable-number");
    if (!isSlidable) {
      store.activeTargetAxis = null;
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      store.togglePause();
    }
    if (e.code === "KeyW") {
      e.preventDefault();
      store.resetView();
    }
    if (e.code === "Backquote") {
      e.preventDefault();
      store.toggleUi();
    }
    if (e.code === "KeyQ") {
      store.prevPalette();
    }

    if (e.code === "KeyE") {
      store.nextPalette();
    }

    if (e.code === "KeyR") {
      store.randomizeParams();
    }

    if (e.code === "KeyA") {
      store.toggleTargetAxis("x");
    }

    if (e.code === "KeyD") {
      store.toggleTargetAxis("y");
    }

    if (e.code === "Digit1") {
      store.currentFractal = "mandelbrot";
      store.switchFractal();
    }

    if (e.code === "Digit2") {
      store.currentFractal = "nova";
      store.switchFractal();
    }

    if (e.code === "Digit3") {
      store.currentFractal = "burningShip";
      store.switchFractal();
    }
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    store.smoothZoom(e.deltaY);
  };

  onMounted(() => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    canvas.addEventListener("mousedown", handleCanvasMouseDown);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);

    window.addEventListener("mousedown", handleGlobalClick);
    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
  });

  onUnmounted(() => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    canvas.removeEventListener("mousedown", handleCanvasMouseDown);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleGlobalMouseUp);
    window.removeEventListener("mousedown", handleGlobalClick);
    window.removeEventListener("keydown", handleKeyDown);
    canvas.removeEventListener("wheel", handleWheel);
  });
}
