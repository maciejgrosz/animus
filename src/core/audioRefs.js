export const amplitudeRef = { current: 0 };
export const bassRef = { current: 0 };
export const midRef = { current: 0 };
export const trebleRef = { current: 0 };

let smoothBass = 0;
let smoothMid = 0;
let smoothTreble = 0;

const alpha = 0.05; // smoothing strength

export const getSmoothedBass = () => {
    const raw = bassRef.current ?? 0;
    smoothBass += (raw - smoothBass) * alpha;
    return smoothBass;
};

export const getSmoothedMid = () => {
    const raw = midRef.current ?? 0;
    smoothMid += (raw - smoothMid) * alpha;
    return smoothMid;
};

export const getSmoothedTreble = () => {
    const raw = trebleRef.current ?? 0;
    smoothTreble += (raw - smoothTreble) * alpha;
    return smoothTreble;
};
