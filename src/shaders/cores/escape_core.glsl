vec3 core_logic(vec2 uv) {
  // 1. SETUP
  vec2 coord = uv;
  vec2 seed = vec2(seedR, seedI);

  vec2 z = mix(seed, coord, juliaMorph);
  vec2 c = mix(coord, seed, juliaMorph);
  vec2 powerVec = vec2(power, powerI);
  vec2 memFactor = vec2(memoryR, memoryI);

  vec2 zPrev = vec2(0.0);
  float iterations = 0.0;
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
    vec2 zTemp = z;

    // --- Z MODIFIER ---
    #ifndef ZMOD_NONE
    z = mix(
      z,
      APPLY_ZMOD(z),
      zModIntensity * getConditionMask(z, zModCondition)
    );
    #endif

    z = fractalStep(z, c, powerVec, zPrev);

    if (i > 0.0) {
      // --- MEMORY MODIFIER ---
      #ifndef MEM_NONE
      vec2 memVal = mix(
        zPrev,
        APPLY_MEM(zPrev),
        zPrevModIntensity * getConditionMask(z, zPrevModCondition)
      );
      z += complexMul(memVal, memFactor);
      #else
      z += complexMul(zPrev, memFactor);
      #endif
    }

    // --- C MODIFIER ---
    #ifndef CMOD_NONE
    c = mix(
      c,
      APPLY_CMOD(c),
      cModIntensity * getConditionMask(z, cModCondition)
    );
    #endif

    zPrev = zTemp;

    // Coloring
    apply_coloring(z, zPrev, osc, colorAcc);
    if (length(z) > escapeRadius) break;
    iterations++;
  }

  // 4. FINAL COLORING
  if (iterations >= maxIterations - 1.0) return vec3(0.0);

  float smoothIter =
    iterations -
    log(log(length(z)) / log(escapeRadius)) / log(max(length(powerVec), 1.1));
  float colorValue;

  #if defined(COL_ORBIT_TRAP) || defined(COL_STALKS) || defined(COL_GRID)
  colorValue = fract(exp(-colorAcc * 2.0) + smoothIter * 0.1);
  #elif defined(COL_CURVATURE) ||                                                \
    defined(COL_DELTA) ||                                                      \
    defined(COL_EXP) ||                                                        \
    defined(COL_BINARY)
  colorValue = colorAcc / iterations;
  #elif defined(COL_STRIPES)
  colorValue = fract(colorAcc * 0.1);
  #else
  colorValue = smoothIter / maxIterations;
  #endif

  return get_palette(colorValue);
}
