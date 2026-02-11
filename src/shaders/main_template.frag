precision highp float;

vec3 core_logic(vec2 uv);

vec3 get_sample(vec2 subPixelOffset) {
  vec2 p =
    (gl_FragCoord.xy + subPixelOffset - 0.5 * resolution.xy) /
    min(resolution.y, resolution.x);

  vec2 uv = p * zoom + vec2(offsetShiftX, offsetShiftY);

  return core_logic(uv);
}

void main() {
  #ifdef USE_SSAA
  vec3 color = vec3(0.0);
  color += get_sample(vec2(-0.125, -0.375));
  color += get_sample(vec2(0.375, -0.125));
  color += get_sample(vec2(-0.375, 0.125));
  color += get_sample(vec2(0.125, 0.375));
  gl_FragColor = vec4(color / 4.0, 1.0);
  #else
  gl_FragColor = vec4(get_sample(vec2(0.0)), 1.0);
  #endif
}
