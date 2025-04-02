// src/hydra_presets/paintingReactive.js

export function paintingReactive() {
    s0.initImage("/assets/textures/bazant.jpg");

    src(s0)
        .scrollY(() => Math.sin(time * 0.1) * 0.01) // gentle float
        .modulate(noise(3, 0.1), 0.04)              // subtle distortion
        .scale(() => 1 + 0.05 * Math.sin(time * 0.4)) // breath-like pulse
        // .colorama(() => 0.1 + 0.1 * Math.sin(time * 0.2)) // mild hue shift
        // .contrast(1.1)
        // .saturate(1.3)
        .out(o0);
}
