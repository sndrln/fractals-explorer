#include "common_header"

vec2 fractalStep(vec2 z, vec2 s, vec2 p, vec2 zPrev) {
  vec2 fz = complexPower(z, p) - s;
  vec2 dfz = complexMul(p, complexPower(z, p - vec2(1.0, 0.0)));
  return -complexDiv(fz, dfz);
}

#include "nova_core"
void main() {
  run_nova_core();
}
