vec2 fractalStep(vec2 z, vec2 subtrahend, vec2 power, vec2 zPrev) {
  // f(z) = (z^p * sin(z)) - c
  vec2 zPow = complexPower(z, power);
  vec2 sZ = complexSin(z);
  vec2 fz = complexMul(zPow, sZ) - subtrahend;

  // df(z) = p * z^(p-1) * sin(z) + z^p * cos(z)
  vec2 pMinus1 = power - vec2(1.0, 0.0);
  vec2 term1 = complexMul(complexMul(power, complexPower(z, pMinus1)), sZ);
  vec2 term2 = complexMul(zPow, complexCos(z));
  vec2 dfz = term1 + term2;

  // Newton step: -f(z)/f'(z)
  return -complexDiv(fz, dfz);
}
