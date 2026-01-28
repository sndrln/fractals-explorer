import { onMounted, onUnmounted, watch, type Ref } from "vue";
import { useFractalStore } from "../store/fractalStore";
import vertSource from "../shaders/base.vert";
import novaFrag from "../shaders/nova.frag";
import mandelFrag from "../shaders/mandelbrot.frag";
import burningShipFrag from "../shaders/burningShip.frag";
import newtonFrag from "../shaders/newton.frag";
import { usePaletteStore } from "../store/paletteStore";

export function useFractalEngine(canvasRef: Ref<HTMLCanvasElement | null>) {
  const fractalStore = useFractalStore();
  const paletteStore = usePaletteStore();
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

    "relaxation",
    "subtrahend",
    "powerMain",
    "powerMainImaginary",
    "powerImaginary",
    "powerDerivative",
    "powerDerivativeImaginary",
    "memoryR",
    "memoryI",
    "dampingR",
    "dampingI",
    "seedX",
    "seedY",
    "juliaMorph",
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
        activeProgram = programs.mandelbrot;
        break;
      case "nova":
        activeProgram = programs.nova;
        break;
      case "newton":
        activeProgram = programs.newton;
        break;
      case "burningShip":
      default:
        activeProgram = programs.burningShip;
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
    programs.burningShip = createProgram(burningShipFrag);
    programs.newton = createProgram(newtonFrag);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    switchProgram(fractalStore.currentFractal);

    render();
  };

  watch(
    () => fractalStore.currentFractal,
    (newType) => {
      switchProgram(newType);
    },
  );

  const render = () => {
    if (!gl || !activeProgram) return;
    const canvas = canvasRef.value!;

    fractalStore.smoothedX +=
      (fractalStore.mouseX - fractalStore.smoothedX) * 0.08;
    fractalStore.smoothedY +=
      (fractalStore.mouseY - fractalStore.smoothedY) * 0.08;
    const w = Math.floor(canvas.clientWidth);
    const h = Math.floor(canvas.clientHeight);
    if (Math.abs(canvas.width - w) > 1 || Math.abs(canvas.height - h) > 1) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    gl.uniform2f(uniformLocations.resolution, w, h);
    gl.uniform1f(uniformLocations.zoom, fractalStore.zoom);
    gl.uniform1f(uniformLocations.offsetShiftX, fractalStore.offsetShiftX);
    gl.uniform1f(uniformLocations.offsetShiftY, fractalStore.offsetShiftY);
    gl.uniform1f(
      uniformLocations.maxIterations,
      fractalStore.sliderParams.maxIterations,
    );
    gl.uniform1f(uniformLocations.time, performance.now() / 1000);

    const keys = Object.keys(fractalStore.sliderParams);
    keys.forEach((key) => {
      const loc = uniformLocations[key];
      if (!loc) return;

      const baseVal = (fractalStore.sliderParams as any)[key];
      const sens = key.includes("power") ? 0.3 : 1.0;
      let liveVal = baseVal;
      if (fractalStore.bindingsX.includes(key))
        liveVal += fractalStore.smoothedX * sens;
      if (fractalStore.bindingsY.includes(key))
        liveVal += fractalStore.smoothedY * sens;

      if (fractalStore.isPaused) {
        if (fractalStore.frozenValues[key] === undefined) {
          fractalStore.frozenValues[key] = liveVal;
        }
        gl.uniform1f(loc, fractalStore.frozenValues[key]);
      } else {
        delete fractalStore.frozenValues[key];
        gl.uniform1f(loc, liveVal);
        (fractalStore.liveParams as any)[key] = liveVal;
      }
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

  onMounted(init);
  onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  });
}
