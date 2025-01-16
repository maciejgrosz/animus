import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawFrequencyBars = (analyser, dataArray, bufferLength) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();

    const barWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] * sensitivity; // Apply sensitivity scaling
        const color = `rgb(${barHeight + 100}, 50, 150)`;

        canvasCtx.fillStyle = color;
        canvasCtx.fillRect(x, canvas.height / 4 - barHeight, barWidth, barHeight);

        x += barWidth;
    }
};
