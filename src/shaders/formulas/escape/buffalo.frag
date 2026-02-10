#include "common_header"

vec2 fractalStep(vec2 z, vec2 c, vec2 p, vec2 zPrev) {
  vec2 zP = complexPower(z, p);
  vec2 zAbs = vec2(abs(zP.x), abs(zP.y));

  return zAbs + vec2(c.x, -c.y) - vec2(subtrahend, 0.0);
}

#include "escape_core"

void main() {
  run_escape_core();
}
