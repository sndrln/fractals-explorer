vec2 fractalStep(vec2 z, vec2 c, vec2 p, vec2 zPrev) {
  vec2 zP = complexPower(z, p);
  vec2 zInv = complexDiv(vec2(1.0, 0.0), zP);
  return zInv + c - vec2(subtrahend, 0.0);
}
