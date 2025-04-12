import {
    getSmoothedBass,
    getSmoothedMid,
    getSmoothedTreble,
} from "@core/audioRefs";

export function florDeFuego() {
    const bass = () => getSmoothedBass();
    const mid = () => getSmoothedMid();
    const treble = () => getSmoothedTreble();

    shape(
        () => 3 + Math.floor(mid() * 6),   // 🔺 shape morphs: triangle → hexagon
        () => 0.15 + bass() * 0.05,        // 🌀 radius pulses with bass
        () => 1.5 + treble() * 1           // ✨ smooth edges
    )
        .scale(() => 0.2 + bass() * 0.1) // 📏 much smaller scale
        .color(
            () => 0.6 + mid() * 0.4,       // 🌈 morphs to warm hues
            () => 0.2 + treble() * 0.6,
            () => 0.1 + Math.sin(time * 0.5 + treble() * 2) * 0.3
        )
        .repeat(3.5, 3.5) // 🟣 tight grid of smaller dots
        .modulateScale(
            osc(() => 2 + treble() * 2, 0.2),
            () => -0.2 + bass() * 0.1
        )
        .rotate(() => time * 0.02 + mid() * 0.1) // 🌀 gentle spiral drift
        .add(o0, 0.35)
        .scale(() => 0.8 + bass() * 0.03)
        .saturate(() => 1.2 + treble() * 0.6)
        .out();
}

