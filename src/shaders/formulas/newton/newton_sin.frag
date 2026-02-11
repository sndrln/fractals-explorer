vec2 fractalStep(vec2 z, vec2 c, vec2 p, vec2 zPrev) {
  return -complexMul(vec2(p.x, 0.0), complexTan(z)) - c;
}
