uniform float u_time;
uniform float u_bass;

varying vec3 vNormal;

void main() {
    vNormal = normal;

    // Stronger, fluid-like deformation
    float wave = sin(u_time + position.y * 4.0) * (0.1 + u_bass * 1.5);

    vec3 newPosition = position + normal * wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
