import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws an infinite tunnel effect that reacts to the audio frequency.
 * If a multi-color palette is provided (with more than one color), each circle is drawn in a different color.
 *
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 * @param {number} [sensitivityParam] - Optional sensitivity value.
 * @param {Array} [colorPalette] - Optional array of colors for multi-color mode.
 */
export const drawInfiniteTunnel = (analyser, dataArray, bufferLength, primaryColor, sensitivityParam, colorPalette, centerX, centerY) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = sensitivityParam || getSensitivity();

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bufferLength; i++) {
        const radius = (dataArray[i] / 255) * (canvas.height / 2) * sensitivity;
        const alpha = 1 - i / bufferLength; // fading effect for circles further out

        canvasCtx.beginPath();
        canvasCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);

        // Use a multi-color palette if provided; otherwise, fallback to primaryColor.
        const colorToApply = (colorPalette && colorPalette.length > 1)
            ? colorPalette[i % colorPalette.length]
            : primaryColor;

        canvasCtx.strokeStyle = colorToApply;
        canvasCtx.globalAlpha = alpha;
        canvasCtx.lineWidth = 2;
        canvasCtx.stroke();
    }

    // Reset globalAlpha to avoid affecting other drawings.
    canvasCtx.globalAlpha = 1;
};
