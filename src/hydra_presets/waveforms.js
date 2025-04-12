export function waveforms(getBass, getMid, getTreble) {
    const bass = () => getBass?.() ?? 0;
    const mid = () => getMid?.() ?? 0;
    const treble = () => getTreble?.() ?? 0;

    // Bass waveform (bottom)
    const bassWave = osc(6, 0.1, 0)
        .modulate(noise(3), () => bass() * 0.5)
        .color(1, 0, 0)
        .scale(0.8)
        .scrollY(-0.3);

    // Mid waveform (middle)
    const midWave = osc(6, 0.1, 0)
        .modulate(noise(3), () => mid() * 0.5)
        .color(0, 1, 0)
        .scale(0.8)
        .scrollY(0);

    // Treble waveform (top)
    const trebleWave = osc(6, 0.1, 0)
        .modulate(noise(3), () => treble() * 0.5)
        .color(0, 0.5, 1)
        .scale(0.8)
        .scrollY(0.3);

    // Combine them
    src(o0)
        .blend(bassWave, 0.4)
        .blend(midWave, 0.4)
        .blend(trebleWave, 0.4)
        .out(o0);
}
