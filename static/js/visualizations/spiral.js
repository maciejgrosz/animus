import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws a spiral visualization that reacts to the audio frequency.
 * If a multi-color palette is provided, each dot is drawn in a different color.
 *
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 * @param {number} [sensitivityParam] - Optional sensitivity value.
 * @param {Array} [colorPalette] - Optional array of colors for multi-color mode.
 */
export const drawSpiral = (analyser, dataArray, bufferLength, primaryColor, sensitivityParam, colorPalette, centerX, centerY) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = sensitivityParam || getSensitivity();

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const maxRadius = Math.min(canvas.width, canvas.height) / 2;
    const angleIncrement = Math.PI / 180;

    dataArray.forEach((value, index) => {
        const normalizedValue = (value / 255) * sensitivity;
        const angle = index * angleIncrement * 5;
        const radius = (normalizedValue * maxRadius) / 1.5;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 3, 0, Math.PI * 2);
        const colorToApply = (colorPalette && colorPalette.length > 1)
            ? colorPalette[index % colorPalette.length]
            : primaryColor;
        canvasCtx.fillStyle = colorToApply;
        canvasCtx.fill();
    });
};
