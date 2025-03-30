// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Olivia Jack
// https://ojack.github.io
export function oliviaJack() {
    osc(6, 0, 0.8)
        .color(1.14, 0.6, .80)
        .rotate(0.92, 0.3)
        .pixelate(20, 10)
        .mult(osc(40, 0.03).thresh(0.4).rotate(0, -0.02))
        .modulateRotate(osc(20, 0).thresh(0.3, 0.6), () => 0.1 + mouse.x * 0.002)
        .out(o0)
}

export function oliviaJack2() {
// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
// by Olivia Jack
// https://ojack.github.io

    osc(4, 0.1, 0.8).color(1.04,0, -1.1).rotate(0.30, 0.1).pixelate(2, 20).modulate(noise(2.5), () => 1.5 * Math.sin(0.08 * time)).out(o0)
}
