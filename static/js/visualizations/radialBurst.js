import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawRadialBurst = (analyser, dataArray, bufferLength) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;
    const maxRadius = Math.min(canvas.width, canvas.height) / 2;

    dataArray.forEach((value, index) => {
        const radius = Math.min(value * sensitivity, maxRadius); // Clamp radius
        const angle = (index / dataArray.length) * Math.PI * 2;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 2, 0, Math.PI * 2);
        canvasCtx.fillStyle = `hsl(${index * 10}, 100%, 50%)`;
        canvasCtx.fill();
    });
};
