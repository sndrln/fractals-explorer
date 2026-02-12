vec2 applyCModifier(vec2 val) {
  #ifdef CMOD_NONE
  return val;
  #elif defined(CMOD_ABS_BOTH)
  return mod_abs_both(val);
  #elif defined(CMOD_ABS_X)
  return mod_abs_x(val);
  #elif defined(CMOD_ABS_Y)
  return mod_abs_y(val);
  #elif defined(CMOD_CONJUGATE)
  return mod_conjugate(val);
  #elif defined(CMOD_REVERSE)
  return mod_reverse(val);
  #elif defined(CMOD_INVERT)
  return mod_invert(val);
  #elif defined(CMOD_FOLD)
  return mod_fold(val, vec2(1.0));
  #elif defined(CMOD_SWIZZLE)
  return mod_swizzle(val);
  #elif defined(CMOD_SIN)
  return complexSin(val);
  #elif defined(CMOD_COS)
  return complexCos(val);
  #elif defined(CMOD_TAN)
  return complexTan(val);
  #elif defined(CMOD_SINH)
  return complexSinh(val);
  #elif defined(CMOD_COSH)
  return complexCosh(val);
  #elif defined(CMOD_TANH)
  return complexTanh(val);
  #elif defined(CMOD_EXP)
  return complexExp(val);
  #elif defined(CMOD_LOG)
  return complexLog(val);
  #elif defined(CMOD_SQRT)
  return complexSqrt(val);
  #elif defined(CMOD_DIV_SQ)
  return mod_div_sq(val);
  #elif defined(CMOD_POW3)
  return complexPower(val, vec2(3.0, 0.0));
  #elif defined(CMOD_KALEIDOSCOPE)
  return mod_kaleidoscope(val, 3.0); // 3-way symmetry
  #elif defined(CMOD_POLAR)
  return mod_polar(val);
  #elif defined(CMOD_SPHERE_INVERSION)
  return mod_sphere_inversion(val, 1.0);
  #elif defined(CMOD_TILE)
  return mod_tile(val);
  #elif defined(CMOD_CREASE)
  return mod_crease(val);
  #elif defined(CMOD_SAWTOOTH)
  return mod_sawtooth(val);
  #elif defined(CMOD_WAVEFOLD)
  return mod_wavefold(val);
  #elif defined(CMOD_SHIFT_INVERT)
  return mod_shift_invert(val);
  #elif defined(CMOD_VOXELIZE)
  return mod_voxelize(val);
  #elif defined(CMOD_TAN_WARP)
  return mod_tan_warp(val);
  #elif defined(CMOD_CROSS_FOLD)
  return mod_cross_fold(val);
  #elif defined(CMOD_SPIRAL)
  return mod_spiral(val);
  #elif defined(CMOD_CIRCLE_PULSE)
  return mod_circle_pulse(val);
  #elif defined(CMOD_GLITCH)
  return mod_glitch(val);
  #endif

  return val;
}
