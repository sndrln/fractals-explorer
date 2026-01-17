vec2 complexDivide(vec2 a, vec2 b) {
    float denominator = dot(b, b);
    return vec2(dot(a, b), a.y * b.x - a.x * b.y) / (denominator + 0.00001);
}

vec2 complexPower(vec2 z, vec2 exponent) {
    float r = length(z);
    float lnR = log(r + 1e-9); 
    float theta = atan(z.y, z.x);
    
    float newRadius = exp(exponent.x * lnR - exponent.y * theta);
    float newAngle = exponent.x * theta + exponent.y * lnR;
    
    return newRadius * vec2(cos(newAngle), sin(newAngle));
}

vec2 complexMul(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}
