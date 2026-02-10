#include "common_header"

vec2 fractalStep(vec2 z, vec2 c, vec2 p, vec2 zPrev) {
  vec2 cInv = complexDiv(vec2(1.0, 0.0), c);
  return complexPower(z, p) + cInv;
}

#include "escape_core"

void main() {
  run_escape_core();
}
