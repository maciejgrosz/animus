// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// Velvet Pool — by Mahalia H-R (IG: mm_hr_)

import {
    getSmoothedBass,
    getSmoothedMid,
    getSmoothedTreble,
} from "@core/audioRefs";

export function velvetPool() {
    const bass = () => getSmoothedBass();
    const mid = () => getSmoothedMid();
    const treble = () => getSmoothedTreble();

    noise()
        .color(() => treble() * 2, 0, 0.6)
        .modulate(noise(() => bass() * 10))
        .scale(() => treble() * 5)
        .layer(
            src(o0)
                .mask(osc(10).modulateRotate(osc(), 90, 0))
                .scale(() => bass() * 2)
                .luma(0.2, 0.3)
        )
        .blend(o0)
        .out(o0);

    osc()
        .modulate(noise(() => mid() + 5))
        .color(1, 0, 0)
        .out(o1);

    src(o0)
        .modulate(o1)
        .layer(
            src(o1)
                .mask(o1)
                .saturate(7)
        )
        .modulateRotate(o1)
        .rotate(() => time % 360 * 0.05)
        .out(o2);

    // render(o2);
}
