import { getSmoothedBass, getSmoothedMid, getSmoothedTreble } from "@core/audioRefs";

// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// "eye of the beholder" — Alexandre Rangel
// www.alexandrerangel.art.br/hydra.html

export function alexandreRangel() {
    const bass = () => getSmoothedBass();
    const mid = () => getSmoothedMid();
    const treble = () => getSmoothedTreble();

    noise(6, 0.05 + bass() * 0.02)
        .mult(
            osc(9, 0, () => Math.sin(time / (1.5 + mid())) + 2)
        )
        .mult(
            noise(9, 0.03 + treble() * 0.01)
                .brightness(() => 1.2 + treble() * 0.3)
                .contrast(() => 2 + mid() * 0.5)
                .mult(
                    osc(9, 0, () => Math.sin(time / 3 + bass()) + 13)
                )
        )
        .diff(
            noise(15, 0.04)
                .brightness(() => 0.2 + bass() * 0.4)
                .contrast(1.3)
                .mult(
                    osc(9, 0, () => Math.sin(time / (5 + mid())) + 13)
                )
                .rotate(() => time / 33)
        )
        .scale(() => Math.sin(time / 6.2) * 0.12 + 0.15 + bass() * 0.1)
        .modulateScale(
            osc(3, 0, 0).mult(osc(3, 0, 0).rotate(Math.PI / 2))
                .rotate(() => time / 25)
                .scale(0.39)
                .scale(1, 0.6, 1)
                .invert(),
            () => Math.sin(time / 5.3) * 1.5 + 3 + treble() * 2
        )
        .rotate(() => time / 22 + bass() * 0.1)
        .mult(
            shape(100, 0.9 + mid() * 0.1, 0.01 + treble() * 0.02)
                .scale(1, 0.6 + bass() * 0.1, 1)
        )
        .saturate(() => 1.2 + treble() * 1.5) // ✅ new: dynamic color boost
        .out();
}


// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// "eye of the beholder" — Alexandre Rangel
// www.alexandrerangel.art.br/hydra.html

export function alexandreRangelBright() {
    const bass = () => getSmoothedBass();
    const mid = () => getSmoothedMid();
    const treble = () => getSmoothedTreble();

    noise(6, 0.03 + bass() * 0.01) // 🎚️ slightly slower noise
        .mult(
            osc(6, 0, () => Math.sin(time / (2 + mid())) + 2) // 🧘 lower osc frequency
        )
        .mult(
            noise(7, 0.02 + treble() * 0.008) // 💨 less jittery motion
                .brightness(() => 1.2 + treble() * 0.3)
                .contrast(() => 1.8 + mid() * 0.4)
                .mult(
                    osc(7, 0, () => Math.sin(time / 3 + bass()) + 13)
                )
        )
        .diff(
            noise(10, 0.03)
                .brightness(() => 0.15 + bass() * 0.3)
                .contrast(1.2)
                .mult(
                    osc(8, 0, () => Math.sin(time / (5 + mid())) + 13)
                )
                .rotate(() => time / 40) // 🐢 slower background rotation
        )
        .scale(() => Math.sin(time / 8.2) * 0.1 + 0.2 + bass() * 0.08)
        .modulateScale(
            osc(2.5, 0, 0).mult(osc(2.5, 0, 0).rotate(Math.PI / 2))
                .rotate(() => time / 35)
                .scale(0.35)
                .scale(1, 0.6, 1)
                .invert(),
            () => Math.sin(time / 6.3) * 1.2 + 2.5 + treble() * 1.5
        )
        .rotate(() => time / 26 + bass() * 0.05)
        .mult(
            shape(100, 0.9 + mid() * 0.1, 0.01 + treble() * 0.02)
                .scale(1, 0.6 + bass() * 0.1, 1)
        )
        .saturate(() => 1.2 + treble() * 1.2)
        .colorama(() => 0.1 + treble() * 1.0) // 🎡 less intense swirl
        .hue(() => time * 0.01)               // 🌈 slower hue cycle
        .brightness(() => 0.1 + bass() * 0.25)
        .blend(solid(0, 0, 0), 0.05)
        .out();
}

