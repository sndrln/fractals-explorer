#include "common_header"

vec2 fractalStep(vec2 z, vec2 c, vec2 p, vec2 zPrev, float i) {
  vec2 zAbs = vec2(abs(z.x), abs(z.y));
  return complexPower(zAbs, p) + vec2(c.x, -c.y) - vec2(subtrahend, 0.0);
}

#include "escape_engine"

void main() {
  run_escape_engine();
}
