vec2 applyZModifier(vec2 val) {
  #ifdef ZMOD_NONE
  return val;
  #elif defined(ZMOD_ABS_BOTH)
  return mod_abs_both(val);
  #elif defined(ZMOD_ABS_X)
  return mod_abs_x(val);
  #elif defined(ZMOD_ABS_Y)
  return mod_abs_y(val);
  #elif defined(ZMOD_CONJUGATE)
  return mod_conjugate(val);
  #elif defined(ZMOD_REVERSE)
  return mod_reverse(val);
  #elif defined(ZMOD_INVERT)
  return mod_invert(val);
  #elif defined(ZMOD_FOLD)
  return mod_fold(val, vec2(1.0));
  #elif defined(ZMOD_SWIZZLE)
  return mod_swizzle(val);
  #elif defined(ZMOD_SIN)
  return complexSin(val);
  #elif defined(ZMOD_COS)
  return complexCos(val);
  #elif defined(ZMOD_TAN)
  return complexTan(val);
  #elif defined(ZMOD_SINH)
  return complexSinh(val);
  #elif defined(ZMOD_COSH)
  return complexCosh(val);
  #elif defined(ZMOD_TANH)
  return complexTanh(val);
  #elif defined(ZMOD_EXP)
  return complexExp(val);
  #elif defined(ZMOD_LOG)
  return complexLog(val);
  #elif defined(ZMOD_SQRT)
  return complexSqrt(val);
  #elif defined(ZMOD_DIV_SQ)
  return mod_div_sq(val);
  #elif defined(ZMOD_POW3)
  return complexPower(val, vec2(3.0, 0.0));
  #elif defined(ZMOD_KALEIDOSCOPE)
  return mod_kaleidoscope(val, 3.0); // 3-way symmetry
  #elif defined(ZMOD_POLAR)
  return mod_polar(val);
  #elif defined(ZMOD_SPHERE_INVERSION)
  return mod_sphere_inversion(val, 1.0);
  #elif defined(ZMOD_TILE)
  return mod_tile(val);
  #elif defined(ZMOD_CREASE)
  return mod_crease(val);
  #elif defined(ZMOD_SAWTOOTH)
  return mod_sawtooth(val);
  #elif defined(ZMOD_WAVEFOLD)
  return mod_wavefold(val);
  #elif defined(ZMOD_SHIFT_INVERT)
  return mod_shift_invert(val);
  #elif defined(ZMOD_VOXELIZE)
  return mod_voxelize(val);
  #elif defined(ZMOD_TAN_WARP)
  return mod_tan_warp(val);
  #elif defined(ZMOD_CROSS_FOLD)
  return mod_cross_fold(val);
  #elif defined(ZMOD_SPIRAL)
  return mod_spiral(val);
  #elif defined(ZMOD_CIRCLE_PULSE)
  return mod_circle_pulse(val);
  #elif defined(ZMOD_GLITCH)
  return mod_glitch(val);
  #endif

  return val;
}
