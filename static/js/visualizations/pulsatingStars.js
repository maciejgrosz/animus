import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws a pulsating stars effect that reacts to the audio frequency.
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 * @param {Array} [colorPalette] - Optional array of colors for multi-color mode.
 */
export const drawPulsatingStars = (analyser, dataArray, bufferLength, primaryColor, colorPalette) => {
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bufferLength; i++) {
        const sensitivity = getSensitivity();
        const value = dataArray[i];
        const size = (value / 255) * 20 * sensitivity;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, size, 0, Math.PI * 2);
        // Use color from palette if provided.
        const colorToApply = (colorPalette && colorPalette.length > 1)
            ? colorPalette[i % colorPalette.length]
            : primaryColor;
        canvasCtx.fillStyle = colorToApply;
        canvasCtx.fill();
    }
};
