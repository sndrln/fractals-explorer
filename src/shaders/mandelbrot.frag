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

    uniform float power;             // Real part of exponent
    uniform float powerImaginary;    // Imaginary part of exponent
    uniform float seedX;             // Julia Seed X
    uniform float seedY;             // Julia Seed Y
    uniform float juliaMorph;        // 0.0 = Mandelbrot, 1.0 = Julia
    uniform float memoryR;           // Real feedback (prev iteration)
    uniform float memoryI;           // Imaginary feedback (prev iteration)
    uniform float subtrahend;        // Constant offset shift

    uniform vec3 brightness;
    uniform vec3 contrast;
    uniform vec3 osc;
    uniform vec3 phase;

    vec3 get_palette(float t) {
        return brightness + contrast * cos(6.28318 * (osc * t + phase));
    }

    vec3 get_mandelbrot_color(vec2 uv) {
        vec2 coord = (uv * zoom) + vec2(offsetShiftX, offsetShiftY);
        vec2 seed = vec2(seedX, seedY);
        
        // Mandelbrot: z=0, c=pixel | Julia: z=pixel, c=seed
        vec2 z = mix(seed, coord, juliaMorph);
        vec2 c = mix(coord, seed, juliaMorph);
        
        vec2 p = vec2(power, powerImaginary);
        vec2 memFactor = vec2(memoryR, memoryI);
        vec2 zPrev = vec2(0.0);
        
        float iterations = 0.0;
        float escapeRadius = 100.0; // Increased for complex exponents
        
        for (float i = 0.0; i < 200.0; i++) {
            if (i >= maxIterations) break;

            vec2 zNext;
            
            // The Formula: z = (z^p) + c + (zPrev * memFactor) - subtrahend
            // This allows for standard Mandelbrot, Multibrot, and Nova-style feedback
            zNext = complexPower(z, p) + c - vec2(subtrahend, 0.0);
            
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
        float smoothIter = iterations - log(log(length(z)) / log(escapeRadius)) / log(pMag > 0.0 ? pMag : 2.0);
        
        float f = smoothIter / maxIterations;

        return get_palette(f);
    }

    void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);

        vec3 col = get_mandelbrot_color(uv);
        
        gl_FragColor = vec4(col, 1.0);
    }
