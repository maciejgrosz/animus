uniform float u_red;
uniform float u_green;
uniform float u_blue;

void main() {
    vec3 color = vec3(u_red, u_green, u_blue);
    gl_FragColor = vec4(color, 1.0);
}
