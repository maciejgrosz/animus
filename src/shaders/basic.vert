uniform float u_time;
uniform float u_bass;

varying vec3 vPosition;

void main() {
    vPosition = position;

    float displacement = sin(u_time * 2.0 + position.y * 8.0 + position.x * 8.0) * u_bass * 1.0;

    vec3 newPosition = position + normal * displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
