// modifiers.glsl

// --- Symmetry & Folds ---
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

// --- Geometric & Algebraic ---
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

// --- Non-Linear / Chaotic ---
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

// --- New "Abyss" Modifiers ---

// 1. The Crease: Symmetrizes space across the diagonal (Force-Symmetry)
vec2 mod_crease(vec2 v) {
  return vec2(min(v.x, v.y), max(v.x, v.y));
}

// 2. The Sawtooth: Creates infinite "Ghost" copies in a grid
vec2 mod_sawtooth(vec2 v) {
  return v - floor(v + 0.5);
}

// 3. The Wavefold: Mixing Sinusoidal and Absolute (Very "Organic/Muscle")
vec2 mod_wavefold(vec2 v) {
  return sin(v * 3.1415) * abs(v);
}

// 4. Shift-Reciprocal: Inverts space relative to a moving point
vec2 mod_shift_invert(vec2 v) {
  vec2 shift = vec2(0.5, 0.5); // "The Anchor"
  return complexDiv(vec2(1.0, 0.0), v - shift + 1e-8);
}

// 5. The Voxelize: Forces the fractal into a "Digital/Matrix" grid
vec2 mod_voxelize(vec2 v) {
  return floor(v * 20.0) / 20.0;
}

// 6. Tangent-Warp: The most "Explosive" trig function
vec2 mod_tan_warp(vec2 v) {
  return complexTan(v * 0.5) + mod_reciprocal(v);
}

// 7. Cross-Fold: Swizzles the axes *after* an absolute transform
vec2 mod_cross_fold(vec2 v) {
  vec2 a = abs(v);
  return vec2(a.y, a.x) - 0.5;
}

// 8. Log-Spiral: Converts linear motion into a spiraling feedback
vec2 mod_spiral(vec2 v) {
  vec2 l = complexLog(v + 1e-9);
  return vec2(l.x - l.y, l.x + l.y); // Rotation + Scale shift
}

// 9. Circle-Pulse: Pushes everything away from the Unit Circle
vec2 mod_circle_pulse(vec2 v) {
  float r = length(v);
  return v * (1.0 + 0.1 / (abs(r - 1.0) + 0.01));
}

// 10. The Glitch (Conditional Swap): Only transforms half the plane
vec2 mod_glitch(vec2 v) {
  if (v.x + v.y > 0.0) return mod_swizzle(v);
  return mod_invert(v);
}
