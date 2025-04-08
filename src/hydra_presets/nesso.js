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
