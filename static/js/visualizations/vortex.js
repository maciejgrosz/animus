import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws a spiral vortex that reacts to the audio frequency.
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 */
export const drawSpiralVortex = (analyser, dataArray, bufferLength, primaryColor) => {
    analyser.getByteFrequencyData(dataArray);

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;
    const maxRadius = Math.min(canvas.width, canvas.height) / 2;
    const sensitivity = getSensitivity();

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    dataArray.forEach((value, index) => {
        const radius = (value / 255) * maxRadius * sensitivity;
        const angle = (index / bufferLength) * Math.PI * 8 + performance.now() * 0.002; // Rotation effect

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 5, 0, Math.PI * 2);
        canvasCtx.fillStyle = primaryColor; // 🌈 Use color mode from visualize.js
        canvasCtx.fill();
    });
};
