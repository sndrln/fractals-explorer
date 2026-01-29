precision highp float;

#include "./shared/complex_math.glsl"
#include "./shared/palettes.glsl"

uniform vec2 resolution;
uniform float zoom;
uniform float offsetShiftX;
uniform float offsetShiftY;

// Newton Core Params
uniform float power;
uniform float powerI;
uniform float dampingR;
uniform float dampingI;

// Iteration & Feedback
uniform float maxIterations;
uniform float memoryR;
uniform float memoryI;

// Morphing
uniform float seedX;
uniform float seedY;
uniform float juliaMorph;

// Palette Uniforms
uniform vec3 brightness;
uniform vec3 contrast;
uniform vec3 osc;
uniform vec3 phase;

vec3 get_palette(float t) {
  return brightness + contrast * cos(6.28318 * (osc * t + phase));
}

vec3 get_newton_color(vec2 uv) {
  vec2 coord = uv * zoom + vec2(offsetShiftX, offsetShiftY);
  vec2 seed = vec2(seedX, seedY);

  vec2 currentZ = mix(seed, coord, juliaMorph);
  vec2 c = mix(coord, seed, juliaMorph);

  vec2 p = vec2(power, powerI);
  vec2 d = vec2(dampingR, dampingI);
  vec2 mem = vec2(memoryR, memoryI);

  vec2 pMinusOne = p - vec2(1.0, 0.0);
  vec2 previousZ = currentZ;

  float iterations = 0.0;
  const float eps = 1e-9;

  for (float i = 0.0; i < 250.0; i++) {
    if (i >= maxIterations) break;

    vec2 oldZ = currentZ;

    // Newton Step Calculation: f(z)/f'(z)
    // f(z) = z^p + c
    vec2 fz = complexPower(currentZ, p) + c;

    // f'(z) = p * z^(p-1)
    vec2 fPrimeZ = complexMul(p, complexPower(currentZ, pMinusOne));

    // Standard Newton Step
    vec2 step = complexDivide(fz, fPrimeZ + vec2(eps));

    // Apply Damping and Update
    currentZ -= complexMul(d, step);

    // Memory ---
    if (i > 0.0) {
      currentZ += complexMul(mem, oldZ - previousZ);
    }

    // Convergence Check
    float diffSq = dot(currentZ - oldZ, currentZ - oldZ);
    if (diffSq < 0.000001) break;

    previousZ = oldZ;
    iterations++;
  }

  // Coloring logic
  if (iterations >= maxIterations - 1.0) {
    return vec3(0.0); // Didn't find a root
  } else {
    // Root Angle (which basin did we land in?)
    float angle = atan(currentZ.y, currentZ.x) / 6.28318 + 0.5;

    // Iteration density
    float f = iterations / maxIterations;

    // Combine Angle + Iterations for a "structured" look
    return get_palette(f + angle);
  }
}

void main() {
  vec2 uv =
    (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
  vec3 col = get_newton_color(uv);
  gl_FragColor = vec4(col, 1.0);
}
