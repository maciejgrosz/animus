// paintingReactive — painterly visual with bass/mid/treble reactivity
// bazant.jpg flows gently with the music

import {getSmoothedBass, getSmoothedMid, getSmoothedTreble} from "@core/audioRefs.js";

export function paintingReactive(getBass, getMid, getTreble) {
    s0.initImage("/assets/textures/bazant.jpg");

    const bass = () => getSmoothedBass();
    const mid = () => getSmoothedMid();
    const treble = () => getSmoothedTreble();

    src(s0)
        .scrollY(() => Math.sin(time * 0.1) * (0.01 + bass() * 0.02))         // bass lifts gently
        .modulate(noise(3, 0.1), () => 0.02 + mid() * 0.08)                   // mid = fluid distortion
        .scale(() => 1 + 0.03 * Math.sin(time * 0.4 + treble() * 5))          // treble pulse breathing
        .contrast(1.1 + bass() * 0.2)                                         // punch with bass
        .saturate(() => 1.2 + treble() * 0.4)                                 // high-end sparkle
        .out(o0);
}



// export function paintingReactive() {
//     s0.initImage("/assets/textures/bazant.jpg");
//
//     src(s0)
//         .scrollY(() => Math.sin(time * 0.1) * 0.01) // gentle float
//         .modulate(noise(3, 0.1), 0.04)              // subtle distortion
//         .scale(() => 1 + 0.05 * Math.sin(time * 0.4)) // breath-like pulse
//         // .colorama(() => 0.1 + 0.1 * Math.sin(time * 0.2)) // mild hue shift
//         // .contrast(1.1)
//         // .saturate(1.3)
//         .out(o0);
// }