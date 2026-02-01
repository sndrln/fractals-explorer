import { onMounted, onUnmounted, watch, type Ref } from "vue";
import { useFractalStore } from "../store/useFractalStore";
import vertSource from "../shaders/base.vert";
import { usePaletteStore } from "../store/usePaletteStore";
import complexMath from "../shaders/shared/complex_math.glsl?raw";
import commonHeader from "../shaders/shared/common_header.glsl?raw";
import escapeEngine from "../shaders/engines/escape_engine.glsl?raw";
import newtonEngine from "../shaders/engines/newton_engine.glsl?raw";
import novaEngine from "../shaders/engines/nova_engine.glsl?raw";

import { processShader } from "../utils/shaderLoader";
import { FORMULAS } from "../constants/formulas";
import { DEFAULT_FRACTAL_PARAMS } from "../constants/base-fractal-params";
import { useInputStore } from "../store/useInputStore";
import { useViewStore } from "../store/useViewStore";

const shaderLibrary = {
  complex_math: complexMath,
  common_header: commonHeader,
  escape_engine: escapeEngine,
  newton_engine: newtonEngine,
  nova_engine: novaEngine,
};

export function useFractalEngine(canvasRef: Ref<HTMLCanvasElement | null>) {
  const fractalStore = useFractalStore();
  const inputStore = useInputStore();
  const viewStore = useViewStore();
  const paletteStore = usePaletteStore();
  let gl: WebGLRenderingContext;
  let animationFrameId: number;

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

  const updateActiveShader = () => {
    const formulaId = fractalStore.formulaId;
    const mode = fractalStore.memoryMode || "NONE"; // Ensure this exists in store
    const cacheKey = `${formulaId}_${mode}`;

    // 1. Check if we already have this specific combination
    if (programCache.has(cacheKey)) {
      activeProgram = programCache.get(cacheKey)!;
    } else {
      // 2. Recompile on the fly
      const formula = FORMULAS.find((f) => f.id === formulaId);
      if (!formula) return;

      const originalSource = processShader(formula.shaderSource, shaderLibrary);
      const injectedSource = `#define MEM_${mode}\n${originalSource}`;

      try {
        const newProg = createProgram(injectedSource);
        programCache.set(cacheKey, newProg);
        activeProgram = newProg;
        console.log(`Successfully recompiled: ${cacheKey}`);
      } catch (e) {
        console.error("Recompilation failed:", e);
        return;
      }
    }

    // 3. Set the program and refresh uniform locations
    gl.useProgram(activeProgram);
    uniformNames.forEach((name) => {
      uniformLocations[name] = gl.getUniformLocation(activeProgram!, name);
    });
  };

  const init = () => {
    if (!canvasRef.value) return;
    gl = canvasRef.value.getContext("webgl")!;

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

  watch([() => fractalStore.formulaId, () => fractalStore.memoryMode], () => {
    updateActiveShader();
  });

  const render = () => {
    if (!gl || !activeProgram) return;
    const canvas = canvasRef.value!;

    inputStore.tickSmoothing();
    const w = Math.floor(canvas.clientWidth);
    const h = Math.floor(canvas.clientHeight);
    if (Math.abs(canvas.width - w) > 1 || Math.abs(canvas.height - h) > 1) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    gl.uniform2f(uniformLocations.resolution, w, h);
    if (uniformLocations.zoom)
      gl.uniform1f(uniformLocations.zoom, viewStore.zoom);
    if (uniformLocations.offsetShiftX)
      gl.uniform1f(uniformLocations.offsetShiftX, viewStore.offset.x);
    if (uniformLocations.offsetShiftY)
      gl.uniform1f(uniformLocations.offsetShiftY, viewStore.offset.y);
    gl.uniform1f(
      uniformLocations.maxIterations,
      fractalStore.params.slider.maxIterations,
    );
    gl.uniform1f(uniformLocations.time, performance.now() / 1000);

    const keys = Object.keys(fractalStore.params.slider);
    keys.forEach((key) => {
      const loc = uniformLocations[key];
      if (!loc) return;

      const baseVal = (fractalStore.params.slider as any)[key];
      const sens = key.toLowerCase().includes("power") ? 0.3 : 1.0;

      let liveVal = baseVal;
      if (inputStore.bindings.x.includes(key as any))
        liveVal += inputStore.mouse.smoothedX * sens;
      if (inputStore.bindings.y.includes(key as any))
        liveVal += inputStore.mouse.smoothedY * sens;

      gl.uniform1f(loc, liveVal);
      (fractalStore.params.live as any)[key] = liveVal;
    });

    const palette = paletteStore.selectedPalette;
    const setVec3 = (name: string, val: number[]) => {
      gl.uniform3fv(uniformLocations[name], new Float32Array(val));
    };
    setVec3("brightness", palette.brightness);
    setVec3("contrast", palette.contrast);
    setVec3("osc", palette.osc);
    setVec3("phase", palette.phase);
    const pos = gl.getAttribLocation(activeProgram, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    animationFrameId = requestAnimationFrame(render);
  };

  onMounted(() => {
    init();
    fractalStore.switchFractalType("escape");
  });
  onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  });
}
