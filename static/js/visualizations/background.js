import { canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws a dynamic gradient background that reacts to sound amplitude.
 * If a multi‑color palette is provided, it creates a gradient with multiple color stops.
 *
 * @param {number} amplitude - The average amplitude of the audio.
 * @param {string} primaryColor - The selected primary color.
 * @param {Array} [colorPalette] - Optional array of colors for multi‑color gradient.
 */
export const drawGradientBackground = (amplitude, primaryColor, colorPalette) => {
    const gradient = canvasCtx.createLinearGradient(0, 0, canvas.width, canvas.height);

    if (colorPalette && colorPalette.length > 1) {
        // Create evenly spaced color stops from the palette.
        const n = colorPalette.length;
        for (let i = 0; i < n; i++) {
            gradient.addColorStop(i / (n - 1), colorPalette[i]);
        }
    } else {
        // Default: use primaryColor and a secondary color computed from amplitude.
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(1, `hsl(${amplitude * 20}, 80%, 30%)`);
    }

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
        data[i] = data[i + 1] = data[i + 2] = gray;
        data[i + 3] = 50;
    }

    canvasCtx.putImageData(imageData, noiseOffset, noiseOffset);
    noiseOffset += 0.5;
};
