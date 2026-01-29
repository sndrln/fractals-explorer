#include "common_header"

vec2 fractalStep(vec2 z, vec2 c, vec2 p, vec2 zPrev, float i) {
  vec2 zConj = vec2(z.x, -z.y);
  return complexPower(zConj, p) + c - vec2(subtrahend, 0.0);
}

#include "escape_engine"

void main() {
  run_escape_engine();
}
