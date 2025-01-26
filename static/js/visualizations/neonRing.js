import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawNeonRings = (analyser, dataArray, bufferLength) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    dataArray.forEach((value, index) => {
        const radius = value * sensitivity;
        canvasCtx.beginPath();
        canvasCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        canvasCtx.strokeStyle = `hsl(${index * 10}, 100%, 50%)`;
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();
    });
};
