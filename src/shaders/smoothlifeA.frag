// smoothlifeA.frag
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uBass;
uniform float uMid;
uniform float uTreble;

#define PI 3.14159265
const float dt = 0.30;
const vec2 r = vec2(10.0, 3.0);

// SmoothLifeL rules
const float b1 = 0.257;
const float b2 = 0.336;
const float d1 = 0.365;
const float d2 = 0.549;
const float alpha_n = 0.028;
const float alpha_m = 0.147;

#define MOD3 vec3(.1031,.11369,.13787)
float hash13(vec3 p3) {
    p3 = fract(p3 * MOD3);
    p3 += dot(p3, p3.yzx+19.19);
    return fract((p3.x + p3.y)*p3.z);
}

float sigmoid_a(float x, float a, float b) {
    return 1.0 / (1.0 + exp(-(x - a) * 4.0 / b));
}
float sigmoid_b(float x, float b, float eb) {
    return 1.0 - sigmoid_a(x, b, eb);
}
float sigmoid_ab(float x, float a, float b, float ea, float eb) {
    return sigmoid_a(x, a, ea) * sigmoid_b(x, b, eb);
}
float sigmoid_mix(float x, float y, float m, float em) {
    return x * (1.0 - sigmoid_a(m, 0.5, em)) + y * sigmoid_a(m, 0.5, em);
}
float transition_function(vec2 disk_ring) {
    return sigmoid_mix(sigmoid_ab(disk_ring.x, b1, b2, alpha_n, alpha_n),
    sigmoid_ab(disk_ring.x, d1, d2, alpha_n, alpha_n), disk_ring.y, alpha_m);
}
float ramp_step(float steppos, float t) {
    return clamp(t-steppos+0.5, 0.0, 1.0);
}
vec2 wrap(vec2 position) { return fract(position); }

vec2 convolve(vec2 uv) {
    vec2 result = vec2(0.0);
    for (float dx = -r.x; dx <= r.x; dx++) {
        for (float dy = -r.x; dy <= r.x; dy++) {
            vec2 d = vec2(dx, dy);
            float dist = length(d);
            vec2 offset = d / uResolution;
            vec2 samplepos = wrap(uv + offset);
            float weight = texture2D(texture0, samplepos).x;
            result.x += weight * ramp_step(r.y, dist) * (1.0-ramp_step(r.x, dist));
            result.y += weight * (1.0-ramp_step(r.y, dist));
        }
    }
    return result;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec3 color = texture2D(texture0, uv).xyz;

    vec2 area = PI * r * r;
    area.x -= area.y;

    vec2 conv = convolve(uv.xy) / area;
    color.x = color.x + dt * (2.0 * transition_function(conv) - 1.0);
    color.yz = conv;
    color = clamp(color, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
}
