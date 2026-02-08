#include "memory_modes"

vec3 get_fractal_color(vec2 uv) {
  // 1. SETUP
  vec2 coord = uv * zoom + vec2(offsetShiftX, offsetShiftY);
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

    vec2 zOld = z;
    vec2 zNext = fractalStep(z, c, powerVec, zPrev);
    // c = complexMul(c, getMemoryTransform(memFactor)) + zNext;

    // Apply Memory
    if (i > 0.0) {
      zNext += complexMul(getMemoryTransform(zPrev), memFactor);
    }

    // State Update
    zPrev = zOld;
    z = zNext;

    // Coloring Injection
    #include "coloring_modes.glsl"

    // Break Condition
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

void run_escape_engine() {
  vec2 uv =
    (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);

  #ifdef USE_SSAA
  // --- 4x Supersampling Mode ---
  // Take 4 samples in a grid pattern and average them
  vec3 color = vec3(0.0);

  // Calculate the size of half a pixel in UV space
  vec2 dUV = vec2(zoom) / min(resolution.y, resolution.x) * 0.25;

  // Sample 1: Top-Left
  color += get_fractal_color(uv + vec2(-dUV.x, -dUV.y));
  // Sample 2: Top-Right
  color += get_fractal_color(uv + vec2(dUV.x, -dUV.y));
  // Sample 3: Bottom-Left
  color += get_fractal_color(uv + vec2(-dUV.x, dUV.y));
  // Sample 4: Bottom-Right
  color += get_fractal_color(uv + vec2(dUV.x, dUV.y));

  gl_FragColor = vec4(color / 4.0, 1.0);
  #else
  // --- Standard Performance Mode ---
  // Just one sample per pixel
  gl_FragColor = vec4(get_fractal_color(uv), 1.0);
  #endif
}
