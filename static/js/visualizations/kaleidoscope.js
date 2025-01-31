import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws a kaleidoscope effect that reacts to the audio frequency.
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 */
export const drawKaleidoscope = (analyser, dataArray, bufferLength, primaryColor) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const numShapes = 12;
    dataArray.forEach((value, index) => {
        const radius = value * sensitivity;
        const angle = (index / bufferLength) * Math.PI * 2;

        for (let i = 0; i < numShapes; i++) {
            const rotation = (Math.PI * 2 * i) / numShapes;

            const x = centerX + Math.cos(angle + rotation) * radius;
            const y = centerY + Math.sin(angle + rotation) * radius;

            canvasCtx.beginPath();
            canvasCtx.arc(x, y, 10, 0, Math.PI * 2);
            canvasCtx.fillStyle = primaryColor; // 🌈 Use color mode from visualize.js
            canvasCtx.fill();
        }
    });
};
