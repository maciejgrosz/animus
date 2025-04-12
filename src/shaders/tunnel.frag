#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_bass;
uniform float u_mid;
uniform float u_treble;

void main() {
  vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float r = length(uv);
  float angle = atan(uv.y, uv.x);

  // Tunnel spiral motion
  float tunnel = sin(8.0 * r - u_time * 1.5 - u_bass * 4.0);
  float spiral = sin(angle * 6.0 + u_time * 1.2 + r * 8.0);

  float wave = 0.5 + 0.5 * sin(u_time + r * 10.0 + u_mid * 5.0);
  float edge = smoothstep(0.01, 0.03, abs(tunnel * wave + spiral * 0.2));

  // Flickering highlights on treble
  float flicker = sin(u_time * 40.0 + r * 20.0 + u_treble * 50.0);
  float stars = smoothstep(0.95, 1.0, flicker);

  vec3 baseColor = vec3(
  0.2 + u_bass * 0.4,
  0.3 + u_mid * 0.5,
  0.5 + u_treble * 0.3
  );

  vec3 finalColor = mix(baseColor * edge, vec3(1.0), stars * 0.2);

  gl_FragColor = vec4(finalColor, 1.0);
}
