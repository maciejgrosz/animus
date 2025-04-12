import { getSmoothedBass, getSmoothedMid, getSmoothedTreble } from "@core/audioRefs.js";

export function ameba() {
    const bass = () => getSmoothedBass();
    const mid = () => getSmoothedMid();
    const treble = () => getSmoothedTreble();

    osc(6 + bass() * 6, 0.005 + mid() * 0.01, 0.05 + treble() * 0.1)
        .mult(
            osc(0.5 + bass(), -0.03)
                .modulate(
                    osc(1 + mid()).rotate(2 + treble(), 0.5),
                    5 + bass() * 10 // ⬅️ Reduced modulation strength
                )
        )
        .color(
            0.3 + bass() * 0.3,
            0.7 + mid() * 1.5,
            1.5 + treble() * 3
        )
        .saturate(() => 0.4 + treble() * 0.8)
        .luma(() => 0.5 + bass() * 0.2, 0.1)
        .scale(() => 0.4 + bass() * 0.1, () => 0.4 + mid() * 0.1) // ⬅️ Smaller size
        .diff(o0)
        .out(o0);
}
