import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawFrequencyBarSpiral = (analyser, dataArray, bufferLength) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;
    const spiralFactor = 5; // Controls the spacing between bars
    const barWidth = 3;

    dataArray.forEach((value, index) => {
        const angle = index * 0.1; // Adjust for tighter or looser spirals
        const radius = spiralFactor * index;
        const barHeight = value * sensitivity;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        canvasCtx.beginPath();
        canvasCtx.moveTo(x, y);
        canvasCtx.lineTo(x, y - barHeight);
        canvasCtx.strokeStyle = `hsl(${index * 10}, 100%, 60%)`;
        canvasCtx.lineWidth = barWidth;
        canvasCtx.stroke();
    });
};
