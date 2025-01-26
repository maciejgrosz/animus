import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawSpiralVortex = (analyser, dataArray, bufferLength) => {
    analyser.getByteFrequencyData(dataArray);

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;
    const maxRadius = Math.min(canvas.width, canvas.height) / 2;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];
        const radius = (value / 255) * maxRadius;
        const angle = (i / bufferLength) * Math.PI * 8 + performance.now() * 0.002; // Rotation over time

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 5, 0, Math.PI * 2);
        canvasCtx.fillStyle = `hsl(${i * 10 + performance.now() * 0.01}, 100%, 50%)`;
        canvasCtx.fill();
    }
};
