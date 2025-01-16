import { canvas, canvasCtx } from '../canvasUtils.js';

export const drawGradientBackground = (amplitude) => {
    const gradient = canvasCtx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, `hsl(${amplitude * 10}, 100%, 50%)`);
    gradient.addColorStop(1, `hsl(${amplitude * 20}, 80%, 30%)`);

    canvasCtx.fillStyle = gradient;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
};

let noiseOffset = 0;

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

