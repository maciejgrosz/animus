let analyser;
let dataArray;
let bufferLength;

export const setupAudioContext = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    return audioContext; // Return the created audio context
};

export const getAnalyser = () => analyser;
export const getDataArray = () => dataArray;
export const getBufferLength = () => bufferLength;
