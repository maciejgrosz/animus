precision highp float;

uniform vec2 iResolution;
uniform float iTime;

vec2 stanh(vec2 a) {
    return tanh(clamp(a, -40.0, 40.0));
}

vec3 palette(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.3, 0.416, 0.557)));
}

// Your zap logic, adapted to 2D coordinates (u) and depth (t)
float zapGlow(vec2 u, float t) {
    vec2 v = iResolution.xy;
    vec4 o = vec4(1.0, 2.0, 3.0, 0.0);
    vec4 sum = vec4(0.0);
    t += sin(dot(u, vec2(13.1, 7.3)) + iTime * 2.0) * 0.1;
    for (float a = 0.5, i = 0.0;
    ++i < 15.0;
    sum += (1.0 + cos(o + t))
    / length((1.0 + i * dot(v, v))
    * sin(1.5 * u / (0.5 - dot(u, u)) - 9.0 * u.yx + t))
    ) {
        v = cos(++t - 7.0 * u * pow(a += 0.03, i)) - 5.0 * u;

        u += tanh(40.0 * dot(
        u *= mat2(cos(i + 0.02 * t - vec4(0.0, 11.0, 33.0, 0.0))),
        u
        ) * cos(100.0 * u.yx + t)) / 200.0
        + 0.2 * a * u
        + cos(4.0 / exp(dot(sum, sum) / 100.0) + t) / 300.0;
    }

    vec3 glow = 25.6 / (min(sum.rgb, vec3(13.0)) + 164.0 / sum.rgb);
    glow -= dot(u, u) / 250.0;

    return clamp(length(glow), 0.0, 1.0);
//    return pow(clamp(length(glow), 0.0, 1.0), 0.5);
}

void mainImage(out vec4 fragColor, vec2 fragCoord) {
    vec2 uv = (fragCoord - iResolution * 0.5) / iResolution.y;

    vec3 ro = vec3(0.0, 0.0, -2.0);
    vec3 rd = normalize(vec3(uv, 1.0));
    float t = 0.0;

    vec3 color = vec3(0.0);

    for (int i = 0; i < 13; i++) {
        vec3 p = ro + t * rd;

        // Convert XY to radial coordinates (cylinder)
        float angle = atan(p.y, p.x);
        float radius = length(p.xy);
//        radius *= 1.0 + 0.3 * sin(p.z * 4.0 + iTime * 1.5);
        vec2 zapCoord = vec2(cos(angle), sin(angle)) * radius;

        // Evaluate glow at this depth
//        float g = zapGlow(zapCoord, p.z + iTime * 0.5);
        float g1 = zapGlow(zapCoord, p.z + iTime * 0.5);
        float g2 = zapGlow(zapCoord * 1.8, p.z * 1.5 + iTime ); // faster, tighter

        float g = mix(g1, g2, 0.1); // blend layers
        // Boost intensity and clamp
        vec3 col = palette(radius + iTime * 0.05) * g;
        color += col * 0.1;

        t += 0.13;
    }

    fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}




//uniform vec3 iResolution;
//uniform float iTime;
//
//vec2 stanh(vec2 a) {
//    return tanh(clamp(a, -40.0, 40.0));
//}
//
//// Same color palette as ShaderToy
//vec3 palette(float t) {
//    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.15, 0.25)));
//}
//
//void mainImage(out vec4 fragColor, vec2 fragCoord) {
//    vec2 v = iResolution.xy;
//    vec2 u = 0.2 * (fragCoord + fragCoord - v) / v.y;
//
//    vec4 z = vec4(1.0, 2.0, 3.0, 0.0);
//    vec4 o = vec4(0.0);
//
//    for (float a = 0.5, t = iTime, i = 0.0;
//    ++i < 19.0;
//    o += (1.0 + cos(z + t))
//    / length((1.0 + i * dot(v, v))
//    * sin(1.5 * u / (0.5 - dot(u, u)) - 9.0 * u.yx + t))
//    ) {
//        v = cos(++t - 7.0 * u * pow(a += 0.03, i)) - 5.0 * u;
//
//        u += tanh(40.0 * dot(
//        u *= mat2(cos(i + 0.02 * t - vec4(0.0, 11.0, 33.0, 0.0))),
//        u
//        ) * cos(100.0 * u.yx + t)) / 200.0
//        + 0.2 * a * u
//        + cos(4.0 / exp(dot(o, o) / 100.0) + t) / 300.0;
//    }
//
//    // Compute glow
//    vec3 glow = 25.6 / (min(o.rgb, vec3(13.0)) + 164.0 / o.rgb);
//    glow -= dot(u, u) / 250.0;
//
//    // Add color palette
//    vec3 color = palette(length(u)) * glow;
//
//    // Boost intensity to make it clearly visible
//    color = clamp(color * 1.2, 0.0, 1.0);
//
//    fragColor = vec4(color, 1.0);
//}
//
//void main() {
//    mainImage(gl_FragColor, gl_FragCoord.xy);
//}
