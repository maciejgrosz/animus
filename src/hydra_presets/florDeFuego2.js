// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// Flor de Fuego 2 - Audio Reactive Version
// Original: https://flordefuego.github.io/
// Modified for audio reactivity

import { getSmoothedBass, getSmoothedMid, getSmoothedTreble } from "@core/audioRefs.js";

export function florDeFuego2() {
    const bass = () => getSmoothedBass();
    const mid = () => getSmoothedMid();
    const treble = () => getSmoothedTreble();

    osc(30 + bass() * 10, 0.01 + treble() * 1.05, 1)
        .mult(
            osc(30 + mid() * 150, -0.2 - bass() * 0.8, 1)
                .modulate(noise(3 + treble() * 2, 1))
                .rotate(0.7 + mid() * 4.3)
        )
        .posterize([3, 10, 2].fast(0.5 + bass() * 0.3).smooth(1))
        .modulateRotate(o0, () => bass() * 0.5 + treble() * 2 )
        .out();
}
