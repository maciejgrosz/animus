uniform float u_time;
uniform float u_frequency;
uniform float u_red;
uniform float u_green;
uniform float u_blue;
varying vec3 vNormal;

void main() {
    float pulse = sin(u_time + length(vNormal) * 10.0 + u_frequency * 0.1);
    vec3 color = vec3(u_red, u_green, u_blue) * (0.5 + 0.5 * pulse);
    gl_FragColor = vec4(color, 1.0);
}
