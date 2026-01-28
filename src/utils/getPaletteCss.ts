import type { Palette } from "../types/palette";

const clamp = (val: number) => Math.max(0, Math.min(255, val));

export function getPaletteCSS(palette: Palette) {
  const samples = [];
  for (let i = 0; i <= 4; i++) {
    const t = i / 4;
    const r = clamp(
      Math.floor(
        (palette.brightness[0] +
          palette.contrast[0] *
            Math.cos(6.28318 * (palette.osc[0] * t + palette.phase[0]))) *
          255,
      ),
    );
    const g = clamp(
      Math.floor(
        (palette.brightness[1] +
          palette.contrast[1] *
            Math.cos(6.28318 * (palette.osc[1] * t + palette.phase[1]))) *
          255,
      ),
    );
    const b = clamp(
      Math.floor(
        (palette.brightness[2] +
          palette.contrast[2] *
            Math.cos(6.28318 * (palette.osc[2] * t + palette.phase[2]))) *
          255,
      ),
    );
    samples.push(`rgb(${r},${g},${b})`);
  }
  return `linear-gradient(to right, ${samples.join(", ")})`;
}
