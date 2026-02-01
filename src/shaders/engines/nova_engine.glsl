vec3 get_fractal_color(vec2 uv) {
  vec2 coord = uv * zoom + vec2(offsetShiftX, offsetShiftY);
  vec2 seed = vec2(seedR, seedI);

  // Nova Setup
  vec2 z = mix(seed, coord, juliaMorph);
  vec2 c = mix(coord, seed, juliaMorph);

  vec2 p = vec2(power, powerI);
  vec2 s = vec2(subtrahend, subtrahendI);
  vec2 r = vec2(relaxation, relaxationI);

  vec2 zPrev = z;
  float iterations = 0.0;
  float minDiff = 1000.0;
  bool converged = false;

  for (int i = 0; i < 1000; i++) {
    if (float(i) >= maxIterations) break;
    vec2 tempZ = z;

    // --- MODULAR STEP ---
    // This calls whatever fractalStep is defined in the parent file (Power or Sin)
    vec2 displacement = fractalStep(z, s, p, zPrev);

    // Since displacement is already -f(z)/f'(z), we ADD it here
    vec2 relaxationStep = complexMul(r, displacement);
    vec2 memoryEffect = complexMul(vec2(memoryR, memoryI), zPrev);

    // Apply the Nova update rule
    z = z + relaxationStep + c + memoryEffect;

    float diff = length(z - tempZ);
    if (diff < minDiff) minDiff = diff;

    // MEMORY MODES - RECOMPILATION BLOCK
    #ifdef MEM_ABS_BOTH
    zPrev = abs(tempZ);
    #elif defined(MEM_ABS_X)
    zPrev = vec2(abs(tempZ.x), tempZ.y);
    #elif defined(MEM_ABS_Y)
    zPrev = vec2(tempZ.x, abs(tempZ.y));
    #elif defined(MEM_CONJUGATE)
    zPrev = vec2(tempZ.x, -tempZ.y);
    #elif defined(MEM_REVERSE)
    zPrev = -tempZ;
    #elif defined(MEM_INVERT)
    zPrev = tempZ / (dot(tempZ, tempZ) + 1e-6);
    #elif defined(MEM_SIN)
    zPrev = complexSin(tempZ);
    #elif defined(MEM_COS)
    zPrev = complexCos(tempZ);
    #elif defined(MEM_TAN)
    zPrev = complexTan(tempZ);
    #elif defined(MEM_EXP)
    zPrev = complexExp(tempZ);
    #elif defined(MEM_RECIPROCAL)
    zPrev = complexDiv(vec2(1.0, 0.0), tempZ + 1e-6);
    #elif defined(MEM_POW3)
    zPrev = complexPower(tempZ, vec2(3.0, 0.0));
    #elif defined(MEM_FOLD)
    zPrev = tempZ;
    if (zPrev.x > 1.0) zPrev.x = 2.0 - zPrev.x;
    if (zPrev.x < -1.0) zPrev.x = -2.0 - zPrev.x;
    if (zPrev.y > 1.0) zPrev.y = 2.0 - zPrev.y;
    if (zPrev.y < -1.0) zPrev.y = -2.0 - zPrev.y;
    #elif defined(MEM_SWIZZLE)
    zPrev = vec2(tempZ.y, tempZ.x);
    #else
    zPrev = tempZ;
    #endif

    if (diff < 0.0001) {
      converged = true;
      break;
    }
    iterations += 1.0;
  }

  if (iterations >= maxIterations - 1.0) return vec3(0.02);

  float colorScale = 50.0;
  float smoothIter = iterations - log2(log2(minDiff * 10000.0 + 1.0) + 1.0);
  return get_palette(smoothIter / colorScale);
}

void run_nova_engine() {
  vec2 uv =
    (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
  gl_FragColor = vec4(get_fractal_color(uv), 1.0);
}
