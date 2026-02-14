precision highp float;
uniform float zModIntensity;
uniform int zModCondition;
uniform float cModIntensity;
uniform int cModCondition;
uniform float zPrevModIntensity;
uniform int zPrevModCondition;

float getConditionMask(vec2 z, int condId) {
  if (condId == 0) return 1.0; // ALWAYS
  if (condId == 1) return step(0.0, z.x); // Z_REAL_POSITIVE
  if (condId == 2) return step(0.0, z.y); // Z_IMAG_POSITIVE
  if (condId == 3) return step(1.0, length(z)); // Z_MAG_GT_1
  if (condId == 4) return step(0.0, atan(z.y, z.x)); // Z_ANGLE_POSITIVE
  if (condId == 5) return step(z.y, z.x); // Z_REAL_GT_IMAG
  if (condId == 6) return step(abs(z.y), abs(z.x)); // Z_ABS_REAL_GT_ABS_IMAG
  return 1.0;
}

// Modifiers ---
vec2 mod_abs_both(vec2 v) {
  return abs(v);
}
vec2 mod_abs_x(vec2 v) {
  return vec2(abs(v.x), v.y);
}
vec2 mod_abs_y(vec2 v) {
  return vec2(v.x, abs(v.y));
}

vec2 mod_fold(vec2 v, vec2 limit) {
  if (v.x > limit.x) v.x = 2.0 * limit.x - v.x;
  if (v.x < -limit.x) v.x = -2.0 * limit.x - v.x;
  if (v.y > limit.y) v.y = 2.0 * limit.y - v.y;
  if (v.y < -limit.y) v.y = -2.0 * limit.y - v.y;
  return v;
}

vec2 mod_swizzle(vec2 v) {
  return vec2(v.y, v.x);
}
vec2 mod_conjugate(vec2 v) {
  return vec2(v.x, -v.y);
}
vec2 mod_reverse(vec2 v) {
  return -v;
}
vec2 mod_invert(vec2 v) {
  return v / (dot(v, v) + 1e-6);
}
vec2 mod_reciprocal(vec2 v) {
  return complexDiv(v, complexPower(v, vec2(2.0, 0.0)) + 1e-6);
}

vec2 mod_polar(vec2 v) {
  return vec2(log(length(v) + 1e-6), atan(v.y, v.x));
}

vec2 mod_kaleidoscope(vec2 v, float count) {
  float a = atan(v.y, v.x);
  float r = length(v);
  float t = 3.14159265 / count;
  a = mod(a, t * 2.0) - t;
  a = abs(a);
  return vec2(cos(a), sin(a)) * r;
}

vec2 mod_sphere_inversion(vec2 v, float radius) {
  float d2 = dot(v, v);
  if (d2 < radius * radius) return v * (radius * radius) / (d2 + 1e-10);
  return v;
}

vec2 mod_tile(vec2 v) {
  return fract(v + 0.5) - 0.5;
}

vec2 mod_crease(vec2 v) {
  return vec2(min(v.x, v.y), max(v.x, v.y));
}

vec2 mod_sawtooth(vec2 v) {
  return v - floor(v + 0.5);
}

vec2 mod_wavefold(vec2 v) {
  return sin(v * 3.1415) * abs(v);
}

vec2 mod_shift_invert(vec2 v) {
  vec2 shift = vec2(0.5, 0.5);
  return complexDiv(vec2(1.0, 0.0), v - shift + 1e-8);
}

vec2 mod_voxelize(vec2 v) {
  return floor(v * 20.0) / 20.0;
}

vec2 mod_tan_warp(vec2 v) {
  return complexTan(v * 0.5) + mod_reciprocal(v);
}

vec2 mod_cross_fold(vec2 v) {
  vec2 a = abs(v);
  return vec2(a.y, a.x) - 0.5;
}

vec2 mod_spiral(vec2 v) {
  vec2 l = complexLog(v + 1e-9);
  return vec2(l.x - l.y, l.x + l.y);
}

vec2 mod_circle_pulse(vec2 v) {
  float r = length(v);
  return v * (1.0 + 0.1 / (abs(r - 1.0) + 0.01));
}

vec2 mod_glitch(vec2 v) {
  if (v.x + v.y > 0.0) return mod_swizzle(v);
  return mod_invert(v);
}
