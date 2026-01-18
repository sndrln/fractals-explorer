import type { FractalParams } from "../types/fractal-params";
import type { MandelbrotParams } from "../types/mandelbrot-params";
import type { NovaParams } from "../types/nova-params";

export const FRACTAL_DEFAULTS: Record<string, FractalParams> = {
  nova: {
    relaxation: 0.3,
    powerMain: 3.0,
    powerMainImaginary: 0.0,
    powerDerivative: 2.0,
    powerDerivativeImaginary: 0.0,
    subtrahend: 1.0,
    maxIterations: 80,
    memoryR: 0.0,
    memoryI: 0.0,
    seedX: 0.0,
    seedY: 0.0,
    juliaMorph: 0.0,
  } as NovaParams,
  mandelbrot: {
    maxIterations: 100,
    power: 2.0,
    seedX: 0,
    seedY: 0,
  } as MandelbrotParams,
};
