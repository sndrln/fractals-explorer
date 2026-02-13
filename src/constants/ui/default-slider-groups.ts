import type { SliderGroup } from "../../types/ui";

export const DEFAULT_SLIDER_GROUPS: Record<string, SliderGroup[]> = {
  escape: [
    {
      label: "Julia Morph",
      parameterId: "juliaMorph",
      sliders: [{ parameterUnitId: "juliaMorph" }],
    },
    {
      label: "Coordinate / Seed",
      parameterId: "seed",
      sliders: [
        { parameterUnitId: "seedR" },
        { parameterUnitId: "seedI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Power",
      parameterId: "power",
      sliders: [
        { parameterUnitId: "power" },
        { parameterUnitId: "powerI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Memory (zₙ₋₁)",
      parameterId: "memory",
      sliders: [
        { parameterUnitId: "memoryR" },
        { parameterUnitId: "memoryI", unitSuffix: "i", showPlus: true },
      ],
    },
  ],
  newton: [
    {
      label: "Power (P)",
      parameterId: "power",
      sliders: [
        { parameterUnitId: "power" },
        { parameterUnitId: "powerI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Relaxation (a)",
      parameterId: "relaxation",
      sliders: [
        { parameterUnitId: "relaxation" },
        { parameterUnitId: "relaxationI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Memory (zₙ₋₁)",
      parameterId: "memory",
      sliders: [
        { parameterUnitId: "memoryR" },
        { parameterUnitId: "memoryI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Subtrahend",
      parameterId: "subtrahend",
      sliders: [
        { parameterUnitId: "subtrahend" },
        { parameterUnitId: "subtrahendI", unitSuffix: "i", showPlus: true },
      ],
    },
  ],
  nova: [
    {
      label: "Power (P)",
      parameterId: "power",
      sliders: [
        { parameterUnitId: "power" },
        { parameterUnitId: "powerI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Relaxation (a)",
      parameterId: "relaxation",
      sliders: [
        { parameterUnitId: "relaxation" },
        { parameterUnitId: "relaxationI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Subtrahend (s)",
      parameterId: "subtrahend",
      sliders: [
        { parameterUnitId: "subtrahend" },
        { parameterUnitId: "subtrahendI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Nova Constant (c)",
      parameterId: "seed",
      sliders: [
        { parameterUnitId: "seedR" },
        { parameterUnitId: "seedI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Memory (zₙ₋₁)",
      parameterId: "memory",
      sliders: [
        { parameterUnitId: "memoryR" },
        { parameterUnitId: "memoryI", unitSuffix: "i", showPlus: true },
      ],
    },
    {
      label: "Julia Morph",
      parameterId: "juliaMorph",
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
      parameterId: "seed",
      sliders: [
        { parameterUnitId: "seedR" },
        { parameterUnitId: "seedI", unitSuffix: "i" },
      ],
    },
    {
      label: "Seed B",
      parameterId: "subtrahend",
      sliders: [
        { parameterUnitId: "subtrahend" },
        { parameterUnitId: "subtrahendI", unitSuffix: "i" },
      ],
    },
    {
      label: "Radius",
      parameterId: "relaxation",
      sliders: [
        { parameterUnitId: "relaxation" },
        { parameterUnitId: "kleinianSphere" },
      ],
    },
    {
      label: "Box Fold",
      parameterId: "kleinian",
      sliders: [{ parameterUnitId: "kleinianBox", min: 0, max: 2 }],
    },
    {
      label: "Warp",
      parameterId: "power",
      sliders: [
        { parameterUnitId: "power" },
        { parameterUnitId: "powerI", unitSuffix: "i" },
      ],
    },
    {
      label: "Memory",
      parameterId: "memory",
      sliders: [
        { parameterUnitId: "memoryR" },
        { parameterUnitId: "memoryI", unitSuffix: "i" },
      ],
    },
    {
      label: "Seed Morph",
      parameterId: "juliaMorph",
      sliders: [{ parameterUnitId: "juliaMorph", min: 0, max: 1 }],
    },
  ],
};
