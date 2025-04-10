import {getSmoothedBass, getSmoothedMid, getSmoothedTreble} from "@core/audioRefs.js";

export function AFALFL() {
    const bass = () => getSmoothedBass();
    const mid = () => getSmoothedMid();
    const treble = () => getSmoothedTreble();

    // Base warped waveform portal
    const portal = osc(100, -0.0015, 0.2)
        .diff(
            osc(20, 0.00006).rotate(Math.PI / 0.00003)
        )
        .modulateScale(
            noise(1.5, 0.15)
                .modulateScale(osc(13).rotate(() => Math.sin(time / 22))),
            () => 2 + bass() * 1.5
        )
        .color(
            () => 0.8 + bass() * 0.3,
            () => 0.2 + mid() * 0.4,
            () => 0.3 + treble() * 0.3
        )
        .contrast(() => 1.2 + bass() * 0.3)
        .brightness(0.03)
        .modulateScale(osc(2), () => -0.1 - treble() * 0.2)
        .rotate(() => 0.1 + treble() * 0.05)
        .posterize(50)
        .invert(0)
        .blend(o0, 0.85); // dreamy trail blend

    // Optional soft grain overlay
    const grain = noise(3, 0.3)
        .color(0.1, 0.1, 0.1)
        .brightness(0.02)
        .scale(1.3)
        .rotate(() => time * 0.005);

    portal
        .blend(grain, 0.15)
        .out(o0);

}

