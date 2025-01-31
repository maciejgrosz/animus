import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws a pulsating stars effect that reacts to the audio frequency.
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 */
export const drawPulsatingStars = (analyser, dataArray, bufferLength, primaryColor) => {
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
        canvasCtx.fillStyle = primaryColor; // 🌈 Use color mode from visualize.js
        canvasCtx.fill();
    }
};
