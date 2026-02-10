#include "common_header"

vec2 fractalStep(vec2 z, vec2 c, vec2 p, vec2 zPrev) {
  vec2 zSq = complexMul(z, z);
  vec2 numerator = zSq + c - vec2(1.0, 0.0);
  vec2 denominator = 2.0 * z + c - vec2(2.0, 0.0);

  vec2 fraction = complexDiv(numerator, denominator);

  return complexPower(fraction, p);
}

#include "escape_core"

void main() {
  run_escape_core();
}
