// rayMarching.frag
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uBass;
uniform float uMid;
uniform float uTreble;

uniform sampler2D texture0;

const vec3 CellColor = vec3(0.2, 0.2, 0.2);
const vec3 RingColor = vec3(0.0, 0.2, 0.2);
const vec3 DiskColor = vec3(0.0, 0.0, 0.0);

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec4 buffer = texture2D(texture0, uv);

vec3 color = buffer.x * CellColor + buffer.y * RingColor + buffer.z * DiskColor;

float c = 1.0 - buffer.z;
float c2 = 1. - texture2D(texture0, uv + 0.5/uResolution).y;
color += vec3(0.6, 0.85, 1.0) * max(c2*c2 - c*c, 0.0) * 4.0;

gl_FragColor = vec4(color, 1.0);
}
