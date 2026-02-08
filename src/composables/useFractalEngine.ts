import { onMounted, onUnmounted, watch, type Ref } from "vue";
import { useFractalStore } from "../store/useFractalStore";
import vertSource from "../shaders/base.vert";
import { usePaletteStore } from "../store/usePaletteStore";
import complexMath from "../shaders/shared/complex_math.glsl?raw";
import commonHeader from "../shaders/shared/common_header.glsl?raw";
import memoryModes from "../shaders/shared/memory_modes.glsl?raw";
import coloringModes from "../shaders/shared/coloring_modes.glsl?raw";
import escapeEngine from "../shaders/engines/escape_engine.glsl?raw";
import newtonEngine from "../shaders/engines/newton_engine.glsl?raw";
import novaEngine from "../shaders/engines/nova_engine.glsl?raw";
import kleinianEngine from "../shaders/engines/kleinian_engine.glsl?raw";

import { processShader } from "../utils/shaderLoader";
import { FORMULAS } from "../constants/formulas";
import { DEFAULT_FRACTAL_PARAMS } from "../constants/base-fractal-params";
import { useInputStore } from "../store/useInputStore";
import { useViewStore } from "../store/useViewStore";
import type { FractalParams } from "../types/fractal";
import { useMemoryStore } from "../store/useMemoryStore";
import { useColoringStore } from "../store/useColoringStore";

const shaderLibrary = {
  complex_math: complexMath,
  common_header: commonHeader,
  memory_modes: memoryModes,
  coloring_modes: coloringModes,

  escape_engine: escapeEngine,
  newton_engine: newtonEngine,
  nova_engine: novaEngine,
  kleinian_engine: kleinianEngine,
};

export function useFractalEngine(canvasRef: Ref<HTMLCanvasElement | null>) {
  const fractal = useFractalStore();
  const input = useInputStore();
  const view = useViewStore();
  const palette = usePaletteStore();
  const memory = useMemoryStore();
  const coloring = useColoringStore();

  let gl: WebGLRenderingContext;
  let animationFrameId: number;
  let isRecording: boolean = false;

  let activeProgram: WebGLProgram;
  const uniformLocations: Record<string, WebGLUniformLocation | null> = {};

  const uniformNames = [
    "resolution",
    "zoom",
    "maxIterations",
    "offsetShiftX",
    "offsetShiftY",
    "time",
    "brightness",
    "contrast",
    "osc",
    "phase",

    ...Object.keys(DEFAULT_FRACTAL_PARAMS),
  ];

  const programCache: Map<string, WebGLProgram> = new Map();

  const createProgram = (fragSource: string): WebGLProgram => {
    const createShader = (type: number, source: string): WebGLShader => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        throw new Error(`Shader error: ${info}`);
      }
      return shader;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, createShader(gl.VERTEX_SHADER, vertSource));
    gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, fragSource));
    gl.linkProgram(prog);
    return prog;
  };

  const updateActiveShader = (forceHighQual = false) => {
    const { formulaId } = fractal;
    // Add highQual to the cache key so we don't destroy our normal program
    const cacheKey = `${formulaId}_${memory.currentMode}_COL_${coloring.currentMode}_${forceHighQual ? "HQ" : "LQ"}`;

    if (programCache.has(cacheKey)) {
      activeProgram = programCache.get(cacheKey)!;
    } else {
      const formula = FORMULAS.find((f) => f.id === formulaId);
      if (!formula) return;

      const originalSource = processShader(formula.shaderSource, shaderLibrary);
      const injectedSource = `
    ${forceHighQual ? "#define USE_SSAA\n" : ""}
    #define MEM_${memory.currentMode}\n
    #define COL_${coloring.currentMode}\n
    ${originalSource}
`;

      const newProg = createProgram(injectedSource);
      programCache.set(cacheKey, newProg);
      activeProgram = newProg;
    }

    gl.useProgram(activeProgram);
    uniformNames.forEach((name) => {
      uniformLocations[name] = gl.getUniformLocation(activeProgram!, name);
    });
  };

  const init = () => {
    if (!canvasRef.value) return;
    gl = canvasRef.value.getContext("webgl", { preserveDrawingBuffer: true })!;
    // setResolution(2560, 1600);
    // setResolution(1080, 1920);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    updateActiveShader();
    render();
  };

  watch(
    [
      () => fractal.formulaId,
      () => memory.currentMode,
      () => coloring.currentMode,
    ],
    () => {
      updateActiveShader();
    },
  );

  const updateLFOs = (time: number, totalDuration = 15) => {
    // progress goes from 0.0 at the start to 1.0 at the very end
    const progress = time / totalDuration;

    const loopCount = 1;
    const angle = progress * Math.PI * 2.0 * loopCount;
    console.log(angle);
    // fractal.params.slider.powerI = 0.5 + Math.sin(angle) * 0.5;

    // fractalStore.params.slider.memoryI = Math.cos(angle) * 0.25;
  };

  // const setResolution = (width: number, height: number) => {
  //   const canvas = canvasRef.value!;
  //   canvas.width = width;
  //   canvas.height = height;
  //   gl.viewport(0, 0, width, height);
  // };

  const startRecording = async (durationSeconds = 15) => {
    if (isRecording) return;
    console.log("🎥 Starting Stable Recording...");
    isRecording = true;
    const fps = 60;
    const totalFrames = durationSeconds * fps;
    const canvas = canvasRef.value!;

    for (let i = 0; i < totalFrames; i++) {
      const frameTime = i / fps;
      render(frameTime);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png"),
      );

      if (blob) {
        try {
          const response = await fetch(
            `http://localhost:3001/save-frame?frame=${i}`,
            {
              method: "POST",
              headers: { "Content-Type": "image/png" },
              body: blob,
            },
          );

          if (!response.ok) throw new Error("Server failed to save frame");
        } catch (err) {
          console.error(`Frame ${i} failed! Stopping.`, err);
          break;
        }
      }

      if (i % 10 === 0) {
        console.log(`🎬 Progress: ${Math.round((i / totalFrames) * 100)}%`);
      }
    }
    console.log("✅ All frames sent. Asking server to stitch...");

    await fetch(`http://localhost:3001/finish`, { method: "POST" });
    isRecording = false;

    console.log("🏁 Done! Check your project folder for the MP4.");
  };

  const render = (manualTime?: number) => {
    if (!gl || !activeProgram) return;
    if (isRecording && manualTime === undefined) return;
    const canvas = canvasRef.value!;
    const time =
      manualTime !== undefined ? manualTime : performance.now() / 1000;
    input.tickSmoothing();
    const w = Math.floor(canvas.clientWidth);
    const h = Math.floor(canvas.clientHeight);
    if (Math.abs(canvas.width - w) > 1 || Math.abs(canvas.height - h) > 1) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    gl.uniform2f(uniformLocations.resolution, w, h);
    gl.uniform1f(uniformLocations.zoom, view.zoom);
    gl.uniform1f(uniformLocations.offsetShiftX, view.offset.x + 0.4);
    gl.uniform1f(uniformLocations.offsetShiftY, view.offset.y);
    gl.uniform1f(
      uniformLocations.maxIterations,
      fractal.params.slider.maxIterations,
    );
    gl.uniform1f(uniformLocations.time, time);

    const keys = Object.keys(fractal.params.slider) as Array<
      keyof FractalParams
    >;
    keys.forEach((key) => {
      const loc = uniformLocations[key];
      if (!loc) return;

      const baseVal = fractal.params.slider[key];
      const sens =
        (key.toLowerCase().includes("power") ? 0.3 : 1.0) * input.intensity;

      let liveVal = baseVal;
      if (input.bindings.x.includes(key)) {
        liveVal += input.mouse.smoothedX * sens;
      } else if (input.bindings.y.includes(key)) {
        liveVal += input.mouse.smoothedY * sens;
      }

      gl.uniform1f(loc, liveVal);
      fractal.params.live[key] = liveVal;
    });

    const { brightness, contrast, osc, phase } = palette.selectedPalette;
    const setVec3 = (name: string, val: number[]) => {
      gl.uniform3fv(uniformLocations[name], new Float32Array(val));
    };
    setVec3("brightness", brightness);
    setVec3("contrast", contrast);
    setVec3("osc", osc);
    setVec3("phase", phase);
    const pos = gl.getAttribLocation(activeProgram, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (manualTime === undefined && !isRecording) {
      animationFrameId = requestAnimationFrame(() => render());
    }
    updateLFOs(time);
  };

  onMounted(() => {
    init();
    fractal.setFormula("mandelbrot");
  });
  onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  });

  return {
    startRecording,
  };
}
