import { DEFAULT_PARAMETER_VALUES } from "../constants/default-parameter-values";
import { FORMULAS } from "../constants/formulas";
import vertSource from "../shaders/base.vert";
import escapeCore from "../shaders/cores/escape_core.glsl?raw";
import kleinianCore from "../shaders/cores/kleinian_core.glsl?raw";
import newtonCore from "../shaders/cores/newton_core.glsl?raw";
import novaCore from "../shaders/cores/nova_core.glsl?raw";
import mainTemplate from "../shaders/main_template.frag?raw";
import cModes from "../shaders/shared/c_modes.glsl?raw";
import coloringModes from "../shaders/shared/coloring_modes.glsl?raw";
import commonHeader from "../shaders/shared/common_header.glsl?raw";
import complexMath from "../shaders/shared/complex_math.glsl?raw";
import memoryModes from "../shaders/shared/memory_modes.glsl?raw";
import modifiers from "../shaders/shared/modifiers.glsl?raw";
import zModes from "../shaders/shared/z_modes.glsl?raw";
import type {
  ModifiedParameter,
  ModifierConfig,
  ParameterUnitId,
} from "../types/parameter";

import { processShader } from "../utils/shaderLoader";

const shaderLibrary = {
  complex_math: complexMath,
  common_header: commonHeader,
  modifiers: modifiers,
  memory_modes: memoryModes,
  z_modes: zModes,
  c_modes: cModes,
  coloring_modes: coloringModes,
  escape_core: escapeCore,
  newton_core: newtonCore,
  nova_core: novaCore,
  kleinian_core: kleinianCore,
};

const UNIFORM_NAMES = [
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
  ...Object.keys(DEFAULT_PARAMETER_VALUES),
];

export class FractalEngine {
  private gl: WebGLRenderingContext;
  private canvas: HTMLCanvasElement;
  private activeProgram: WebGLProgram | null = null;
  private programCache: Map<string, WebGLProgram> = new Map();
  private uniformLocations: Record<string, WebGLUniformLocation | null> = {};
  private animationFrameId: number | null = null;

  public isRecording = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl", { preserveDrawingBuffer: true })!;
    this.initBuffer();
  }

  private initBuffer() {
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      this.gl.STATIC_DRAW,
    );
  }

  public updateActiveShader(config: {
    formulaId: string;
    modifiers: Record<ModifiedParameter, ModifierConfig>;
    coloringMode: string;
    useSSAA: boolean;
  }) {
    const cacheKey = `${config.formulaId}_${config.modifiers.zPrev.modifierId}_${config.modifiers.z.modifierId}_${config.modifiers.c.modifierId}_COL_${config.coloringMode}_SSAA_${config.useSSAA}`;

    if (this.programCache.has(cacheKey)) {
      this.activeProgram = this.programCache.get(cacheKey)!;
    } else {
      const formula = FORMULAS.find((f) => f.id === config.formulaId);
      const coreSource = shaderLibrary[`${formula.fractalType}_core`];

      const processedTemplate = processShader(
        mainTemplate,
        shaderLibrary,
      ).replace(/#include ".*"/g, "");

      const injectedSource = `
        precision highp float;

        // 1. DEFINES
        ${config.useSSAA ? "#define USE_SSAA" : ""}
        #define MEM_${config.modifiers.zPrev.modifierId}
        #define ZMOD_${config.modifiers.z.modifierId}
        #define CMOD_${config.modifiers.c.modifierId}
        #define COL_${config.coloringMode}

        // 2. HEADERS & MATH (The Foundation)
        ${shaderLibrary.common_header}
        ${shaderLibrary.complex_math}
        ${shaderLibrary.modifiers}
        ${shaderLibrary.memory_modes}
        ${shaderLibrary.z_modes}
        ${shaderLibrary.c_modes}
        ${shaderLibrary.coloring_modes} // This now contains apply_coloring()

        // 3. FORMULA (The specific math step)
        ${formula.shaderSource}        // This contains fractalStep()

        // 4. CORE (The specific iteration loop)
        ${coreSource}                  // This contains core_logic()

        // 5. TEMPLATE (The entry point)
        ${processedTemplate}           // This contains main()
      `.replace(/#include ".*"/g, "");

      const newProg = this.compileProgram(injectedSource);
      this.programCache.set(cacheKey, newProg);
      this.activeProgram = newProg;
    }

    this.gl.useProgram(this.activeProgram);
    UNIFORM_NAMES.forEach((name) => {
      this.uniformLocations[name] = this.gl.getUniformLocation(
        this.activeProgram!,
        name,
      );
    });
  }

  private compileProgram(fragSource: string): WebGLProgram {
    const createShader = (type: number, source: string): WebGLShader => {
      const shader = this.gl.createShader(type)!;
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        throw new Error(`Shader error: ${this.gl.getShaderInfoLog(shader)}`);
      }
      return shader;
    };

    const prog = this.gl.createProgram()!;
    this.gl.attachShader(prog, createShader(this.gl.VERTEX_SHADER, vertSource));
    this.gl.attachShader(
      prog,
      createShader(this.gl.FRAGMENT_SHADER, fragSource),
    );
    this.gl.linkProgram(prog);
    return prog;
  }

  public setResolution(width: number, height: number) {
    const evenWidth = Math.floor(width) & ~1;
    const evenHeight = Math.floor(height) & ~1;

    // ONLY set the internal drawing buffer
    this.canvas.width = evenWidth;
    this.canvas.height = evenHeight;

    this.gl.viewport(0, 0, evenWidth, evenHeight);
  }

  updateLFOs = (state: any, time: number, totalDuration = 15) => {
    const progress = time / totalDuration;

    const loopCount = 1;
    const angle = progress * Math.PI * 2.0 * loopCount;

    // state.fractal.parameters.slider.powerI = 0.5 + Math.sin(angle) * 0.5;
    state.fractal.parameters.slider.memoryI = Math.cos(angle) * 0.25;
  };

  public render(state: any, manualTime?: number) {
    if (!this.gl || !this.activeProgram) return;
    if (this.isRecording && manualTime === undefined) return;

    if (manualTime === undefined) {
      state.input.tickSmoothing();
    }

    const time =
      manualTime !== undefined ? manualTime : performance.now() / 1000;

    if (!this.isRecording && !state.graphics.isManual) {
      const dpr = window.devicePixelRatio || 1;
      const targetW = Math.floor(this.canvas.clientWidth * dpr);
      const targetH = Math.floor(this.canvas.clientHeight * dpr);

      if (
        Math.abs(this.canvas.width - targetW) > 2 ||
        Math.abs(this.canvas.height - targetH) > 2
      ) {
        this.setResolution(targetW, targetH);
      }
    }

    // Uniform Updates
    this.gl.uniform2f(
      this.uniformLocations.resolution,
      this.canvas.width,
      this.canvas.height,
    );
    this.gl.uniform1f(this.uniformLocations.zoom, state.camera.zoom);
    this.gl.uniform1f(
      this.uniformLocations.offsetShiftX,
      state.camera.offset.x,
    );
    this.gl.uniform1f(
      this.uniformLocations.offsetShiftY,
      state.camera.offset.y,
    );
    this.gl.uniform1f(
      this.uniformLocations.maxIterations,
      state.fractal.maxIterations,
    );
    this.gl.uniform1f(this.uniformLocations.time, time);

    // Dynamic Parameter Logic
    const keys = Object.keys(
      state.fractal.parameters.slider,
    ) as Array<ParameterUnitId>;
    keys.forEach((key) => {
      const loc = this.uniformLocations[key];
      if (!loc) return;

      const baseVal = state.fractal.parameters.slider[key];
      const sens =
        (key.toLowerCase().includes("power") ? 0.3 : 1.0) *
        state.input.sensitivity;

      let liveVal = baseVal;
      if (state.input.bindings.x.includes(key)) {
        liveVal += state.input.mouse.smoothedX * sens;
      } else if (state.input.bindings.y.includes(key)) {
        liveVal += state.input.mouse.smoothedY * sens;
      }

      this.gl.uniform1f(loc, liveVal);
      state.fractal.parameters.live[key] = liveVal;
    });

    // Palette
    const { brightness, contrast, osc, phase } = state.palette.selectedPalette;
    this.gl.uniform3fv(
      this.uniformLocations.brightness,
      new Float32Array(brightness),
    );
    this.gl.uniform3fv(
      this.uniformLocations.contrast,
      new Float32Array(contrast),
    );
    this.gl.uniform3fv(this.uniformLocations.osc, new Float32Array(osc));
    this.gl.uniform3fv(this.uniformLocations.phase, new Float32Array(phase));

    const pos = this.gl.getAttribLocation(this.activeProgram, "a_position");
    this.gl.enableVertexAttribArray(pos);
    this.gl.vertexAttribPointer(pos, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    this.updateLFOs(state, time, 15);
    if (manualTime === undefined && !this.isRecording) {
      this.animationFrameId = requestAnimationFrame(() => this.render(state));
    }
  }

  public async startRecording(durationSeconds: number, state: any) {
    if (this.isRecording) return;
    this.isRecording = true;
    const fps = 60;
    const totalFrames = durationSeconds * fps;

    for (let i = 0; i < totalFrames; i++) {
      this.render(state, i / fps);
      const blob = await new Promise<Blob | null>((res) =>
        this.canvas.toBlob(res, "image/png"),
      );
      if (blob) {
        await fetch(`http://localhost:3001/save-frame?frame=${i}`, {
          method: "POST",
          headers: { "Content-Type": "image/png" },
          body: blob,
        });
      }
    }
    await fetch(`http://localhost:3001/finish`, { method: "POST" });
    this.isRecording = false;
  }

  public stop() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }
}
