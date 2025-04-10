uniform float u_red;
uniform float u_green;
uniform float u_blue;
uniform float u_mid;
uniform float u_treble;

void main() {
    vec3 baseColor = vec3(u_red, u_green, u_blue);

    // ✨ Modulate color slightly with mid and treble
    float highlight = 0.3 * u_mid + 0.7 * u_treble;

    vec3 color = baseColor + highlight;

    gl_FragColor = vec4(color, 1.0);
}
