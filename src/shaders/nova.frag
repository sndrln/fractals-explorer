precision highp float;

#include "./shared/complex_math.glsl"
#include "./shared/palettes.glsl"

uniform vec2 resolution;
uniform float zoom;
uniform float relaxation;
uniform float power;
uniform float powerI;
uniform float powerSecondary;
uniform float powerSecondaryI;
uniform float maxIterations;
uniform float subtrahend;
uniform float offsetShiftX;
uniform float offsetShiftY;
uniform float seedX;
uniform float seedY;
uniform float juliaMorph;
uniform float time;
uniform float memoryR;
uniform float memoryI;

uniform vec3 brightness;
uniform vec3 contrast;
uniform vec3 osc;
uniform vec3 phase;

vec3 get_palette(float t) {
  return brightness + contrast * cos(6.28318 * (osc * t + phase));
}

vec3 get_nova_color(vec2 uv) {
  vec2 coord = uv * zoom + vec2(offsetShiftX, offsetShiftY);
  vec2 seed = vec2(seedX, seedY);
  vec2 zStart = mix(seed, coord, juliaMorph);

  vec2 cConstant = mix(coord, seed, juliaMorph);

  vec2 currentZ = zStart;
  vec2 previousZ = zStart;
  vec2 constantOffset = cConstant;

  float iterations = 0.0;
  float minDiff = 1000.0;

  for (float i = 0.0; i < 200.0; i++) {
    vec2 tempZ = currentZ;
    vec2 previousZ = currentZ;

    if (i >= maxIterations) break;
    vec2 functionValue =
      complexPower(currentZ, vec2(power, powerI)) - vec2(subtrahend, 0.0);
    vec2 derivativeValue = complexPower(
      currentZ,
      vec2(powerSecondary, powerSecondaryI)
    );
    vec2 newtonStep = complexDivide(functionValue, derivativeValue);

    vec2 memoryEffect = complexMul(vec2(memoryR, memoryI), previousZ);
    currentZ =
      currentZ - relaxation * newtonStep + constantOffset + memoryEffect;

    previousZ = tempZ;

    currentZ = currentZ - relaxation * newtonStep + constantOffset;

    float diff = length(currentZ - previousZ);
    minDiff = min(minDiff, diff);

    if (diff < 0.0001) break;
    iterations++;
  }

  if (iterations >= maxIterations - 1.0) return vec3(0.02);

  float colorScale = 50.0;
  float smoothIter = iterations - log2(log2(minDiff * 10000.0 + 1.0) + 1.0);

  float f = smoothIter / colorScale;

  vec3 col = get_palette(f);

  return col;
}

void main() {
  vec2 uv =
    (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);

  vec3 finalCol = get_nova_color(uv);

  gl_FragColor = vec4(finalCol, 1.0);
}
