precision highp float;

// These will be resolved by the loader
#include "complex_math"

uniform vec2 resolution;
uniform float zoom;
uniform float offsetShiftX;
uniform float offsetShiftY;
uniform float maxIterations;
uniform float time;

// Fractal Parameters
uniform float subtrahend;
uniform float subtrahendI;
uniform float power;
uniform float powerI;
uniform float powerSecondary;
uniform float powerSecondaryI;
uniform float relaxation;
uniform float relaxationI;
uniform float seedR;
uniform float seedI;
uniform float juliaMorph;
uniform float memoryR;
uniform float memoryI;

// Palette Uniforms
uniform vec3 brightness;
uniform vec3 contrast;
uniform vec3 osc;
uniform vec3 phase;

vec3 get_palette(float t) {
  return brightness + contrast * cos(6.28318 * (osc * t + phase));
}
