#include "common_header"

vec2 fractalStep(vec2 z, vec2 c, vec2 p, vec2 zPrev, float i) {
  vec2 zP = complexPower(z, p);
  vec2 zAbs = vec2(abs(zP.x), abs(zP.y));

  return zAbs + c - vec2(subtrahend, 0.0);
}

#include "escape_engine"

void main() {
  run_escape_engine();
}
