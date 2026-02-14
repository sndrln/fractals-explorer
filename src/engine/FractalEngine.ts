import { DEFAULT_PARAMETER_VALUES } from "../constants/default-parameter-values";
import { FORMULAS } from "../constants/formulas";
import vertSource from "../shaders/base.vert";
import escapeCore from "../shaders/cores/escape_core.glsl?raw";
import kleinianCore from "../shaders/cores/kleinian_core.glsl?raw";
import newtonCore from "../shaders/cores/newton_core.glsl?raw";
import novaCore from "../shaders/cores/nova_core.glsl?raw";
import mainTemplate from "../shaders/main_template.frag?raw";
import coloringModes from "../shaders/shared/coloring_modes.glsl?raw";
import commonHeader from "../shaders/shared/common_header.glsl?raw";
import complexMath from "../shaders/shared/complex_math.glsl?raw";
import modifiers from "../shaders/shared/modifiers.glsl?raw";
import type {
  LFOConfig,
  ModifiedParameter,
  ModifierConfig,
  ParameterUnitId,
} from "../types/parameter";

import { processShader } from "../utils/shaderLoader";

const shaderLibrary = {
  complex_math: complexMath,
  common_header: commonHeader,
  modifiers: modifiers,
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

  "zModIntensity",
  "zModCondition",
  "cModIntensity",
  "cModCondition",
  "zPrevModIntensity",
  "zPrevModCondition",
  ...Object.keys(DEFAULT_PARAMETER_VALUES),
];

const getModMath = (id: string) => {
  const map: Record<string, string> = {
    NONE: "v",
    ABS_BOTH: "mod_abs_both(v)",
    ABS_X: "mod_abs_x(v)",
    ABS_Y: "mod_abs_y(v)",
    CONJUGATE: "mod_conjugate(v)",
    REVERSE: "mod_reverse(v)",
    INVERT: "mod_invert(v)",
    FOLD: "mod_fold(v, vec2(1.0))",
    SWIZZLE: "mod_swizzle(v)",
    SIN: "complexSin(v)",
    COS: "complexCos(v)",
    TAN: "complexTan(v)",
    SINH: "complexSinh(v)",
    COSH: "complexCosh(v)",
    TANH: "complexTanh(v)",
    EXP: "complexExp(v)",
    LOG: "complexLog(v)",
    SQRT: "complexSqrt(v)",
    DIV_SQ: "mod_div_sq(v)",
    POW3: "complexPower(v, vec2(3.0, 0.0))",
    KALEIDOSCOPE: "mod_kaleidoscope(v, 3.0)",
    POLAR: "mod_polar(v)",
    SPHERE_INVERSION: "mod_sphere_inversion(v, 1.0)",
    TILE: "mod_tile(v)",
    CREASE: "mod_crease(v)",
    SAWTOOTH: "mod_sawtooth(v)",
    WAVEFOLD: "mod_wavefold(v)",
    SHIFT_INVERT: "mod_shift_invert(v)",
    VOXELIZE: "mod_voxelize(v)",
    TAN_WARP: "mod_tan_warp(v)",
    CROSS_FOLD: "mod_cross_fold(v)",
    SPIRAL: "mod_spiral(v)",
    CIRCLE_PULSE: "mod_circle_pulse(v)",
    GLITCH: "mod_glitch(v)",
  };
  return map[id] || "v";
};
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

        #define APPLY_ZMOD(v) ${getModMath(config.modifiers.z.modifierId)}
        #define APPLY_CMOD(v) ${getModMath(config.modifiers.c.modifierId)}
        #define APPLY_MEM(v) ${getModMath(config.modifiers.zPrev.modifierId)}

        // 2. HEADERS & MATH (The Foundation)
        ${shaderLibrary.common_header}
        ${shaderLibrary.complex_math}
        ${shaderLibrary.modifiers}
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

    this.canvas.width = evenWidth;
    this.canvas.height = evenHeight;

    this.gl.viewport(0, 0, evenWidth, evenHeight);
  }

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

      state.fractal.parameters.live[key] = liveVal;
    });

    keys.forEach((key) => {
      const loc = this.uniformLocations[key];
      if (!loc) return;

      const baseVal = state.fractal.parameters.live[key];

      let lfoOffset = 0;
      const lfos = state.lfo.assignments[key];

      if (lfos && lfos.length > 0) {
        lfos.forEach((lfo: LFOConfig) => {
          if (!lfo.active) return;
          // Standard Sine Wave: Amp * sin(freq * t + phase)
          lfoOffset +=
            lfo.amplitude * Math.sin(time * lfo.frequency * 10 + lfo.phase);
        });
      }

      const finalValue = baseVal + lfoOffset;
      this.gl.uniform1f(loc, finalValue);
    });

    this.gl.uniform1f(
      this.uniformLocations.zModIntensity,
      state.modifier.modifiers.z.intensity,
    );
    this.gl.uniform1f(
      this.uniformLocations.cModIntensity,
      state.modifier.modifiers.c.intensity,
    );
    this.gl.uniform1f(
      this.uniformLocations.zPrevModIntensity,
      state.modifier.modifiers.zPrev.intensity,
    );

    const conditionMap: Record<string, number> = {
      ALWAYS: 0,
      Z_REAL_POSITIVE: 1,
      Z_IMAG_POSITIVE: 2,
      Z_MAG_GT_1: 3,
      Z_ANGLE_POSITIVE: 4,
      Z_REAL_GT_IMAG: 5,
      Z_ABS_REAL_GT_ABS_IMAG: 6,
    };
    this.gl.uniform1i(
      this.uniformLocations.zModCondition,
      conditionMap[state.modifier.modifiers.z.conditionId],
    );
    this.gl.uniform1i(
      this.uniformLocations.cModCondition,
      conditionMap[state.modifier.modifiers.c.conditionId],
    );
    this.gl.uniform1i(
      this.uniformLocations.zPrevModCondition,
      conditionMap[state.modifier.modifiers.zPrev.conditionId],
    );

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
