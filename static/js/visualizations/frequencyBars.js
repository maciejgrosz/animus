import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws frequency bars that react to the audio frequency.
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 */
export const drawFrequencyBars = (analyser, dataArray, bufferLength, primaryColor) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();

    const barWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] * sensitivity; // Apply sensitivity scaling

        canvasCtx.fillStyle = primaryColor; // 🌈 Use color mode from visualize.js
        canvasCtx.fillRect(x, canvas.height / 4 - barHeight, barWidth, barHeight);

        x += barWidth;
    }
};
