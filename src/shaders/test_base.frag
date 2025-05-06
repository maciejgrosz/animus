precision highp float;

uniform vec2 iResolution;
uniform float iTime;

// === Distance Functions ===

float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

float sdBox(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, max(d.y, d.z)), 0.0);
}

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

// 2D rotation matrix
mat2 rot2D(float a) {
    return mat2(cos(a),-sin(a), sin(a), cos(a));
}

// === Scene Mapping ===

vec3 map(vec3 p) {
    // 🔁 Repeat in XY
//    float spacing = 2.0 + smoothedBass * 0.5;
//    p.xy = mod(p.xy + spacing , spacing) - spacing / 2.;

    // 🔁 Repeat in Z for tunnel
//    float tunnelSpacing = 2.5;
//    p.z = mod(p.z + tunnelSpacing / 2.0 + 0.8, tunnelSpacing) - tunnelSpacing / 2.0;

    // 🌀 Spiral twist based on depth
//    float swirl = 0.2 + smoothedBass * 0.1;
//    p.xy *= rot2D(p.z * swirl);

    // === Shapes ===
    float d1 = sdSphere(p, 0.5);
    d1 = abs(d1) - 0.1;

    float xOffset = sin(iTime) * 1.0;
    vec3 cubePos = p - vec3(xOffset, 0.0, 0.0);
    float d2 = sdBox(cubePos, vec3(0.2));
    vec3 torusPos = p - vec3(0.0, xOffset, 0.0);
    float d3 = sdTorus(torusPos, vec2(0.4, 0.1));

    // Identify closest shape
    float id = 0.0;
    float rawDist = d1;
    if (d2 < rawDist) { rawDist = d2; id = 1.0; }
    if (d3 < rawDist) { rawDist = d3; id = 2.0; }

    float k = 0.4;
    float d12 = smin(d1, d2, k);
    float d = smin(d12, d3*2.1, k);
//    float d = max(d12, d3);

    return vec3(d, id, 0.0);
}

// === Raymarching ===

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;

    // 🎥 Flying camera slightly off-center
//    vec3 ro = vec3(0.4, 0.2, -2.5 + iTime * (1.0 + smoothedBass * 2.0));
    vec3 ro = vec3(0, 0, -2);
    vec3 rd = normalize(vec3(uv, 1.0));

    float t = 0.0;
    vec3 p;
    vec3 scene;
    const int maxSteps = 100;
    const float maxDist = 40.0;
    const float minDist = 0.002;

    int i;
    for (i = 0; i < maxSteps; i++) {
        p = ro + t * rd;

        // 💫 Spiral camera path
//        p.xy *= rot2D(t * 0.2 + sin(iTime * 0.5) * 0.5);
//        p.y += sin(t * 0.5 + iTime * 0.3) * 0.35;

        scene = map(p);
        if (scene.x < minDist || t > maxDist) break;
        t += scene.x ;
    }
//
    if (t > maxDist || scene.x > 1.0) {
        fragColor = vec4(0.0); // background
        return;
    }

    float glow = pow(float(i) / float(maxSteps), 2.0);

    // === Shape-based coloring
    vec3 colorSphere = vec3(1.0, 0.4, 0.4);
    vec3 colorCube   = vec3(0.4, 0.9, 1.0);
    vec3 colorTorus  = vec3(0.9, 0.9, 0.3);
    vec3 col;

    if (scene.y < 0.5) col = colorSphere;
    else if (scene.y < 1.5) col = colorCube;
    else col = colorTorus;

    // 🌀 Final twist in color space (chromatic swirl)
    float spiralTwist = sin(t * 0.5 + iTime) * 0.2;
    col.rg *= rot2D(spiralTwist);

    // ✨ Glow highlight with music reaction
    col = mix(col, vec3(1.0), glow );

    fragColor = vec4(col, 1.0);
}

// WebGL compatibility shim
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
