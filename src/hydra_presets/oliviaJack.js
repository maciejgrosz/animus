// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Olivia Jack
// https://ojack.github.io
import {getSmoothedBass, getSmoothedMid, getSmoothedTreble} from "@core/audioRefs.js";

export function oliviaJack() {
    const bass = () => getSmoothedBass();
    const mid = () => getSmoothedMid();
    const treble = () => getSmoothedTreble();

    osc(6 + bass() * 4, 0, 0.8) // 🥁 bass affects frequency
        .color(1.14 - mid() * 0.5, 0.6 + bass() * 0.2, 0.8 + treble() * 0.3) // 🎨 mid/tone-based tinting
        .rotate(0.92 + bass() * 0.2, 0.3)
        .pixelate(() => 20 + mid() * 40, () => 10 + bass() * 30) // 🎛️ resolution wiggle from mid/bass
        .mult(
            osc(40, 0.03 + treble() * 0.1)
                .thresh(0.4)
                .rotate(0, -0.02)
        )
        .modulateRotate(
            osc(20, 0).thresh(0.3, 0.6),
            () => treble() * 1 - 0.5 // now ranges from -0.5 to +0.5

        )
        .out(o0);
}


// src/hydra_presets/oliviaJack2.js

export function oliviaJack2() {
    const bass = () => getSmoothedBass();
    const mid = () => getSmoothedMid();
    const treble = () => getSmoothedTreble();

    osc(4, 0.1 + bass() * 0.3, 0.8)
        .color(
            () => 1.04 - bass() * 0.3,
            () => 0.1 + mid() * 0.5,
            () => -1.1 + treble() * 2
        )
        .rotate(() => 0.3 + treble() * 0.5, 0.1)
        .pixelate(
            () => 2 + bass() * 20,
            () => 20 + mid() * 80
        )
        .modulate(noise(2.5), () => 1.5 * Math.sin(0.08 * time + treble() * 4))
        .hue(() => time * 0.003 + treble() * 0.01)
        .add(src(o0).scale(1.01).brightness(-0.02), 0.2)
        .out(o0);
}
