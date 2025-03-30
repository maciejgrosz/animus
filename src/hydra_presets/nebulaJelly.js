// nebulaJelly.js

export function nebulaJelly() {
    osc(10, 0.03, 0.8)
        .color(0.4, 0.7, 1)
        .modulate(noise(4, 0.1).rotate(1, 0.3).scale(1.2), 0.4)
        .pixelate(100, 30)
        .blend(o0, 0.7)
        .scrollX(() => Math.sin(time / 2) * 0.01)
        .scrollY(() => Math.cos(time / 3) * 0.01)
        .modulateScale(osc(5, 0.1).rotate(() => time * 0.1), 0.2)
        .out();
}