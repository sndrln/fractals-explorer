#include "memory_modes"

vec3 get_newton_color(vec2 uv) {
  vec2 coord = uv * zoom + vec2(offsetShiftX, offsetShiftY);
  vec2 seed = vec2(seedR, seedI);

  vec2 z = mix(coord, seed, juliaMorph);
  vec2 p = vec2(power, powerI);

  vec2 memFactor = vec2(memoryR, memoryI);
  vec2 zPrev = z;

  float iterations = 0.0;
  float maxI = maxIterations;
  float minDiff = 1000.0;
  float tolerance = 0.0001;

  for (float i = 0.0; i < 1000.0; i++) {
    if (i >= maxI) break;

    vec2 oldZ = z;

    // 1. Calculate the standard Newton Step
    // We pass 'subtrahend' into the step (e.g., z^p - subtrahend = 0)
    vec2 step = fractalStep(z, vec2(subtrahend, subtrahendI), p, zPrev);

    // 2. Apply Relaxation + Step + Memory
    // relaxation.x acts as the complex 'a' multiplier for the Newton step
    vec2 relaxedStep = complexMul(vec2(relaxation, relaxationI), step);
    vec2 inertia = complexMul(z - zPrev, memFactor);

    // In Nova/Newton, adding the seed (c) here creates the "Nova" variety
    vec2 zNext = z + relaxedStep + inertia;

    // 3. Update history and track convergence
    float diff = length(zNext - z);
    minDiff = min(minDiff, diff);

    zPrev = getMemoryTransform(oldZ);

    z = zNext;

    if (diff < tolerance) break;
    iterations++;
  }

  // Background color if it never converged
  if (iterations >= maxI - 1.0) return vec3(0.02);

  // --- IMPROVED NOVA-STYLE COLORING ---
  // 1. Smooth the iteration count using the closeness to the root
  float smoothIter = iterations - log2(log2(minDiff * 10000.0 + 1.1));

  // 2. Determine the "Basin" (which root did we land in?)
  float angle = atan(z.y, z.x) / 6.2831;

  // 3. Combine for the palette index
  // Dividing smoothIter by a 'colorScale' (e.g. 20.0) spreads the gradient
  float colorScale = 20.0;
  float t = smoothIter / colorScale + angle;

  return get_palette(t);
}

void run_newton_engine() {
  vec2 uv =
    (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
  gl_FragColor = vec4(get_newton_color(uv), 1.0);
}
