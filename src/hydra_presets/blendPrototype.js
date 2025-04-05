// src/hydra_presets/blendPrototype.js

export function blendPrototype(getBass) {
    const bass = () => getBass?.() ?? 0;

    // Preset A
    const a = osc(10, 0.1, 1)
        .color(1, 0.2, 0.4)
        .rotate(0.1)
        .modulate(noise(2), 0.2);

    // Preset B
    const b = voronoi(3, 0.1)
        .color(0.2, 0.5, 1)
        .modulate(osc(3), 0.1)
        .contrast(1.2);

    // Blend them based on bass
    a.blend(b, () => Math.min(1, bass() * 1.5)).out(o0);
}
