vec2 fractalStep(vec2 z, vec2 s, vec2 p, vec2 zPrev) {
  // f(z) = (z^p * sin(z)) - s
  vec2 zPow = complexPower(z, p);
  vec2 sZ = complexSin(z);
  vec2 fz = complexMul(zPow, sZ) - s;

  // Derivative using Product Rule: f'(z) = [p * z^(p-1) * sin(z)] + [z^p * cos(z)]
  vec2 pMinus1 = p - vec2(1.0, 0.0);
  vec2 dzPow = complexMul(p, complexPower(z, pMinus1));

  vec2 term1 = complexMul(dzPow, sZ);
  vec2 term2 = complexMul(zPow, complexCos(z));
  vec2 dfz = term1 + term2;

  // Return displacement: -f(z)/f'(z)
  return -complexDiv(fz, dfz);
}
