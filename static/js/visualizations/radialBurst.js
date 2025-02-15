import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws a radial burst visualization that reacts to the audio frequency.
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 * @param {Array} [colorPalette] - Optional array of colors for multi-color mode.
 */
export const drawRadialBurst = (analyser, dataArray, bufferLength, primaryColor, colorPalette) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();
    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;
    const maxRadius = Math.min(canvas.width, canvas.height) / 2;

    dataArray.forEach((value, index) => {
        const radius = Math.min(value * sensitivity, maxRadius);
        const angle = (index / dataArray.length) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 2, 0, Math.PI * 2);
        // Choose color from palette if available.
        const colorToApply = (colorPalette && colorPalette.length > 1)
            ? colorPalette[index % colorPalette.length]
            : primaryColor;
        canvasCtx.fillStyle = colorToApply;
        canvasCtx.fill();
    });
};
