import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws an expanding radial wave of lines that reacts to the audio frequency.
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 */
export const drawExpandingLineWave = (analyser, dataArray, bufferLength, primaryColor) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;

    dataArray.forEach((value, index) => {
        const angle = (index / bufferLength) * Math.PI * 2;
        const radius = value * sensitivity;

        const xStart = centerX + Math.cos(angle) * 10;
        const yStart = centerY + Math.sin(angle) * 10;
        const xEnd = centerX + Math.cos(angle) * radius;
        const yEnd = centerY + Math.sin(angle) * radius;

        canvasCtx.beginPath();
        canvasCtx.moveTo(xStart, yStart);
        canvasCtx.lineTo(xEnd, yEnd);
        canvasCtx.strokeStyle = primaryColor; // 🌈 Use color mode from visualize.js
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();
    });
};
