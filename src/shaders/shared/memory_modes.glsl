vec2 applyMemoryModifier(vec2 val) {
  #ifdef MEM_NONE
  return val;
  #elif defined(MEM_ABS_BOTH)
  return mod_abs_both(val);
  #elif defined(MEM_ABS_X)
  return mod_abs_x(val);
  #elif defined(MEM_ABS_Y)
  return mod_abs_y(val);
  #elif defined(MEM_CONJUGATE)
  return mod_conjugate(val);
  #elif defined(MEM_REVERSE)
  return mod_reverse(val);
  #elif defined(MEM_INVERT)
  return mod_invert(val);
  #elif defined(MEM_FOLD)
  return mod_fold(val, vec2(1.0));
  #elif defined(MEM_SWIZZLE)
  return mod_swizzle(val);
  #elif defined(MEM_SIN)
  return complexSin(val);
  #elif defined(MEM_COS)
  return complexCos(val);
  #elif defined(MEM_TAN)
  return complexTan(val);
  #elif defined(MEM_SINH)
  return complexSinh(val);
  #elif defined(MEM_COSH)
  return complexCosh(val);
  #elif defined(MEM_TANH)
  return complexTanh(val);
  #elif defined(MEM_EXP)
  return complexExp(val);
  #elif defined(MEM_LOG)
  return complexLog(val);
  #elif defined(MEM_SQRT)
  return complexSqrt(val);
  #elif defined(MEM_DIV_SQ)
  return mod_div_sq(val);
  #elif defined(MEM_POW3)
  return complexPower(val, vec2(3.0, 0.0));
  #elif defined(MEM_KALEIDOSCOPE)
  return mod_kaleidoscope(val, 3.0); // 3-way symmetry
  #elif defined(MEM_POLAR)
  return mod_polar(val);
  #elif defined(MEM_SPHERE_INVERSION)
  return mod_sphere_inversion(val, 1.0);
  #elif defined(MEM_TILE)
  return mod_tile(val);
  #elif defined(MEM_CREASE)
  return mod_crease(val);
  #elif defined(MEM_SAWTOOTH)
  return mod_sawtooth(val);
  #elif defined(MEM_WAVEFOLD)
  return mod_wavefold(val);
  #elif defined(MEM_SHIFT_INVERT)
  return mod_shift_invert(val);
  #elif defined(MEM_VOXELIZE)
  return mod_voxelize(val);
  #elif defined(MEM_TAN_WARP)
  return mod_tan_warp(val);
  #elif defined(MEM_CROSS_FOLD)
  return mod_cross_fold(val);
  #elif defined(MEM_SPIRAL)
  return mod_spiral(val);
  #elif defined(MEM_CIRCLE_PULSE)
  return mod_circle_pulse(val);
  #elif defined(MEM_GLITCH)
  return mod_glitch(val);
  #endif

  return val;
}
