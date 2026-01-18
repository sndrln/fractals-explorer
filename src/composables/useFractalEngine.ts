import { onMounted, onUnmounted, watch, type Ref } from "vue";
import { useFractalStore } from "../store/fractalStore";
import vertSource from "../shaders/base.vert";
import novaFrag from "../shaders/nova.frag";
import mandelFrag from "../shaders/mandelbrot.frag";
import { palettes } from "../constants/palettes";

export function useFractalEngine(canvasRef: Ref<HTMLCanvasElement | null>) {
  const store = useFractalStore();
  let gl: WebGLRenderingContext;
  let animationFrameId: number;

  const programs: Record<string, WebGLProgram> = {};
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
    // Nova specific (now as floats)
    "relaxation",
    "subtrahend",
    "powerMain",
    "powerMainImaginary",
    "powerDerivative",
    "powerDerivativeImaginary",
    "memoryR",
    "memoryI",
    "seedX",
    "seedY",
    "juliaMorph",
    // Mandelbrot specific
    "power",
  ];

  const createProgram = (fragSource: string): WebGLProgram => {
    const createShader = (type: number, source: string): WebGLShader => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(`Shader error: ${gl.getShaderInfoLog(shader)}`);
      }
      return shader;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, createShader(gl.VERTEX_SHADER, vertSource));
    gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, fragSource));
    gl.linkProgram(prog);
    return prog;
  };

  const switchProgram = (type: string) => {
    switch (type) {
      case "mandelbrot":
        // @ts-ignore
        activeProgram = programs.mandelbrot;
        break;
      case "nova":
      default:
        // @ts-ignore
        activeProgram = programs.nova;
        break;
    }

    gl.useProgram(activeProgram);

    uniformNames.forEach((name) => {
      uniformLocations[name] = gl.getUniformLocation(activeProgram, name);
    });
  };

  const init = () => {
    if (!canvasRef.value) return;
    gl = canvasRef.value.getContext("webgl")!;

    programs.nova = createProgram(novaFrag);
    programs.mandelbrot = createProgram(mandelFrag);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    switchProgram(store.currentFractal);

    render();
  };

  watch(
    () => store.currentFractal,
    (newType) => {
      switchProgram(newType);
    }
  );

  const render = () => {
    if (!gl || !activeProgram) return;
    const canvas = canvasRef.value!;

    store.smoothedX += (store.mouseX - store.smoothedX) * 0.08;
    store.smoothedY += (store.mouseY - store.smoothedY) * 0.08;
    const w = Math.floor(canvas.clientWidth);
    const h = Math.floor(canvas.clientHeight);
    if (Math.abs(canvas.width - w) > 1 || Math.abs(canvas.height - h) > 1) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    gl.uniform2f(uniformLocations.resolution, w, h);
    gl.uniform1f(uniformLocations.zoom, store.zoom);
    gl.uniform1f(uniformLocations.offsetShiftX, store.offsetShiftX);
    gl.uniform1f(uniformLocations.offsetShiftY, store.offsetShiftY);
    gl.uniform1f(
      uniformLocations.maxIterations,
      store.sliderParams.maxIterations
    );
    gl.uniform1f(uniformLocations.time, performance.now() / 1000);

    const keys = Object.keys(store.sliderParams);
    keys.forEach((key) => {
      const loc = uniformLocations[key];
      if (!loc) return; // Skip if this uniform isn't in the current shader

      // Logic for smoothing/bindings
      const baseVal = (store.sliderParams as any)[key];
      const sens = key.includes("power") ? 0.3 : 1.0;
      let liveVal = baseVal;
      if (store.bindingsX.includes(key)) liveVal += store.smoothedX * sens;
      if (store.bindingsY.includes(key)) liveVal += store.smoothedY * sens;

      if (store.isPaused) {
        if (store.frozenValues[key] === undefined) {
          store.frozenValues[key] = liveVal;
        }
        gl.uniform1f(loc, store.frozenValues[key]);
      } else {
        delete store.frozenValues[key];
        gl.uniform1f(loc, liveVal);
        (store.liveParams as any)[key] = liveVal;
      }
    });

    const palette = palettes[store.selectedPalette];
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

  onMounted(init);
  onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  });
}
