import buffaloRaw from "../shaders/formulas/escape/buffalo.frag?raw";
import shipRaw from "../shaders/formulas/escape/burning_ship.frag?raw";
import celticRaw from "../shaders/formulas/escape/celtic.frag?raw";
import heartRaw from "../shaders/formulas/escape/heart.frag?raw";
import invExpRaw from "../shaders/formulas/escape/inv_exp.frag?raw";
import invMandelRaw from "../shaders/formulas/escape/inv_mandel.frag?raw";
import lambdaRaw from "../shaders/formulas/escape/lambda.frag?raw";
import magnetRaw from "../shaders/formulas/escape/magnet.frag?raw";
import mandelRaw from "../shaders/formulas/escape/mandelbrot.frag?raw";
import tricornRaw from "../shaders/formulas/escape/tricorn.frag?raw";
import kleinianRaw from "../shaders/formulas/kleinian/kleinian_basic.frag?raw";
import newtonExpRaw from "../shaders/formulas/newton/newton_exp.frag?raw";
import newtonHybridRaw from "../shaders/formulas/newton/newton_hybrid.frag?raw";
import newtonSinRaw from "../shaders/formulas/newton/newton_sin.frag?raw";
import newtonStdRaw from "../shaders/formulas/newton/newton_std.frag?raw";
import novaHybridRaw from "../shaders/formulas/nova/nova_hybrid.frag?raw";
import novaSinRaw from "../shaders/formulas/nova/nova_sin.frag?raw";
import novaStdRaw from "../shaders/formulas/nova/nova_std.frag?raw";
import type { FormulaDefinition } from "../types/fractal";

export const FORMULAS: FormulaDefinition[] = [
  // --- ESCAPE TIME ---
  {
    id: "mandelbrot",
    name: "Mandelbrot",
    fractalType: "escape",
    mathNotation: "z^P + c",
    shaderSource: mandelRaw,
    cameraZoom: 2.5,
    cameraOffset: { x: -1.0, y: 0.0 },
  },
  {
    id: "burning-ship",
    name: "Burning Ship",
    fractalType: "escape",
    mathNotation: "(|Re(z)| + i|Im(z)|)^P + c",
    shaderSource: shipRaw,
    cameraZoom: 2.4,
    cameraOffset: { x: 0.4, y: 0.6 },
  },
  {
    id: "tricorn",
    name: "Tricorn",
    fractalType: "escape",
    mathNotation: "z̅^P + c",
    shaderSource: tricornRaw,
    cameraZoom: 3.5,
    cameraOffset: { x: 0.4, y: 0 },
  },
  {
    id: "buffalo",
    name: "Buffalo",
    fractalType: "escape",
    mathNotation: "|Re(z)^P - Im(z)^P| + c",
    shaderSource: buffaloRaw,
    cameraZoom: 2.6,
    cameraOffset: { x: -0.1, y: 0.6 },
  },
  {
    id: "celtic",
    name: "Celtic",
    fractalType: "escape",
    mathNotation: "|Re(z^P)| + iIm(z^P) + c",
    shaderSource: celticRaw,
    cameraZoom: 4,
    cameraOffset: { x: -0.2, y: 0 },
  },
  {
    id: "heart",
    name: "Heart",
    fractalType: "escape",
    mathNotation: "(|Re(z)| + iIm(z))^P + c",
    shaderSource: heartRaw,
    cameraZoom: 2.5,
    cameraOffset: { x: 0, y: 0 },
  },
  {
    id: "magnet",
    name: "Magnet M1",
    fractalType: "escape",
    // Fixed: spaces around * and / for better parsing
    mathNotation: "(\\frac{z^P + c - 1}{2 * z + c - 2})^P",
    shaderSource: magnetRaw,
    cameraZoom: 5.0,
    cameraOffset: { x: 0.5, y: 0 },
  },
  {
    id: "lambda",
    name: "Lambda",
    fractalType: "escape",
    mathNotation: "c * z * (1 - z)",
    shaderSource: lambdaRaw,
    cameraZoom: 4.2,
    cameraOffset: { x: 0.5, y: 0.0 },
    parameterValues: { power: 1.0, seedR: 0.5, seedI: 0.0 },
  },
  {
    id: "inv-mandel",
    name: "Inverted Mandelbrot",
    fractalType: "escape",
    mathNotation: "z^P + 1 / c",
    shaderSource: invMandelRaw,
    cameraZoom: 4.5,
    cameraOffset: { x: 0.8, y: 0 },
  },
  {
    id: "inv-exp",
    name: "Inverted Exponent",
    fractalType: "escape",
    mathNotation: "1 / z^P + c",
    shaderSource: invExpRaw,
    cameraZoom: 4.0,
    cameraOffset: { x: 0.5, y: 0 },
    parameterValues: { memoryR: -1 },
  },

  // --- NEWTON (Using f'(z) shorthand) ---
  {
    id: "newton-std",
    name: "Newton Standard",
    fractalType: "newton",
    mathNotation: "z - R * \\frac{z^P - 1}{f'(z)}",
    shaderSource: newtonStdRaw,
    cameraZoom: 3.0,
    cameraOffset: { x: -0.3, y: 0 },
    parameterValues: { power: 3.0 },
  },
  {
    id: "newton-sin",
    name: "Newton Sine",
    fractalType: "newton",
    mathNotation: "z - R * \\frac{sin(P * z) - S}{f'(z)}",
    shaderSource: newtonSinRaw,
    cameraZoom: 5.0,
    cameraOffset: { x: 0, y: 0 },
    parameterValues: { power: 1.0, subtrahend: 0.0, relaxation: 0.9 },
  },
  {
    id: "newton-exp",
    name: "Newton Exponential",
    fractalType: "newton",
    mathNotation: "z - R * \\frac{e^{Pz} - c}{f'(z)}",
    shaderSource: newtonExpRaw,
    cameraZoom: 5.0,
    cameraOffset: { x: 0, y: 0 },
    parameterValues: { power: 1, relaxation: 0.9 },
  },
  {
    id: "newton-hybrid",
    name: "Newton Hybrid",
    fractalType: "newton",
    mathNotation: "z - R * \\frac{z^P * sin(z) - c}{f'(z)}",
    shaderSource: newtonHybridRaw,
    cameraOffset: { x: 0, y: 0 },
    cameraZoom: 5.0,
  },

  // --- NOVA (Using f'(z) shorthand) ---
  {
    id: "nova-std",
    name: "Nova Standard",
    fractalType: "nova",
    mathNotation: "z - R * \\frac{z^P - S}{f'(z)} + c",
    shaderSource: novaStdRaw,
    cameraZoom: 2.0,
    cameraOffset: { x: -0.5, y: 0 },
    parameterValues: { power: 3.0, seedR: 1.0 },
  },
  {
    id: "nova-sin",
    name: "Nova Sine",
    fractalType: "nova",
    mathNotation: "z - R * \\frac{sin(P * z) - S}{f'(z)} + c",
    shaderSource: novaSinRaw,
    cameraZoom: 1,
    cameraOffset: { x: -0.1, y: 0 },
    parameterValues: { power: 3.0, subtrahend: 0.75 },
  },
  {
    id: "nova-hybrid",
    name: "Nova Hybrid",
    fractalType: "nova",
    mathNotation: "z - R * \\frac{z^P * sin(z) - S}{f'(z)} + c",
    shaderSource: novaHybridRaw,
    cameraOffset: { x: -0.2, y: 0 },
    cameraZoom: 2.0,
    parameterValues: { power: 2.0 },
  },

  // --- KLEINIAN ---
  {
    id: "kleinian-basic",
    name: "Kleinian Limit Set",
    fractalType: "kleinian",
    mathNotation: "mobius(fold(z))",
    shaderSource: kleinianRaw,
    cameraZoom: 2,
    cameraOffset: { x: -0.3, y: 0.0 },
    parameterValues: {
      power: 1.0,
      seedR: 1.8,
      seedI: 0.1,
      subtrahend: 1.5,
      relaxation: 2.0,
      juliaMorph: 1.0,
    },
  },
];
