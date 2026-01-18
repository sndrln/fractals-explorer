precision highp float;

#include "./shared/complex_math.glsl"
#include "./shared/palettes.glsl"

// Common Uniforms
uniform vec2 resolution;
uniform float zoom;
uniform float offsetShiftX;
uniform float offsetShiftY;
uniform float maxIterations;
uniform float time;

// Mandelbrot/Julia Specific
uniform float power; 
uniform float seedX;
uniform float seedY;
uniform float juliaMorph; // 0.0 = Mandelbrot, 1.0 = Julia

// Palette Uniforms
uniform vec3 brightness;
uniform vec3 contrast;
uniform vec3 osc;
uniform vec3 phase;

vec3 get_palette(float t) {
    return brightness + contrast * cos(6.28318 * (osc * t + phase));
}

vec3 get_mandelbrot_color(vec2 uv) {
    // 1. Coordinate Setup
    vec2 coord = (uv * zoom) + vec2(offsetShiftX, offsetShiftY);
    vec2 seed = vec2(seedX, seedY);
    
    // 2. Julia Morph Logic
    // If juliaMorph is 0, z starts at 0 and c is the pixel coordinate (Mandelbrot)
    // If juliaMorph is 1, z starts at the pixel coordinate and c is the seed (Julia)
    vec2 z = mix(vec2(0.0), coord, juliaMorph);
    vec2 c = mix(coord, seed, juliaMorph);

    float iterations = 0.0;
    float escapeRadius = 4.0; // Standard for Mandelbrot
    
    // 3. The Escape Time Loop
    for (float i = 0.0; i < 500.0; i++) {
        if (i >= maxIterations) break;

        // z = z^power + c
        // We use complexPower from our shared math
        z = complexPower(z, vec2(power, 0.0)) + c;

        if (length(z) > escapeRadius) break;
        iterations++;
    }

    // 4. Coloring
    if (iterations >= maxIterations - 1.0) return vec3(0.0); // Inside the set

    // Simple smooth coloring (renormalization)
    float smoothIter = iterations - log2(log2(length(z))) + 4.0;
    float f = smoothIter / maxIterations;

    return get_palette(f);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
    
    vec3 col = get_mandelbrot_color(uv);
    
    gl_FragColor = vec4(col, 1.0);
}
