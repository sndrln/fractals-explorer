vec2 getMemoryTransform(vec2 val) {
  vec2 result = val;

  #ifdef MEM_ABS_BOTH
  result = abs(val);
  #elif defined(MEM_ABS_X)
  result = vec2(abs(val.x), val.y);
  #elif defined(MEM_ABS_Y)
  result = vec2(val.x, abs(val.y));
  #elif defined(MEM_CONJUGATE)
  result = vec2(val.x, -val.y);
  #elif defined(MEM_REVERSE)
  result = -val;
  #elif defined(MEM_INVERT)
  result = val / (dot(val, val) + 1e-6);
  #elif defined(MEM_SIN)
  result = complexSin(val);
  #elif defined(MEM_COS)
  result = complexCos(val);
  #elif defined(MEM_TAN)
  result = complexTan(val);
  #elif defined(MEM_EXP)
  result = complexExp(val);
  #elif defined(MEM_RECIPROCAL)
  result = complexDiv(vec2(1.0, 0.0), val + 1e-6);
  #elif defined(MEM_POW3)
  result = complexPower(val, vec2(3.0, 0.0));
  #elif defined(MEM_FOLD)
  result = val;
  if (result.x > 1.0) result.x = 2.0 - result.x;
  if (result.x < -1.0) result.x = -2.0 - result.x;
  if (result.y > 1.0) result.y = 2.0 - result.y;
  if (result.y < -1.0) result.y = -2.0 - result.y;
  #elif defined(MEM_SWIZZLE)
  result = vec2(val.y, val.x);
  #endif

  return result;
}
