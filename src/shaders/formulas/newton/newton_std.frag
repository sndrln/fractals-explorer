vec2 fractalStep(vec2 z, vec2 subtrahend, vec2 power, vec2 zPrev) {
  // f(z) = z^p - 1
  vec2 fz = complexPower(z, power) - subtrahend;

  // dfz = p * z^(p-1)
  vec2 pMinus1 = power - vec2(1.0, 0.0);
  vec2 dfz = complexMul(power, complexPower(z, pMinus1));

  // return -f(z)/f'(z)
  return -complexDiv(fz, dfz);
}
