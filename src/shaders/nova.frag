precision highp float;

#include "./shared/complex_math.glsl"
#include "./shared/palettes.glsl"

uniform vec2 resolution;
uniform float zoom;
uniform float relaxation;
uniform float powerMain;
uniform float powerMainImaginary;
uniform float powerDerivative;
uniform float powerDerivativeImaginary;
uniform float maxIterations;
uniform float subtrahend;
uniform float offsetShiftX;
uniform float offsetShiftY;
uniform float seedX;
uniform float seedY;
uniform float juliaMorph;
uniform float time;
uniform vec2 memory;

uniform vec3 brightness;
uniform vec3 contrast;
uniform vec3 osc;
uniform vec3 phase;

vec3 get_palette(float t) {
    return brightness + contrast * cos(6.28318 * (osc * t + phase));
}

vec3 get_nova_color(vec2 uv) {
    vec2 coord = (uv * zoom) + vec2(offsetShiftX, offsetShiftY);
    vec2 seed = vec2(seedX, seedY);
    vec2 zStart = mix(seed, coord, juliaMorph);
    
    vec2 cConstant = mix(coord, seed, juliaMorph);

    vec2 currentZ = zStart;
    vec2 previousZ = zStart;
    vec2 constantOffset = cConstant;

    float iterations = 0.0;
    float minDiff = 1000.0;

    for (float i = 0.0; i < 200.0; i++) {
        vec2 tempZ = currentZ;
        vec2 previousZ = currentZ;

        if (i >= maxIterations) break;
        vec2 functionValue = complexPower(currentZ, vec2(powerMain, powerMainImaginary)) - vec2(subtrahend, 0.0); 
        vec2 derivativeValue = complexPower(currentZ, vec2(powerDerivative, powerDerivativeImaginary));
        vec2 newtonStep = complexDivide(functionValue, derivativeValue);

        vec2 memoryEffect = complexMul(memory, previousZ);
        currentZ = currentZ - (relaxation * newtonStep) + constantOffset + memoryEffect;

        previousZ = tempZ;

        currentZ = currentZ - (relaxation * newtonStep) + constantOffset;

        float diff = length(currentZ - previousZ);
        minDiff = min(minDiff, diff);

        if (diff < 0.0001) break;
        iterations++;
    }

    if (iterations >= maxIterations - 1.0) return vec3(0.02);

    float colorScale = 50.0; 
    float smoothIter = iterations - log2(log2(minDiff * 10000.0 + 1.0) + 1.0);
    
    float f = smoothIter / colorScale;

    vec3 col = get_palette(f);
    
    return col;
}

// void main() {
//     vec3 finalCol = vec3(0.0);
    
//     for (int m = 0; m < 2; m++) {
//         for (int n = 0; n < 2; n++) {
//             vec2 offset = vec2(float(m), float(n)) / 2.0 - 0.5;
//             vec2 uv = (gl_FragCoord.xy + offset - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
            
//             finalCol += get_nova_color(uv);
//         }
//     }
    
//     gl_FragColor = vec4(finalCol / 4.0, 1.0);
// }

void main() {
    // 1. Calculate the normalized UV for the current pixel (no offset)
    // We subtract 0.5 * resolution to center the fractal
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
    
    // 2. Call the core function just once
    vec3 finalCol = get_nova_color(uv);
    
    // 3. Output the result
    gl_FragColor = vec4(finalCol, 1.0);
}
