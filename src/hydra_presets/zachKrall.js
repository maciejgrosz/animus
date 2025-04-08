// zachKrall.js — adjusted for soft background, dynamic circle, and audio-reactive pulse
// Based on original by Zach Krall — https://zachkrall.online/
// Licensed CC BY-NC-SA 4.0

export function zachKrall(getBass, getMid, getTreble) {
    const bass = () => getBass?.() ?? 0;
    const mid = () => getMid?.() ?? 0;
    const treble = () => getTreble?.() ?? 0;

    // 🎨 Background: subtle pinkish-purple gradient
    const background = osc(215, 0.05, 2)
        .color(0.9, 0.0, 0.9)
        .brightness(() => 0.02 + treble() * 0.05)
        .contrast(() => 1 + bass() * 0.3);

    // 🔮 Central dynamic shape
    const circle = shape(900, () => 0.2 + bass() * 0.05, 1)
        .luma()
        .repeatX(2)
        .repeatY(2)
        .colorama(() => 3 + treble() * 2)
        .rotate(() => 0.05 + mid() * 0.1)
        .scale(() => 1 + bass() * 0.1);

    // 💥 Reactive pulse inside the shape
    const pulse = osc(() => 4 + bass() * 6, () => 1 + mid(), 90)
        .color(0.2, 0, 1)
        .modulate(noise(3), () => bass() * 0.1)
        .luma(0.4);

    // 🌀 Gentle modulation
    const modLayer = osc(9, -0.3, 900)
        .rotate(() => 6 + treble() * 2)
        .scale(() => 1 + mid() * 0.05);

    // 🧩 Composite
    background
        .add(pulse, 0.4)
        .mult(circle)
        .modulate(modLayer, 0.1)
        .out();
}
