vec2 fractalStep(vec2 z, vec2 c, vec2 p, vec2 zPrev) {
  // Box Fold
  if (kleinianBox > 0.0) {
    if (z.x > kleinianBox) z.x = 2.0 * kleinianBox - z.x;
    else if (z.x < -kleinianBox) z.x = -2.0 * kleinianBox - z.x;
    if (z.y > kleinianBox) z.y = 2.0 * kleinianBox - z.y;
    else if (z.y < -kleinianBox) z.y = -2.0 * kleinianBox - z.y;
  }

  // Sphere Fold
  float r2 = dot(z, z);
  float minRadius2 = kleinianSphere * kleinianSphere; // Usually a small offset
  float fixedRadius2 = relaxation * relaxation; // This is your Inversion Radius

  if (r2 < minRadius2) {
    z *= fixedRadius2 / minRadius2;
  } else if (r2 < fixedRadius2) {
    z *= fixedRadius2 / r2;
  }

  // Transformation & Translation
  vec2 genB = vec2(subtrahend, subtrahendI);
  return complexMul(z, p) + c + genB;
}
