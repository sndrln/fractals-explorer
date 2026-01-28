import type { BurningShipParams } from "./fractals/burningship-params";
import type { MagnetParams } from "./fractals/magnet-params";
import type { MandelbrotParams } from "./fractals/mandelbrot-params";
import type { NewtonParams } from "./fractals/newton-params";
import type { NovaParams } from "./fractals/nova-params";

export type FractalParams =
  | NovaParams
  | MandelbrotParams
  | BurningShipParams
  | NewtonParams
  | MagnetParams;
