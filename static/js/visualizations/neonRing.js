import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawNeonRings = (analyser, dataArray, bufferLength, primaryColor, colorPalette) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();
    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const numRings = 500; // Draw 500 rings
    for (let i = 0; i < numRings; i++) {
        // Sample the data array at evenly spaced intervals.
        const index = Math.floor((i / numRings) * bufferLength);
        const value = dataArray[index];
        const radius = value * sensitivity;

        canvasCtx.beginPath();
        canvasCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);

        // Use a simple modulo based on the loop index to choose a color.
        const colorToApply = (colorPalette && colorPalette.length > 1)
            ? colorPalette[i % colorPalette.length]
            : primaryColor;

        canvasCtx.strokeStyle = colorToApply;
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();
    }
};
