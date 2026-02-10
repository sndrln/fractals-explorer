#include "common_header"

vec2 fractalStep(vec2 z, vec2 c, vec2 p, vec2 zPrev) {
  // Heart: (|Re(z)| + i*Im(z))^p + c
  vec2 zHeart = vec2(abs(z.x), z.y);
  return complexPower(zHeart, p) + c - vec2(subtrahend, 0.0);
}

#include "escape_core"

void main() {
  run_escape_core();
}
