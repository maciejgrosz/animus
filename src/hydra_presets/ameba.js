// zachKrall.js - Cleaned up & reactive to audio features
export function zachKrall(getBass, getMid, getTreble) {
    const bass = () => getBass?.() ?? 0;
    const mid = () => getMid?.() ?? 0;
    const treble = () => getTreble?.() ?? 0;

// licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0/
//CNDSD
//http://malitzincortes.net/
//ameba

    osc(15, 0.01, 0.1).mult(osc(1, -0.1).modulate(osc(2).rotate(4,1), 20))
        .color(0,2.4,5)
        .saturate(0.4)
        .luma(1,0.1, (6, ()=> 1 ))
        .scale(0.7, ()=> 0.7 )
        .diff(o0)// o0
        .out(o0)// o1

}
