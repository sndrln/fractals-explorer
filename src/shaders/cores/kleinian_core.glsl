vec3 core_logic(vec2 uv) {
  // 1. SETUP
  vec2 coord = uv;

  vec2 seed = vec2(seedR, seedI);
  vec2 powerVec = vec2(power, powerI);
  vec2 memFactor = vec2(memoryR, memoryI);

  vec2 z = coord;
  vec2 zPrev = vec2(0.0);
  float orbit = 0.0;
  float min_dist = 1000.0;
  float escapeRadius = 100.0;

  // 2. INITIALIZE COLORING
  #if defined(COL_ORBIT_TRAP) || defined(COL_GRID) || defined(COL_STALKS)
  float colorAcc = 1000.0;
  #else
  float colorAcc = 0.0;
  #endif

  // 3. CORE LOOP
  for (float i = 0.0; i < 1000.0; i++) {
    if (i >= maxIterations) break;

    vec2 currentSeed = mix(coord, seed, juliaMorph);
    vec2 zOld = z;
    vec2 zNext = fractalStep(z, currentSeed, powerVec, zPrev);

    // Apply Memory
    if (i > 0.0) {
      zNext += complexMul(getMemoryTransform(zPrev), memFactor);
    }

    // State Update
    zPrev = zOld;
    z = zNext;

    // Coloring Injection
    apply_coloring(z, zPrev, osc, colorAcc);

    // Kleinian Specific Orbit Tracking
    min_dist = min(min_dist, length(z));

    // Break Condition
    if (length(z) > escapeRadius) break;
    orbit++;
  }

  // 4. FINAL COLORING
  float colorValue;
  #ifdef COL_DEFAULT
  colorValue = log(min_dist + 1.0) * 0.5 + orbit / maxIterations;
  #else
  colorValue = colorAcc / orbit;
  #endif

  return get_palette(fract(colorValue));
}
