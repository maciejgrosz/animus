import { canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws a dynamic gradient background that reacts to sound amplitude.
 * @param {number} amplitude - The average amplitude of the audio.
 * @param {string} primaryColor - The selected color for visualization.
 */
export const drawGradientBackground = (amplitude, primaryColor) => {
    const gradient = canvasCtx.createLinearGradient(0, 0, canvas.width, canvas.height);

    // 🌈 Use primaryColor instead of recalculating HSL
    gradient.addColorStop(0, primaryColor);
    gradient.addColorStop(1, `hsl(${amplitude * 20}, 80%, 30%)`);

    canvasCtx.fillStyle = gradient;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
};

let noiseOffset = 0;

/**
 * Draws a subtle noise background effect.
 */
export const drawNoiseBackground = () => {
    const imageData = canvasCtx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const gray = Math.random() * 255;
        data[i] = data[i + 1] = data[i + 2] = gray; // Set RGB to the same value
        data[i + 3] = 50; // Set alpha for transparency
    }

    canvasCtx.putImageData(imageData, noiseOffset, noiseOffset);
    noiseOffset += 0.5; // Subtle movement
};

