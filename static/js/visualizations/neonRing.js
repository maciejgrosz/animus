import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws neon rings that react to the audio frequency.
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 */
export const drawNeonRings = (analyser, dataArray, bufferLength, primaryColor) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    dataArray.forEach((value, index) => {
        const radius = value * sensitivity;
        canvasCtx.beginPath();
        canvasCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        canvasCtx.strokeStyle = primaryColor; // 🌈 Use color mode from visualize.js
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();
    });
};
