import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws a frequency-based spiral of bars that react to audio input.
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 * @param {number} [sensitivityParam] - Optional sensitivity value.
 * @param {Array} [colorPalette] - Optional array of colors for multi-color mode.
 */
export const drawFrequencyBarSpiral = (analyser, dataArray, bufferLength, primaryColor, sensitivityParam, colorPalette) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = sensitivityParam || getSensitivity();

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;
    const spiralFactor = 5; // Controls the spacing between bars
    const barWidth = 3;

    dataArray.forEach((value, index) => {
        const angle = index * 0.1;
        const radius = spiralFactor * index;
        const barHeight = value * sensitivity;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        canvasCtx.beginPath();
        canvasCtx.moveTo(x, y);
        canvasCtx.lineTo(x, y - barHeight);
        const colorToApply = (colorPalette && colorPalette.length > 1)
            ? colorPalette[index % colorPalette.length]
            : primaryColor;
        canvasCtx.strokeStyle = colorToApply;
        canvasCtx.lineWidth = barWidth;
        canvasCtx.stroke();
    });
};
