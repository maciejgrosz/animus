import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawSpiral = (analyser, dataArray, bufferLength) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;
    const maxRadius = Math.min(canvas.width, canvas.height) / 2;
    const angleIncrement = Math.PI / 180;

    dataArray.forEach((value, index) => {
        const normalizedValue = (value / 255) * sensitivity;
        const angle = index * angleIncrement * 5;
        const radius = (normalizedValue * maxRadius) / 1.5;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 3, 0, Math.PI * 2);
        canvasCtx.fillStyle = `hsl(${index * 5}, 100%, 50%)`;
        canvasCtx.fill();
    });
};
