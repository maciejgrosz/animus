//// test.frag — Minimal scene with a single Box Frame and Color Palette + Rotation + Glow
//

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
    return sdOctahedron(p, .015); // distance to nearest octahedron
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


//precision highp float;
//
//uniform vec2 iResolution;
//uniform float iTime;
//
//// === Distance Functions ===
//float sdBoxFrame(vec3 p, vec3 b, float e) {
//    p = abs(p) - b;
//    vec3 q = abs(p + e) - e;
//    return min(min(
//    length(max(vec3(p.x, q.y, q.z), 0.0)) + min(max(p.x, max(q.y, q.z)), 0.0),
//    length(max(vec3(q.x, p.y, q.z), 0.0)) + min(max(q.x, max(p.y, q.z)), 0.0)),
//    length(max(vec3(q.x, q.y, p.z), 0.0)) + min(max(q.x, max(q.y, p.z)), 0.0));
//}
//
//float sdSphere(vec3 p, float r) {
//    return length(p) - r;
//}
//
//float smin(float a, float b, float k) {
//    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
//    return mix(b, a, h) - k * h * (1.0 - h);
//}
//
//mat2 rot2D(float a) {
//    return mat2(cos(a),-sin(a), sin(a), cos(a));
//}
//
//// === Color Palette ===
//vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
//    return a + b * cos(6.283185 * (c * t + d));
//}
//
//// === Scene Mapping ===
//vec3 map(vec3 p) {
//    float spacing = 2.0 + 0.5 * sin(iTime * 0.6);
//    p.xy = mod(p.xy + spacing , spacing) - spacing / 2.;
//
//    float tunnelSpacing = 2.5;
//    p.z = mod(p.z + tunnelSpacing / 2.0 + 0.8, tunnelSpacing) - tunnelSpacing / 2.0;
//
//    float swirl = 0.2;
//    p.xy *= rot2D(p.z * swirl);
//
//    float d1 = sdBoxFrame(p, vec3(0.5), 0.05);
//    float d2 = sdSphere(p - vec3(sin(iTime), 0.0, 0.0), 0.4);
//    float d3 = sdSphere(p + vec3(sin(iTime), 0.0, 0.0), 0.4);
//    float d4 = sdSphere(p + vec3(0.0, sin(iTime), 0.0), 0.3);
//    float d5 = sdSphere(p - vec3(0.0, sin(iTime), 0.0), 0.3);
//
//    float d = smin(d1, d2, 0.3);
//    d = smin(d, d3, 0.3);
//    d = smin(d, d4, 0.3);
//    d = smin(d, d5, 0.3);
//
//    return vec3(d, 0.0, 0.0);
//}
//
//// === Raymarching ===
//void mainImage(out vec4 fragColor, in vec2 fragCoord) {
//    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
//
//    // Rotation input based on time
//    vec2 m = vec2(cos(iTime * 0.2), sin(iTime * 0.2));
//    vec3 ro = vec3(0.4, 0.2, -2.5 + iTime);
//    vec3 rd = normalize(vec3(uv, 1.0));
//
//    float t = 0.0;
//    vec3 scene;
//    float glow = 0.0;
//    const int maxSteps = 100;
//    const float maxDist = 40.0;
//    const float minDist = 0.001;
//
//    int i;
//    for (i = 0; i < maxSteps; i++) {
//        vec3 pos = ro + t * rd;
//
//        // Rotate space along the ray path
//        pos.xy *= rot2D(t * 0.15 * m.x);
//        pos.y += sin(t * (m.y + 1.0) * 0.5) * 0.35;
//
//        scene = map(pos);
//        glow += 0.002 / (abs(scene.x) + 0.01); // Softer inverse glow
//        if (scene.x < minDist || t > maxDist) break;
//        t += scene.x;
//    }
//
//    vec3 col = vec3(0.0);
//    if (t < maxDist) {
//        vec3 pos = ro + t * rd;
//        vec2 e = vec2(1.0, -1.0) * 0.5773;
//        float eps = 0.0005;
//        vec3 nor = normalize(
//        e.xyy * map(pos + e.xyy * eps).x +
//        e.yyx * map(pos + e.yyx * eps).x +
//        e.yxy * map(pos + e.yxy * eps).x +
//        e.xxx * map(pos + e.xxx * eps).x
//        );
//
//        float diff = clamp(dot(nor, vec3(0.7, 0.6, 0.4)), 0.0, 1.0);
//        float amb = 0.5 + 0.5 * dot(nor, vec3(0.0, 0.8, 0.6));
//
//        vec3 a = vec3(0.5);
//        vec3 b = vec3(0.5);
//        vec3 c = vec3(1.0);
//        vec3 d = vec3(0.0, 0.33, 0.67);
//        vec3 pal = palette(iTime * 0.1, a, b, c, d);
//
//        col = pal * amb + palette(iTime * 0.1 + 0.33, a, b, c, d) * diff;
//        col += clamp(glow - abs(sin(iTime)), 0.0, 1.0) * vec3(1.0, 0.8, 0.6);
//    }
//
//    fragColor = vec4(sqrt(col), 1.0);
//}
//
//// WebGL compatibility shim
//void main() {
//    mainImage(gl_FragColor, gl_FragCoord.xy);
//}
