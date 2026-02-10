#include "common_header"
vec2 fractalStep(vec2 z, vec2 s, vec2 p, vec2 zPrev) {
  vec2 pz = complexMul(z, p);
  vec2 fz = complexSin(pz) - s;
  vec2 dfz = complexMul(p, complexCos(pz));
  return -complexDiv(fz, dfz);
}
#include "nova_core"

void main() {
  run_nova_core();
}
