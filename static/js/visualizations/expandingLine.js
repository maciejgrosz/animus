import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawExpandingLineWave = (analyser, dataArray, bufferLength) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;

    dataArray.forEach((value, index) => {
        const angle = (index / bufferLength) * Math.PI * 2;
        const radius = value * sensitivity;

        const xStart = centerX + Math.cos(angle) * 10;
        const yStart = centerY + Math.sin(angle) * 10;
        const xEnd = centerX + Math.cos(angle) * radius;
        const yEnd = centerY + Math.sin(angle) * radius;

        canvasCtx.beginPath();
        canvasCtx.moveTo(xStart, yStart);
        canvasCtx.lineTo(xEnd, yEnd);
        canvasCtx.strokeStyle = `hsl(${index * 5}, 100%, 70%)`;
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();
    });
};
