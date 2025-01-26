import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawRotatingLineGrid = (analyser, dataArray, bufferLength) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();

    const numLines = 20;
    const rotationSpeed = 0.005;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numLines; i++) {
        const angle = i * (Math.PI * 2) / numLines + performance.now() * rotationSpeed;
        const length = dataArray[i % bufferLength] * sensitivity;

        const xStart = canvas.width / 4;
        const yStart = canvas.height / 4;
        const xEnd = xStart + Math.cos(angle) * length;
        const yEnd = yStart + Math.sin(angle) * length;

        canvasCtx.beginPath();
        canvasCtx.moveTo(xStart, yStart);
        canvasCtx.lineTo(xEnd, yEnd);
        canvasCtx.strokeStyle = `hsl(${i * 10}, 100%, 50%)`;
        canvasCtx.lineWidth = 1.5;
        canvasCtx.stroke();
    }
};
