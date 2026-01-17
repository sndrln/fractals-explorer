// shared/palettes.glsl
vec3 lerp_palette(float t, vec3 c1, vec3 c2, vec3 c3, vec3 c4) {
    // t is 0.0 to 1.0
    if (t < 0.33) return mix(c1, c2, t / 0.33);
    if (t < 0.66) return mix(c2, c3, (t - 0.33) / 0.33);
    return mix(c3, c4, (t - 0.66) / 0.34);
}
