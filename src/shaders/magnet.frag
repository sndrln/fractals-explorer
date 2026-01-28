precision highp float;

#include "./shared/complex_math.glsl"
#include "./shared/palettes.glsl"

uniform vec2 resolution;
uniform float zoom;
uniform float offsetShiftX;
uniform float offsetShiftY;
uniform float maxIterations;
uniform float time;

uniform float power;
uniform float powerImaginary;
uniform float seedX;
uniform float seedY;
uniform float juliaMorph;
uniform float memoryR;
uniform float memoryI;
uniform float subtrahend;

uniform vec3 brightness;
uniform vec3 contrast;
uniform vec3 osc;
uniform vec3 phase;

vec3 get_palette(float t) {
  return brightness + contrast * cos(6.28318 * (osc * t + phase));
}

vec3 get_magnet_color(vec2 uv) {
  // Magnet usually looks best centered closer to the origin
  vec2 coord = uv * zoom + vec2(offsetShiftX, offsetShiftY);
  vec2 seed = vec2(seedX, seedY);

  vec2 z = mix(seed, coord, juliaMorph);
  vec2 c = mix(coord, seed, juliaMorph);

  vec2 p = vec2(power, powerImaginary);
  vec2 memFactor = vec2(memoryR, memoryI);
  vec2 zPrev = vec2(0.0);

  float iterations = 0.0;
  float escapeRadius = 100.0;

  for (float i = 0.0; i < 200.0; i++) {
    if (i >= maxIterations) break;

    // Magnet Type I logic:
    // Numerator: (z^p + c - 1)
    // Denominator: (p*z + c - 2)
    // We use 'subtrahend' to offset the poles (the -1 and -2)

    vec2 num = complexPower(z, p) + c - vec2(1.0 + subtrahend, 0.0);
    vec2 den = complexMul(p, z) + c - vec2(2.0 + subtrahend, 0.0);

    // Safety check for division by zero
    if (length(den) < 0.0001) den = vec2(0.0001, 0.0);

    vec2 zNext = complexPower(complexDivide(num, den), p);

    // Apply memory factor (delay effect)
    if (i > 0.0) {
      zNext += complexMul(zPrev, memFactor);
    }

    zPrev = z;
    z = zNext;

    if (length(z) > escapeRadius) break;
    iterations++;
  }

  if (iterations >= maxIterations - 1.0) return vec3(0.0);

  // Smoothing for Magnet is tricky because of the rational division,
  // but standard log-log usually works well enough.
  float pMag = length(p);
  float smoothIter =
    iterations - log(log(length(z)) / log(escapeRadius)) / log(max(pMag, 1.1));

  return get_palette(smoothIter / maxIterations);
}

void main() {
  vec2 uv =
    (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
  vec3 col = get_magnet_color(uv);
  gl_FragColor = vec4(col, 1.0);
}
