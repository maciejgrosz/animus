// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
//corrupted screensaver
//by Ritchse
//instagram.com/ritchse
//
import {getSmoothedBass, getSmoothedMid, getSmoothedTreble} from "@core/audioRefs.js";

export function ritchse() {
    const bass = () => getSmoothedBass();
    const mid = () => getSmoothedMid();
    const treble = () => getSmoothedTreble() *0.1;

    voronoi(() => 350 + bass() * 300, 0.15)
        .modulateScale(osc(() => 8 + mid() * 2).rotate(() => Math.sin(time + treble() * 2)), () => 0.5 + bass() * 0.2)
        .thresh(0.8)
        .modulateRotate(osc(7), () => 0.4 + mid() * 0.2)
        .thresh(0.7)
        .diff(src(o0).scale(() => 1.8 - bass() * 0.2))
        .modulateScale(osc(2).modulateRotate(o0, 0.74))
        .diff(
            src(o0)
                .rotate([-.012, .01, -.002, 0])
                .scrollY(0, [-1 / 199800, 0].fast(0.7))
        )
        .brightness(() => [-.02, -.17].smooth().fast(.5)[0] + treble() * 0.3)
        .out();
}
