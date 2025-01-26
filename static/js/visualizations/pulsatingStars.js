import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawPulsatingStars = (analyser, dataArray, bufferLength) => {
    analyser.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bufferLength; i++) {
        const sensitivity = getSensitivity();
        const value = dataArray[i];
        const size = (value / 255) * 20 * sensitivity;

        // Random position on canvas
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        canvasCtx.beginPath();
        canvasCtx.arc(x, y, size, 0, Math.PI * 2);
        canvasCtx.fillStyle = `hsl(${i * 15}, 100%, 50%)`;
        canvasCtx.fill();
    }
};
