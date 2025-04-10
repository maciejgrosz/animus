// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// clouds of passage — by Nesso | www.nesso.xyz

import {getSmoothedBass, getSmoothedMid, getSmoothedTreble} from "@core/audioRefs.js";

export function nesso() {

    const bass = () => getSmoothedBass() ;
    const mid = () => getSmoothedMid();
    const treble = () => getSmoothedTreble()* 0.1;

    shape([4, 5, 6].fast(0.1).smooth(1), 0.000001 + bass() * 0.01, [0.2 + mid() * 0.2, 0.7].smooth(1))
        .color(0.2 + treble() * 0.2, 0.4, 0.3 + mid() * 0.2)
        .scrollX(() => Math.sin(time * (0.27 + bass() * 0.2)))
        .add(
            shape([4, 5, 6].fast(0.1).smooth(1), 0.000001 + treble() * 0.01, [0.2, 0.7, 0.5, 0.3].smooth(1))
                .color(0.6, 0.2 + treble() * 0.3, 0.5)
                .scrollY(0.35 + bass() * 0.05)
                .scrollX(() => Math.sin(time * (0.33 + mid() * 0.1)))
        )
        .add(
            shape([4, 5, 6].fast(0.1).smooth(1), 0.000001 + mid() * 0.01, [0.2, 0.7, 0.3].smooth(1))
                .color(0.2, 0.4 + treble() * 0.2, 0.6)
                .scrollY(-0.35 - bass() * 0.05)
                .scrollX(() => Math.sin(time * (0.41 + treble() * 0.2)) * -1)
        )
        .add(
            src(o0)
                .shift(0.001, 0.01, 0.001)
                .scrollX([0.05 + bass() * 0.05, -0.05 - bass() * 0.05].fast(0.1).smooth(1))
                .scale(
                    [1.05 + bass() * 0.1, 0.9].fast(0.3).smooth(1),
                    [1.05, 0.9 + mid() * 0.2, 1].fast(0.29).smooth(1)
                ),
            0.85
        )
        .modulate(voronoi(10 + mid() * 5, 2 + treble() * 1.5, 2))
        .out();
}

export function nessoRandom() {
    const bass = () => getSmoothedBass();
    const mid = () => getSmoothedMid();
    const treble = () => getSmoothedTreble();

    // 🔁 Always fetch fresh params
    const {
        baseScroll = 0.25,
        shapeSize = 0.007,
        colorShift = 0.2,
        modulationAmount = 0.4,
        scrollMultiplier = 1,
        rotationSpeed = 0.02,
        zoomShift = 0,
        mirror = 1,
    } = window._presetParams || {};

    shape([4, 5, 6].fast(0.1).smooth(1), shapeSize + bass() * 0.01, [0.2 + mid() * 0.2, 0.7].smooth(1))
        .color(0.2 + treble() * colorShift, 0.4, 0.3 + mid() * 0.2)
        .scrollX(() => mirror * Math.sin(time * (baseScroll + bass() * scrollMultiplier)))
        .add(
            shape([4, 5, 6].fast(0.1).smooth(1), 0.000001 + treble() * 0.01, [0.2, 0.7, 0.5, 0.3].smooth(1))
                .color(0.6, 0.2 + treble() * 0.3, 0.5)
                .scrollY(0.35 + bass() * 0.05)
                .scrollX(() => Math.sin(time * (0.33 + mid() * 0.1)))
        )
        .add(
            shape([4, 5, 6].fast(0.1).smooth(1), 0.000001 + mid() * 0.01, [0.2, 0.7, 0.3].smooth(1))
                .color(0.2, 0.4 + treble() * 0.2, 0.6)
                .scrollY(-0.35 - bass() * 0.05)
                .scrollX(() => Math.sin(time * (0.41 + treble() * 0.2)) * -1)
        )
        .add(
            src(o0)
                .shift(0.001, 0.01, 0.001)
                .scrollX([0.05 + bass() * 0.05, -0.05 - bass() * 0.05].fast(0.1).smooth(1))
                .scale(
                    [1.05 + bass() * 0.1 + zoomShift, 0.9].fast(0.3).smooth(1),
                    [1.05, 0.9 + mid() * 0.2 + zoomShift, 1].fast(0.29).smooth(1)
                ),
            0.85
        )
        .modulate(voronoi(10 + mid() * 5, 2 + treble() * 1.5, 2), modulationAmount)
        .rotate(() => time * rotationSpeed)
        .out();
}

window.__RERUN_PRESET = () => {
    try {
        nessoRandom(); // Reapply current preset
        console.log("🔁 Re-applied nessoRandom()");
    } catch (e) {
        console.warn("❌ Failed to re-run preset:", e);
    }
};

window.__RANDOMIZE = () => {
    window._presetParams = {
        baseScroll: 0.1 + Math.random() * 0.5,
        scrollMultiplier: 0.2 + Math.random() * 1.0,
        shapeSize: 0.002 + Math.random() * 0.015,
        colorShift: 0.1 + Math.random() * 0.6,
        modulationAmount: 0.1 + Math.random() * 1.2,
        rotationSpeed: 0.01 + Math.random() * 0.07,
        zoomShift: Math.random() * 0.4,
        mirror: Math.random() < 0.5 ? 1 : -1,
    };

    console.log("🎲 Randomized Nesso params:", window._presetParams);

    if (window.__RERUN_PRESET) window.__RERUN_PRESET();
};
