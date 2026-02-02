import mandelRaw from "../shaders/formulas/escape/mandelbrot.frag?raw";
import magnetRaw from "../shaders/formulas/escape/magnet.frag?raw";
import shipRaw from "../shaders/formulas/escape/burning_ship.frag?raw";
import tricornRaw from "../shaders/formulas/escape/tricorn.frag?raw";
import buffaloRaw from "../shaders/formulas/escape/buffalo.frag?raw";
import celticRaw from "../shaders/formulas/escape/celtic.frag?raw";
import invExpRaw from "../shaders/formulas/escape/inv_exp.frag?raw";
import invMandelRaw from "../shaders/formulas/escape/inv_mandel.frag?raw";
import spiderRaw from "../shaders/formulas/escape/spider.frag?raw";
import heartRaw from "../shaders/formulas/escape/heart.frag?raw";
import lambdaRaw from "../shaders/formulas/escape/lambda.frag?raw";
import newtonStdRaw from "../shaders/formulas/newton/newton_std.frag?raw";
import newtonSinRaw from "../shaders/formulas/newton/newton_sin.frag?raw";
import newtonExpRaw from "../shaders/formulas/newton/newton_exp.frag?raw";
import newtonHybridRaw from "../shaders/formulas/newton/newton_hybrid.frag?raw";
import novaStdRaw from "../shaders/formulas/nova/nova_std.frag?raw";
import novaSinRaw from "../shaders/formulas/nova/nova_sin.frag?raw";
import novaHybridRaw from "../shaders/formulas/nova/nova_hybrid.frag?raw";
import type { FormulaDefinition } from "../types/ui";

export const FORMULAS: FormulaDefinition[] = [
  {
    id: "mandelbrot",
    name: "Mandelbrot",
    fractalType: "escape",
    displayString: "z² + c",
    shaderSource: mandelRaw,
    // customUI: [
    //   ...BASE_CONTROL_GROUPS.escape,
    //   {
    //     label: "Julia Morph",
    //     colorKey: "julia",
    //     sliders: [{ paramKey: "juliaMorph", min: 0, max: 5 }],
    //   },
    // ],
    zoom: 2.5,
    offsetShiftX: 0.0,
    offsetShiftY: 0.0,
  },
  {
    id: "burning-ship",
    name: "Burning Ship",
    fractalType: "escape",
    displayString: "(|Re(z)| + i|Im(z)|)² + c",
    shaderSource: shipRaw,
    zoom: 2.2,
    offsetShiftX: 0.5,
    offsetShiftY: 0.5,
  },
  {
    id: "tricorn",
    name: "Tricorn",
    fractalType: "escape",
    displayString: "conj(z)² + c",
    shaderSource: tricornRaw,
    zoom: 3.0,
  },
  {
    id: "buffalo",
    name: "Buffalo",
    fractalType: "escape",
    displayString: "|Re(z)² - Im(z)²| + c",
    shaderSource: buffaloRaw,
    zoom: 3.0,
    offsetShiftX: -0.3,
  },
  {
    id: "celtic",
    name: "Celtic",
    fractalType: "escape",
    displayString: "|Re(z²)| + iIm(z²) + c",
    shaderSource: celticRaw,
    zoom: 3.2,
    offsetShiftX: -0.2,
  },
  {
    id: "heart",
    name: "Heart",
    fractalType: "escape",
    displayString: "(|Re(z)| + iIm(z))² + c",
    shaderSource: heartRaw,
    zoom: 2.5,
  },
  {
    id: "magnet",
    name: "Magnet M1",
    fractalType: "escape",
    displayString: "((z²+c-1)/(2z+c-2))²",
    shaderSource: magnetRaw,
    zoom: 5.0,
  },
  {
    id: "lambda",
    name: "Lambda",
    fractalType: "escape",
    displayString: "c · z(1-z)",
    shaderSource: lambdaRaw,
    zoom: 4.0,
    offsetShiftX: 0.5,
    defaults: { power: 1.0 },
  },
  {
    id: "spider",
    name: "Spider",
    fractalType: "escape",
    displayString: "zₙ₊₁ = zₙ² + cₙ, cₙ₊₁ = cₙ/2 + zₙ",
    shaderSource: spiderRaw,
    zoom: 2.5,
    offsetShiftX: -1.0,
    defaults: { memoryR: 0.5 },
  },
  {
    id: "inv-mandel",
    name: "Inverted Mandelbrot",
    fractalType: "escape",
    displayString: "z² + 1/c",
    shaderSource: invMandelRaw,
    zoom: 4.5,
    offsetShiftX: 0.5,
  },
  {
    id: "inv-exp",
    name: "Inverted Exponent",
    fractalType: "escape",
    displayString: "1/z² + c",
    shaderSource: invExpRaw,
    zoom: 3.0,
    offsetShiftX: 0.5,
  },

  // Newton formulas
  {
    id: "newton-std",
    name: "Newton Standard",
    fractalType: "newton",
    displayString: "zᴾ - 1 = 0",
    shaderSource: newtonStdRaw,
    zoom: 3.0,
    defaults: { power: 3.0 },
  },
  {
    id: "newton-sin",
    name: "Newton Sine",
    fractalType: "newton",
    displayString: "z - a·tan(z)",
    shaderSource: newtonSinRaw,
    zoom: 5.0,
    defaults: { power: 1.0, subtrahend: 0.0 },
  },
  {
    id: "newton-exp",
    name: "Newton Exponential",
    fractalType: "newton",
    displayString: "eᴾᶻ - c = 0",
    shaderSource: newtonExpRaw,
    zoom: 4.0,
    defaults: {
      power: 1,
    },
  },
  {
    id: "newton-hybrid",
    name: "Newton Hybrid",
    fractalType: "newton",
    displayString: "zᴾ · sin(z) - c = 0",
    shaderSource: newtonHybridRaw,
    zoom: 5.0,
  },
  {
    id: "nova-std",
    name: "Nova Standard",
    fractalType: "nova",
    displayString: "zₙ₊₁ = zₙ - a(zᴾ-s)/Pzᴾ⁻¹ + c",
    shaderSource: novaStdRaw,
    zoom: 4.0,
    defaults: {
      power: 3.0,
      seedR: 1.0,
    },
  },
  {
    id: "nova-sin",
    name: "Nova Sine",
    fractalType: "nova",
    displayString: "zₙ₊₁ = zₙ - α(sin(P·zₙ) - S) / (P·cos(P·zₙ)) + c",
    shaderSource: novaSinRaw,
    zoom: 4.0,
    defaults: {
      power: 3.0,
    },
  },
  {
    id: "nova-hybrid",
    name: "Nova Hybrid",
    fractalType: "nova",
    displayString: "zₙ₊₁ = zₙ - a(zᴾ sin z - s)/f' + c",
    shaderSource: novaHybridRaw,
    zoom: 6.0,
    defaults: {
      power: 2.0,
    },
  },
];
