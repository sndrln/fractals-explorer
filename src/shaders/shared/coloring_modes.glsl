void apply_coloring(vec2 z, vec2 zPrev, vec3 osc, inout float colorAcc) {
  // 1. Orbit Trap
  #ifdef COL_ORBIT_TRAP
  float d = length(z - osc.xy);
  colorAcc = min(colorAcc, d);
  #endif

  // 2. Pickover Stalks
  #ifdef COL_STALKS
  float dX = abs(z.x - osc.x);
  float dY = abs(z.y - osc.y);
  colorAcc = min(colorAcc, min(dX, dY));
  #endif

  // 3. Curvature Flow
  #ifdef COL_CURVATURE
  // We approximate the direction change
  vec2 v1 = normalize(z - zPrev);
  colorAcc += length(z - zPrev); // simplified for stability
  #endif

  // 4. Zebra Stripes
  #ifdef COL_STRIPES
  colorAcc += sin(20.0 * atan(z.y, z.x) + 10.0 * log(length(z) + 1.0));
  #endif

  // 5. Digital Grid
  #ifdef COL_GRID
  vec2 grid = abs(fract(z * 2.0 + 0.5) - 0.5);
  colorAcc = min(colorAcc, min(grid.x, grid.y));
  #endif

  // 6. Delta
  #ifdef COL_DELTA
  colorAcc += length(z - zPrev) / (length(z) + 0.1);
  #endif

  // 7. Binary Decomposition
  #ifdef COL_BINARY
  if (z.x * z.y > 0.0) colorAcc += 1.0;
  #endif

  // 8. Exponential Smoothing
  #ifdef COL_EXP
  colorAcc += exp(-length(z));
  #endif
}
