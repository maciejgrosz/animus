import {
    getSmoothedBass,
    getSmoothedMid,
    getSmoothedTreble,
} from "@core/audioRefs";

export function khoparzi() {
    const bass = () => getSmoothedBass();
    const mid = () => getSmoothedMid();
    const treble = () => getSmoothedTreble();

    gradient(0.25 + treble() * 0.1) // 🌈 subtle hue shift on highs
        .add(noise(3 + bass() * 2, 0.2), () => 0.05 + Math.cos(time) * 0.2 + bass() * 0.1) // 🥁 bass texture
        .modulateRotate(
            src(o0).rotate(0, -0.52 + mid() * 0.1),
            () => 0.15 + mid() * 0.15
        )
        .mult(shape(360, 0.3 + bass() * 0.2, 0.01), 0.8) // 🔊 shape scale on bass
        .repeat(
            () => 8 + bass() * 4,
            () => 4 + mid() * 3
        )
        .mult(
            shape(360).scale(() => 0.8 + Math.sin(time * 0.5) * 0.1 + treble() * 0.2),
            0.8
        )
        .rotate(0, () => 0.2 + treble() * 0.1)
        .diff(
            src(o0)
                .rotate(0, -0.2 + bass() * 0.05)
                .scale(() => 1 + mid() * 0.05),
            0.2
        )
        .brightness(() => -0.2 + bass() * 0.3)
        .saturate(() => 1 + treble() * 1.2)
        .out();
}

export function khoparziAquatic() {
    const bass = () => getSmoothedBass();
    const mid = () => getSmoothedMid();
    const treble = () => getSmoothedTreble();

    gradient(0.2 + treble() * 0.1)
        .add(
            noise(2 + bass() * 1.5, 0.2)
                .scale(() => 1 + bass() * 0.05)
                .color(0.3 + bass() * 0.5, 0.5 + mid() * 0.3, 1)
        )
        .modulateRotate(
            osc(2, 0.02, 0.3)
                .rotate(() => time * 0.03)
                .scale(() => 1 + mid() * 0.2),
            () => 0.1 + mid() * 0.1
        )
        .mult(
            shape(6, 0.2 + treble() * 0.2, 0.01)
                .scale(() => 1 + bass() * 0.3)
                .repeat(3 + bass() * 2, 2 + treble())
        )
        .modulate(noise(3, 0.5), () => bass() * 0.2)
        .rotate(() => 0.1 + Math.sin(time * 0.2) * 0.05)
        .diff(
            src(o0)
                .scale(() => 1.01 + bass() * 0.01)
                .scrollY(() => Math.sin(time * 0.15) * 0.01 + treble() * 0.01),
            0.2
        )
        .saturate(() => 1 + treble() * 0.8)
        .brightness(-0.2)
        .contrast(1.1)
        .out();
}