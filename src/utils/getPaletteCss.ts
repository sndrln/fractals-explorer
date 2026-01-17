const clamp = (val: number) => Math.max(0, Math.min(255, val));

export function getPaletteCSS(p: any) {
  const samples = [];
  for (let i = 0; i <= 4; i++) {
    const t = i / 4;
    const r = clamp(
      Math.floor(
        (p.brightness[0] +
          p.contrast[0] * Math.cos(6.28318 * (p.osc[0] * t + p.phase[0]))) *
          255
      )
    );
    const g = clamp(
      Math.floor(
        (p.brightness[1] +
          p.contrast[1] * Math.cos(6.28318 * (p.osc[1] * t + p.phase[1]))) *
          255
      )
    );
    const b = clamp(
      Math.floor(
        (p.brightness[2] +
          p.contrast[2] * Math.cos(6.28318 * (p.osc[2] * t + p.phase[2]))) *
          255
      )
    );
    samples.push(`rgb(${r},${g},${b})`);
  }
  return `linear-gradient(to right, ${samples.join(", ")})`;
}
