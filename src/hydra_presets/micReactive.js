export function micReactive(getAmplitude) {
    osc(10, 0.1, 1)
        .modulate(noise(() => 3 + getAmplitude() * 10))
        .color(() => 1 - getAmplitude() * 2, 0.3, 1)
        .rotate(0, () => getAmplitude() * 0.2)
        .out(o0);
}