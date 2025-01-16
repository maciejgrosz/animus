import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawWaveform = (analyser, dataArray, bufferLength) => {
    analyser.getByteTimeDomainData(dataArray);
    const sensitivity = getSensitivity();

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 123, 255)';
    canvasCtx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = (dataArray[i] - 128) * sensitivity / 128; // Scale around 0
        const y = (v * canvas.height) / 3 + canvas.height / 4; // Centered vertically

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.stroke();
};
