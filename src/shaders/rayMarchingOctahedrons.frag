uniform vec2 iResolution;
uniform float iTime;
uniform float smoothedBass;
// 2D rotation function
mat2 rot2D(float a) {
        return mat2(cos(a), -sin(a), sin(a), cos(a));
}

// Custom gradient - https://iquilezles.org/articles/palettes/
vec3 palette(float t) {
    return .5 + .5 * cos(6.28318 * (t + vec3(.3, .416, .557)));
}

// Octahedron SDF - https://iquilezles.org/articles/distfunctions/
float sdOctahedron(vec3 p, float s) {
    p = abs(p);
    return (p.x + p.y + p.z - s) * 0.57735027;
}

float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

// Scene distance
float map(vec3 p) {
    p.z += iTime * 0.4;

    // Space repetition
    p.xy = fract(p.xy) - 0.4;
    p.z = mod(p.z, 0.25) - .125;

//    return sdOctahedron(p, .015); // distance to nearest octahedron
    return sdOctahedron(p, .15); // distance to nearest octahedron
//    return sdTorus(p, vec2(0.2, 0.05));
//    return sdSphere(p, 0.15); // 0.15 is the sphere radius — adjust if needed

}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;

    // Use default circular motion (no mouse)
    vec2 m = vec2(cos(iTime * .2), sin(iTime * .2));

    // Raymarching setup
    vec3 ro = vec3(0, 0, -3);
    vec3 rd = normalize(vec3(uv, 1));
    vec3 col = vec3(0.0);

    float t = 0.0;
    int i;
    for (i = 0; i < 80; i++) {
        vec3 p = ro + rd * t;

        p.xy *= rot2D(t * .15 * m.x);
        p.y += sin(t * (m.y + 1.0) * .5) * .35;

        float d = map(p);
        t += d;
        if (d < .001 || t > 100.0) break;
    }

//    col = palette(t * .04 + float(i) * .005);
    col = palette(t * 0.04 + float(i) * 0.005 + smoothedBass * 0.5);
    fragColor = vec4(col, 1.0);
}

// Required by WebGL (mainImage compatibility shim)
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
