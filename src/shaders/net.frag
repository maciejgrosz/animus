uniform float u_red;
uniform float u_green;
uniform float u_blue;
uniform float u_mid;
uniform float u_treble;

varying vec3 vPosition;

void main() {
    // Color shift based on frequency bands
    vec3 baseColor = vec3(u_red, u_green, u_blue);
    vec3 colorMod = vec3(
    0.3 + u_treble * 0.7,
    0.3 + u_mid * 0.7,
    0.4 + sin(vPosition.y * 10.0 + u_treble * 5.0) * 0.1
    );

    vec3 finalColor = baseColor * colorMod;

    gl_FragColor = vec4(finalColor, 1.0);
}
