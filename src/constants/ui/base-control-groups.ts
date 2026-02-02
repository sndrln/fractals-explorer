import type { ControlGroup } from "../../types/ui";

export const BASE_CONTROL_GROUPS: Record<string, ControlGroup[]> = {
  escape: [
    {
      label: "Julia Morph",
      colorKey: "juliaMorph",
      sliders: [{ paramKey: "juliaMorph" }],
    },
    {
      label: "Seed Offset",
      colorKey: "seed",
      sliders: [
        { paramKey: "seedR" },
        { paramKey: "seedI", suffix: "i", showPlus: true },
      ],
    },
    {
      label: "Power",
      colorKey: "power",
      sliders: [
        { paramKey: "power" },
        { paramKey: "powerI", suffix: "i", showPlus: true },
      ],
    },
    {
      label: "Memory (zₙ₋₁)",
      colorKey: "memory",
      sliders: [
        { paramKey: "memoryR" },
        { paramKey: "memoryI", suffix: "i", showPlus: true },
      ],
    },
  ],
  newton: [
    {
      label: "Power (P)",
      colorKey: "power",
      sliders: [
        { paramKey: "power" },
        { paramKey: "powerI", suffix: "i", showPlus: true },
      ],
    },
    {
      label: "Relaxation (a)",
      colorKey: "relaxation",
      sliders: [
        { paramKey: "relaxation" },
        { paramKey: "relaxationI", suffix: "i", showPlus: true },
      ],
    },
    {
      label: "Memory (zₙ₋₁)",
      colorKey: "memory",
      sliders: [
        { paramKey: "memoryR" },
        { paramKey: "memoryI", suffix: "i", showPlus: true },
      ],
    },
    {
      label: "Subtrahend",
      colorKey: "subtrahend",
      sliders: [
        { paramKey: "subtrahend" },
        { paramKey: "subtrahendI", suffix: "i", showPlus: true },
      ],
    },
  ],
  nova: [
    {
      label: "Power (P)",
      colorKey: "power",
      sliders: [
        { paramKey: "power" },
        { paramKey: "powerI", suffix: "i", showPlus: true },
      ],
    },
    {
      label: "Relaxation (a)",
      colorKey: "relaxation",
      sliders: [
        { paramKey: "relaxation" },
        { paramKey: "relaxationI", suffix: "i", showPlus: true },
      ],
    },
    {
      label: "Subtrahend (s)",
      colorKey: "subtrahend",
      sliders: [
        { paramKey: "subtrahend" },
        { paramKey: "subtrahendI", suffix: "i", showPlus: true },
      ],
    },
    {
      label: "Nova Constant (c)",
      colorKey: "seed",
      sliders: [
        { paramKey: "seedR" },
        { paramKey: "seedI", suffix: "i", showPlus: true },
      ],
    },
    {
      label: "Memory (zₙ₋₁)",
      colorKey: "memory",
      sliders: [
        { paramKey: "memoryR" },
        { paramKey: "memoryI", suffix: "i", showPlus: true },
      ],
    },
    {
      label: "Julia Morph",
      colorKey: "juliaMorph",
      sliders: [
        {
          paramKey: "juliaMorph",
          min: 0.0,
          max: 1.0,
          step: 0.01,
        },
      ],
    },
  ],
};
