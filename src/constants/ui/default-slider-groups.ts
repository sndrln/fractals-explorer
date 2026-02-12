import type { SliderGroup } from "../../types/ui";

export const DEFAULT_SLIDER_GROUPS: Record<string, SliderGroup[]> = {
  escape: [
    {
      label: "Julia Morph",
      colorKey: "juliaMorph",
      sliders: [{ parameterUnitId: "juliaMorph" }],
    },
    {
      label: "Coordinate / Seed",
      colorKey: "seed",
      sliders: [
        { parameterUnitId: "seedR" },
        { parameterUnitId: "seedI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Power",
      colorKey: "power",
      sliders: [
        { parameterUnitId: "power" },
        { parameterUnitId: "powerI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Memory (zₙ₋₁)",
      colorKey: "memory",
      sliders: [
        { parameterUnitId: "memoryR" },
        { parameterUnitId: "memoryI", unitSuffix: "i", showPlus: true },
      ],
    },
  ],
  newton: [
    {
      label: "Power (P)",
      colorKey: "power",
      sliders: [
        { parameterUnitId: "power" },
        { parameterUnitId: "powerI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Relaxation (a)",
      colorKey: "relaxation",
      sliders: [
        { parameterUnitId: "relaxation" },
        { parameterUnitId: "relaxationI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Memory (zₙ₋₁)",
      colorKey: "memory",
      sliders: [
        { parameterUnitId: "memoryR" },
        { parameterUnitId: "memoryI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Subtrahend",
      colorKey: "subtrahend",
      sliders: [
        { parameterUnitId: "subtrahend" },
        { parameterUnitId: "subtrahendI", unitSuffix: "i", showPlus: true },
      ],
    },
  ],
  nova: [
    {
      label: "Power (P)",
      colorKey: "power",
      sliders: [
        { parameterUnitId: "power" },
        { parameterUnitId: "powerI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Relaxation (a)",
      colorKey: "relaxation",
      sliders: [
        { parameterUnitId: "relaxation" },
        { parameterUnitId: "relaxationI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Subtrahend (s)",
      colorKey: "subtrahend",
      sliders: [
        { parameterUnitId: "subtrahend" },
        { parameterUnitId: "subtrahendI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Nova Constant (c)",
      colorKey: "seed",
      sliders: [
        { parameterUnitId: "seedR" },
        { parameterUnitId: "seedI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Memory (zₙ₋₁)",
      colorKey: "memory",
      sliders: [
        { parameterUnitId: "memoryR" },
        { parameterUnitId: "memoryI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Julia Morph",
      colorKey: "juliaMorph",
      sliders: [
        {
          parameterUnitId: "juliaMorph",
          min: 0.0,
          max: 1.0,
          step: 0.01,
        },
      ],
    },
  ],
  kleinian: [
    {
      label: "Seed A",
      colorKey: "seed",
      sliders: [
        { parameterUnitId: "seedR" },
        { parameterUnitId: "seedI", unitSuffix: "i" },
      ],
    },
    {
      label: "Seed B",
      colorKey: "subtrahend",
      sliders: [
        { parameterUnitId: "subtrahend" },
        { parameterUnitId: "subtrahendI", unitSuffix: "i" },
      ],
    },
    {
      label: "Radius",
      colorKey: "relaxation",
      sliders: [
        { parameterUnitId: "relaxation" },
        { parameterUnitId: "kleinianSphere" },
      ],
    },
    {
      label: "Box Fold",
      colorKey: "kleinian",
      sliders: [{ parameterUnitId: "kleinianBox", min: 0, max: 2 }],
    },
    {
      label: "Warp",
      colorKey: "power",
      sliders: [
        { parameterUnitId: "power" },
        { parameterUnitId: "powerI", unitSuffix: "i" },
      ],
    },
    {
      label: "Memory",
      colorKey: "memory",
      sliders: [
        { parameterUnitId: "memoryR" },
        { parameterUnitId: "memoryI", unitSuffix: "i" },
      ],
    },
    {
      label: "Seed Morph",
      colorKey: "juliaMorph",
      sliders: [{ parameterUnitId: "juliaMorph", min: 0, max: 1 }],
    },
  ],
};
