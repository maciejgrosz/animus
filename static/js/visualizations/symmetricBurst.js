import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws a symmetric burst that reacts to the audio frequency.
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 * @param {number} [sensitivityParam] - Optional sensitivity value.
 * @param {Array} [colorPalette] - Optional array of colors for multi-color mode.
 */
export const drawSymmetricBurst = (analyser, dataArray, bufferLength, primaryColor, sensitivityParam, colorPalette, centerX, centerY) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = sensitivityParam || getSensitivity();

    const numSymmetries = 8; // Number of reflected segments

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    dataArray.forEach((value, index) => {
        const radius = (value / 255) * sensitivity * 1000;
        const baseAngle = (index / bufferLength) * Math.PI * 2;
        const angleIncrement = (Math.PI * 2) / numSymmetries;

        for (let symmetry = 0; symmetry < numSymmetries; symmetry++) {
            const angle = baseAngle + symmetry * angleIncrement;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            canvasCtx.beginPath();
            canvasCtx.arc(x, y, 5, 0, Math.PI * 2);
            const colorToApply = (colorPalette && colorPalette.length > 1)
                ? colorPalette[symmetry % colorPalette.length]
                : primaryColor;
            canvasCtx.fillStyle = colorToApply;
            canvasCtx.fill();
        }
    });
};
