export function micReactive(getAmplitude) {
    const amp = () => Math.min(1, Math.max(0, getAmplitude())); // safely clamped

    osc(10, 0.1, 1)
        .modulate(noise(() => 3 + amp() * 10))
        .color(() => 1 - amp() * 2, () => 0.3 + amp() * 0.5, 1) // hue + green shift
        .colorama(() => amp() * 2) // rainbow swirl based on volume
        .out(o0);
}
