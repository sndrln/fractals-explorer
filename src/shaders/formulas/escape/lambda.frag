#include "common_header"

vec2 fractalStep(vec2 z, vec2 c, vec2 p, vec2 zPrev) {
  // c * z * (1 - z) ... using 'p' as an exponent for variation
  vec2 oneMinusZ = vec2(1.0, 0.0) - z;
  vec2 logic = complexMul(z, oneMinusZ);
  return complexMul(c, complexPower(logic, p));
}

#include "escape_core"

void main() {
  run_escape_core();
}
