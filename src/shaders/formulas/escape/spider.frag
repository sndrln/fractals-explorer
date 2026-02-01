#include "common_header"

void main() {
  vec2 uv =
    (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);

  vec2 seed = vec2(seedR, seedI);
  vec2 coord = uv * zoom + vec2(offsetShiftX, offsetShiftY);

  vec2 z = mix(seed, coord, juliaMorph);
  vec2 c = mix(coord, seed, juliaMorph);
  vec2 p = vec2(power, powerI);

  vec2 memWeight = vec2(memoryR, memoryI);

  float iterations = 0.0;
  float maxIter = maxIterations;
  float escapeRadius = 100.0;

  for (float i = 0.0; i < 1000.0; i++) {
    if (i >= maxIter) break;

    z = complexPower(z, p) + c;

    c = complexMul(c, memWeight) + z;

    if (length(z) > escapeRadius) break;
    iterations++;
  }

  if (iterations >= maxIter - 1.0) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    float smoothIter =
      iterations - log(log(length(z)) / log(escapeRadius)) / log(2.0);
    gl_FragColor = vec4(get_palette(smoothIter / maxIter), 1.0);
  }
}
