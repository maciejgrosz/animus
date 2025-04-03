// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
//Flor de Fuego


export function florDeFuego(getBass, getMid, getTreble) {
    const bass = () => getBass?.() ?? 0;
    const mid = () => getMid?.() ?? 0;
    const treble = () => getTreble?.() ?? 0;

    shape(200, 0.5, 1.5)
        .scale(() => 0.5 + bass() * 0.4) // 🔊 bass pulse
        .color(() => 0.5 + mid() * 1.5, 0.3 + mid() * 0.5, 0) // 🎨 mid = richer flame
        .repeat(2, 2)
        .modulateScale(osc(() => 3 + treble() * 3, 0.5), () => -0.6 + bass() * 0.2) // ✨ sparkle + distortion
        .add(o0, 0.5)
        .scale(() => 0.9 + bass() * 0.05) // soft zooming
        .out();
}
