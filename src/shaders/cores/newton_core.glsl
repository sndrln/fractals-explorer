#include "memory_modes"

vec3 get_newton_color(vec2 uv) {
  // 1. SETUP
  vec2 coord = uv * zoom + vec2(offsetShiftX, offsetShiftY);
  vec2 seed = vec2(seedR, seedI);

  vec2 z = mix(coord, seed, juliaMorph);
  vec2 powerVec = vec2(power, powerI);
  vec2 subtrahendVec = vec2(subtrahend, subtrahendI);
  vec2 relaxationVec = vec2(relaxation, relaxationI);
  vec2 memFactor = vec2(memoryR, memoryI);

  vec2 zPrev = z;
  float iterations = 0.0;
  float tolerance = 0.0001;
  float minDiff = 1000.0;

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
    vec2 displacement = fractalStep(z, subtrahendVec, powerVec, zPrev);

    // Newton Update Rule: zNext = z + (relaxation * displacement) + memory
    vec2 relaxationStep = complexMul(relaxationVec, displacement);
    vec2 inertia = complexMul(z - zPrev, memFactor);
    vec2 zNext = z + relaxationStep + inertia;

    // State Update
    float diff = length(zNext - z);
    minDiff = min(minDiff, diff);
    zPrev = getMemoryTransform(zOld);
    z = zNext;

    // Coloring Injection
    #include "coloring_modes.glsl"

    // Break Condition
    if (diff < tolerance) break;
    iterations++;
  }

  // 4. FINAL COLORING
  if (iterations >= maxIterations - 1.0) return vec3(0.02);

  float angle = atan(z.y, z.x) / 6.2831;
  float colorValue;

  #ifdef COL_DEFAULT
  float smoothIter = iterations - log2(log2(minDiff * 10000.0 + 1.1));
  colorValue = smoothIter / 20.0 + angle;
  #else
  colorValue = colorAcc / iterations + angle;
  #endif

  return get_palette(colorValue);
}

void run_newton_core() {
  vec2 uv =
    (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
  gl_FragColor = vec4(get_newton_color(uv), 1.0);
}
