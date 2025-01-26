import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawInfiniteTunnel = (analyser, dataArray, bufferLength) => {
    analyser.getByteFrequencyData(dataArray);

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bufferLength; i++) {
        const radius = (dataArray[i] / 255) * canvas.height / 2; // Scale radius by canvas size
        const alpha = 1 - i / bufferLength; // Fade out as radius increases

        canvasCtx.beginPath();
        canvasCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        canvasCtx.strokeStyle = `hsl(${radius * 10}, 100%, ${50 - alpha * 20}%)`; // Add color and fade
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();
    }
};
