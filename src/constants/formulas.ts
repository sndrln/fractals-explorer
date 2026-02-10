import buffaloRaw from "../shaders/formulas/escape/buffalo.frag?raw";
import shipRaw from "../shaders/formulas/escape/burning_ship.frag?raw";
import celticRaw from "../shaders/formulas/escape/celtic.frag?raw";
import heartRaw from "../shaders/formulas/escape/heart.frag?raw";
import invExpRaw from "../shaders/formulas/escape/inv_exp.frag?raw";
import invMandelRaw from "../shaders/formulas/escape/inv_mandel.frag?raw";
import lambdaRaw from "../shaders/formulas/escape/lambda.frag?raw";
import magnetRaw from "../shaders/formulas/escape/magnet.frag?raw";
import mandelRaw from "../shaders/formulas/escape/mandelbrot.frag?raw";
import spiderRaw from "../shaders/formulas/escape/spider.frag?raw";
import tricornRaw from "../shaders/formulas/escape/tricorn.frag?raw";
import kleinianRaw from "../shaders/formulas/kleinian/kleinian_basic.frag?raw";
import newtonExpRaw from "../shaders/formulas/newton/newton_exp.frag?raw";
import newtonHybridRaw from "../shaders/formulas/newton/newton_hybrid.frag?raw";
import newtonSinRaw from "../shaders/formulas/newton/newton_sin.frag?raw";
import newtonStdRaw from "../shaders/formulas/newton/newton_std.frag?raw";
import novaHybridRaw from "../shaders/formulas/nova/nova_hybrid.frag?raw";
import novaSinRaw from "../shaders/formulas/nova/nova_sin.frag?raw";
import novaStdRaw from "../shaders/formulas/nova/nova_std.frag?raw";
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
    offsetShiftX: -1.0,
    offsetShiftY: 0.0,
  },
  {
    id: "burning-ship",
    name: "Burning Ship",
    fractalType: "escape",
    displayString: "(|Re(z)| + i|Im(z)|)² + c",
    shaderSource: shipRaw,
    zoom: 2.4,
    offsetShiftX: 0.4,
    offsetShiftY: 0.6,
  },
  {
    id: "tricorn",
    name: "Tricorn",
    fractalType: "escape",
    displayString: "conj(z)² + c",
    shaderSource: tricornRaw,
    zoom: 3.5,
    offsetShiftX: 0.4,
    offsetShiftY: 0,
  },
  {
    id: "buffalo",
    name: "Buffalo",
    fractalType: "escape",
    displayString: "|Re(z)² - Im(z)²| + c",
    shaderSource: buffaloRaw,
    zoom: 2.6,
    offsetShiftX: -0.1,
    offsetShiftY: 0.6,
  },
  {
    id: "celtic",
    name: "Celtic",
    fractalType: "escape",
    displayString: "|Re(z²)| + iIm(z²) + c",
    shaderSource: celticRaw,
    zoom: 4,
    offsetShiftX: -0.2,
    offsetShiftY: 0,
  },
  {
    id: "heart",
    name: "Heart",
    fractalType: "escape",
    displayString: "(|Re(z)| + iIm(z))² + c",
    shaderSource: heartRaw,
    zoom: 2.5,
    offsetShiftX: 0,
  },
  {
    id: "magnet",
    name: "Magnet M1",
    fractalType: "escape",
    displayString: "((z²+c-1)/(2z+c-2))²",
    shaderSource: magnetRaw,
    zoom: 5.0,
    offsetShiftX: 0.5,
  },
  {
    id: "lambda",
    name: "Lambda",
    fractalType: "escape",
    displayString: "c · zₙ(1 - zₙ)",
    shaderSource: lambdaRaw,
    zoom: 4.2,
    offsetShiftX: 0.5,
    offsetShiftY: 0.0,
    defaults: {
      power: 1.0,
      seedR: 0.5,
      seedI: 0.0,
    },
  },
  {
    id: "spider",
    name: "Spider",
    fractalType: "escape",
    displayString: "zₙ² + cₙ, cₙ₊₁ = cₙ/2 + zₙ",
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
    offsetShiftX: 0.8,
  },
  {
    id: "inv-exp",
    name: "Inverted Exponent",
    fractalType: "escape",
    displayString: "1/z² + c",
    shaderSource: invExpRaw,
    zoom: 4.0,
    offsetShiftX: 0.5,
    defaults: { memoryR: -1 },
  },

  // Newton
  {
    id: "newton-std",
    name: "Newton Standard",
    fractalType: "newton",
    displayString: "zᴾ - 1 = 0",
    shaderSource: newtonStdRaw,
    zoom: 3.0,
    offsetShiftX: -0.3,
    defaults: { power: 3.0 },
  },
  {
    id: "newton-sin",
    name: "Newton Sine",
    fractalType: "newton",
    displayString: "z - a·tan(z)",
    shaderSource: newtonSinRaw,
    zoom: 5.0,
    defaults: { power: 1.0, subtrahend: 0.0, relaxation: 0.9 },
  },
  {
    id: "newton-exp",
    name: "Newton Exponential",
    fractalType: "newton",
    displayString: "eᴾᶻ - c = 0",
    shaderSource: newtonExpRaw,
    zoom: 5.0,
    defaults: {
      power: 1,
      relaxation: 0.9,
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
  // Nova
  {
    id: "nova-std",
    name: "Nova Standard",
    fractalType: "nova",
    displayString: "zₙ - a(zᴾ-s)/Pzᴾ⁻¹ + c",
    shaderSource: novaStdRaw,
    zoom: 2.0,
    offsetShiftX: -0.5,
    defaults: {
      power: 3.0,
      seedR: 1.0,
    },
  },
  {
    id: "nova-sin",
    name: "Nova Sine",
    fractalType: "nova",
    displayString: "zₙ - α(sin(P·zₙ) - S) / (P·cos(P·zₙ)) + c",
    shaderSource: novaSinRaw,
    zoom: 1,
    offsetShiftX: -0.1,
    defaults: {
      power: 3.0,
      subtrahend: 0.75,
    },
  },
  {
    id: "nova-hybrid",
    name: "Nova Hybrid",
    fractalType: "nova",
    displayString: "zₙ - a(zᴾ sin z - s)/f' + c",
    shaderSource: novaHybridRaw,
    offsetShiftX: -0.2,
    zoom: 2.0,
    defaults: {
      power: 2.0,
    },
  },
  // Kleinian
  {
    id: "kleinian-basic",
    name: "Kleinian Limit Set",
    fractalType: "kleinian",
    displayString: "z = mobius(fold(z))",
    shaderSource: kleinianRaw,
    zoom: 2,
    offsetShiftX: -0.3,
    offsetShiftY: 0.0,
    defaults: {
      maxIterations: 100,
      power: 1.0,
      powerI: 0.0,
      seedR: 1.8, // Generator A Translation
      seedI: 0.1,
      subtrahend: 1.5, // Generator B Translation
      subtrahendI: 0.0,
      relaxation: 2.0, // Inversion Radius
      relaxationI: 0.0,
      juliaMorph: 1.0,
      memoryR: 0.0,
      memoryI: 0.0,
    },
  },
];
