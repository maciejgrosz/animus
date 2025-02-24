import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws a spiral vortex that reacts to the audio frequency.
 * If a multi-color palette is provided, different segments of the vortex are drawn with different colors.
 *
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 * @param {number} [sensitivityParam] - Optional sensitivity value.
 * @param {Array} [colorPalette] - Optional array of colors for multi-color mode.
 */
export const drawSpiralVortex = (analyser, dataArray, bufferLength, primaryColor, sensitivityParam, colorPalette, centerX, centerY) => {
    // Update audio data.
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = sensitivityParam || getSensitivity();

    const maxRadius = Math.min(canvas.width, canvas.height) / 2;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    dataArray.forEach((value, index) => {
        const radius = (value / 255) * maxRadius * sensitivity;
        const angle = (index / bufferLength) * Math.PI * 8 + performance.now() * 0.002; // Rotation effect

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 5, 0, Math.PI * 2);

        // Use the color palette if provided and has multiple colors; otherwise, fall back to primaryColor.
        const colorToApply = (colorPalette && colorPalette.length > 1)
            ? colorPalette[index % colorPalette.length]
            : primaryColor;

        canvasCtx.fillStyle = colorToApply;
        canvasCtx.fill();
    });
};
