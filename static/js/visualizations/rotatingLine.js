import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws a rotating grid of lines that reacts to the audio frequency.
 *
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 * @param {number} [sensitivityParam] - Optional sensitivity value.
 * @param {Array} [colorPalette] - Optional array of colors for multi-color mode.
 * @param {number} centerX - The horizontal center of the canvas.
 * @param {number} centerY - The vertical center of the canvas.
 */
export const drawRotatingLineGrid = (analyser, dataArray, bufferLength, primaryColor, sensitivityParam, colorPalette, centerX, centerY) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = sensitivityParam || getSensitivity();
    const numLines = 20;
    const rotationSpeed = 0.005;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numLines; i++) {
        const angle = i * (Math.PI * 2) / numLines + performance.now() * rotationSpeed;
        const length = dataArray[i % bufferLength] * sensitivity;

        // Use the provided centerX and centerY.
        const xStart = centerX;
        const yStart = centerY;
        const xEnd = xStart + Math.cos(angle) * length;
        const yEnd = yStart + Math.sin(angle) * length;

        canvasCtx.beginPath();
        canvasCtx.moveTo(xStart, yStart);
        canvasCtx.lineTo(xEnd, yEnd);

        // Use the multi-color palette if provided; otherwise, fallback to primaryColor.
        const colorToApply = (colorPalette && colorPalette.length > 1)
            ? colorPalette[i % colorPalette.length]
            : primaryColor;
        canvasCtx.strokeStyle = colorToApply;
        canvasCtx.lineWidth = 1.5;
        canvasCtx.stroke();
    }
};
