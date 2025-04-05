// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Zach Krall
// http://zachkrall.online/
export function zachKrall(getBass, getMid, getTreble) {
    const bass = () => getBass?.() ?? 0;
    const mid = () => getMid?.() ?? 0;
    const treble = () => getTreble?.() ?? 0;

    const base = osc(215, () => 0.1 + bass() * 0.3, () => 2 + bass())
        .modulate(osc(2, () => -0.3 + bass() * 0.2, 100).rotate(() => 15 + bass() * 10))
        .mult(osc(215, -0.1, () => 2 + bass() * 2).pixelate(50, 50))
        .color(() => 0.9 - bass() * 0.4, 0.0, () => 0.9 - treble() * 0.6);

    const layerMid = osc(6, () => -0.1 + mid() * 0.2).rotate(() => 9 + mid() * 10);

    const shapeOverlay = shape(900, 0.2, 1)
        .luma()
        .repeatX(2)
        .repeatY(2)
        .colorama(() => 0.5 + treble() * 5);

    const glitchTreble = osc(4, () => 1 + treble() * 4, 90)
        .color(0.2, 0, () => 1 - treble() * 0.5);

    base
        .modulate(layerMid)
        .add(
            osc(10, -0.9, 900)
                .color(1, 0, 1)
        )
        .mult(shapeOverlay)
        .modulate(osc(9, () => -0.3 + mid() * 0.4, 900).rotate(() => 6 + treble() * 8))
        .add(glitchTreble)
        .out();
}
