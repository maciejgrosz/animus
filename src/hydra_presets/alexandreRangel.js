// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// "eye of the beholder" — Alexandre Rangel
// www.alexandrerangel.art.br/hydra.html

export function alexandreRangel(getBass, getMid, getTreble) {
    const bass = () => getBass?.() ?? 0;
    const mid = () => getMid?.() ?? 0;
    const treble = () => getTreble?.() ?? 0;

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
