vec2 fractalStep(vec2 z, vec2 subtrahend, vec2 power, vec2 zPrev) {
  // f(z) = exp(z) - c
  // Note: 'power' can be used here to scale the exponent: exp(p*z) - c
  vec2 pz = complexMul(z, power);
  vec2 fz = complexExp(pz) - subtrahend;

  // dfz = p * exp(p*z)
  vec2 dfz = complexMul(power, complexExp(pz));

  // Newton step: -f(z)/f'(z)
  return -complexDiv(fz, dfz);
}
