import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws a pulsating stars effect that reacts to the audio frequency.
 * Stars are positioned randomly around the given center coordinates.
 *
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 * @param {Array} [colorPalette] - Optional array of colors for multi-color mode.
 * @param {number} centerX - The horizontal center for positioning stars.
 * @param {number} centerY - The vertical center for positioning stars.
 */
export const drawPulsatingStars = (analyser, dataArray, bufferLength, primaryColor, sensitivityParam, colorPalette, centerX, centerY) => {
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const sensitivity = getSensitivity();
    // Define a maximum distance for star placement (e.g., half the canvas's smaller dimension).
    const maxDistance = Math.min(canvas.width, canvas.height) / 2;

    for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];
        const size = (value / 255) * 20 * sensitivity;

        // Generate a random angle and distance from the provided center.
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * maxDistance;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        canvasCtx.beginPath();
        canvasCtx.arc(x, y, size, 0, Math.PI * 2);

        // Use a random color from the palette if available; otherwise, use primaryColor.
        const colorToApply = (colorPalette && colorPalette.length > 1)
            ? colorPalette[Math.floor(Math.random() * colorPalette.length)]
            : primaryColor;
        canvasCtx.fillStyle = colorToApply;
        canvasCtx.fill();
    }
};
