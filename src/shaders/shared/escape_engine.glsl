vec3 get_fractal_color(vec2 uv) {
  vec2 seed = vec2(seedX, seedY);
  vec2 coord = uv * zoom + vec2(offsetShiftX, offsetShiftY);

  vec2 z = mix(seed, coord, juliaMorph);
  vec2 c = mix(coord, seed, juliaMorph);
  vec2 p = vec2(power, powerI);
  vec2 memFactor = vec2(memoryR, memoryI);
  vec2 zPrev = vec2(0.0);

  float iterations = 0.0;
  float escapeRadius = 100.0;

  for (float i = 0.0; i < 1000.0; i++) {
    if (i >= maxIterations) break;

    vec2 zNext = fractalStep(z, c, p, zPrev, i);

    if (i > 0.0) {
      zNext += complexMul(zPrev, memFactor);
    }

    zPrev = z;
    z = zNext;

    if (length(z) > escapeRadius) break;
    iterations++;
  }

  if (iterations >= maxIterations - 1.0) return vec3(0.0);

  float pMag = length(p);
  float smoothIter =
    iterations - log(log(length(z)) / log(escapeRadius)) / log(max(pMag, 1.1));

  return get_palette(smoothIter / maxIterations);
}

void run_escape_engine() {
  vec2 uv =
    (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
  gl_FragColor = vec4(get_fractal_color(uv), 1.0);
}
