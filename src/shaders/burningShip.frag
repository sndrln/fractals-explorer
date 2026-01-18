precision highp float;

#include "./shared/complex_math.glsl"
#include "./shared/palettes.glsl"

// Uniforms
uniform vec2 resolution;
uniform float zoom;
uniform float offsetShiftX;
uniform float offsetShiftY;
uniform float maxIterations;

// Knobs
uniform float power; 
uniform float powerImaginary;
uniform float seedX;
uniform float seedY;
uniform float juliaMorph;
uniform float memoryR;
uniform float memoryI;
uniform float subtrahend;

// Palette
uniform vec3 brightness;
uniform vec3 contrast;
uniform vec3 osc;
uniform vec3 phase;

vec3 get_palette(float t) {
    return brightness + contrast * cos(6.28318 * (osc * t + phase));
}

vec3 get_burning_ship_color(vec2 uv) {
    vec2 coord = (uv * zoom) + vec2(offsetShiftX, offsetShiftY);
    vec2 seed = vec2(seedX, seedY);
    
    // Mandelbrot vs Julia init
    vec2 z = mix(seed, coord, juliaMorph);
    vec2 c = mix(coord, seed, juliaMorph);
    
    vec2 p = vec2(power, powerImaginary);
    vec2 memFactor = vec2(memoryR, memoryI);
    vec2 zPrev = vec2(0.0);
    
    float iterations = 0.0;
    float escapeRadius = 100.0;

    for (float i = 0.0; i < 1000.0; i++) {
        if (i >= maxIterations) break;

        // THE BURNING SHIP MAGIC:
        // Take absolute values of both components
        z = vec2(abs(z.x), abs(z.y));

        vec2 zNext = complexPower(z, p) + c - vec2(subtrahend, 0.0);
        
        if (i > 0.0) {
            zNext += complexMul(zPrev, memFactor);
        }

        zPrev = z;
        z = zNext;

        if (length(z) > escapeRadius) break;
        iterations++;
    }

    if (iterations >= maxIterations - 1.0) return vec3(0.0);

    float pMag = length(p);
    float smoothIter = iterations - log(log(length(z)) / log(escapeRadius)) / log(max(pMag, 1.1));
    return get_palette(smoothIter / maxIterations);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
    // Flip Y for Burning Ship because it is usually rendered "upside down"
    uv.y = -uv.y; 
    gl_FragColor = vec4(get_burning_ship_color(uv), 1.0);
}
