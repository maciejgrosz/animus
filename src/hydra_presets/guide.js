// src/hydra_presets/frequencyZones.js
export function guide(getBass, getMid, getTreble) {
    s0.initImage("/assets/textures/guide.jpg");

    const bass = () => getBass?.() ?? 0;
    const mid = () => getMid?.() ?? 0;
    const treble = () => getTreble?.() ?? 0;

    src(s0)
        .modulate(noise(() => 2 + bass() * 5), () => 0.05 + bass() * 0.2)
        .colorama(() => mid() * 0.8)
        .contrast(() => 1 + treble() * 0.5)
        .saturate(() => 1 + treble() * 0.8)
        .out(o0);
}
