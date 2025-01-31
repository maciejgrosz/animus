import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws an infinite tunnel effect that reacts to the audio frequency.
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 */
export const drawInfiniteTunnel = (analyser, dataArray, bufferLength, primaryColor) => {
    analyser.getByteFrequencyData(dataArray);

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bufferLength; i++) {
        const radius = (dataArray[i] / 255) * canvas.height / 2; // Scale radius by canvas size
        const alpha = 1 - i / bufferLength; // Fade out as radius increases

        canvasCtx.beginPath();
        canvasCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        canvasCtx.strokeStyle = primaryColor; // 🌈 Use color mode from visualize.js
        canvasCtx.globalAlpha = alpha; // Apply fading effect
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();
    }

    // Reset globalAlpha after drawing to avoid affecting other visualizations
    canvasCtx.globalAlpha = 1;
};
