import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawKaleidoscope = (analyser, dataArray, bufferLength, primaryColor, sensitivityParam, colorPalette, centerX, centerY) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = sensitivityParam || getSensitivity();

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const numShapes = 12; // Number of symmetry reflections

    dataArray.forEach((value, index) => {
        const radius = value * sensitivity;
        const angle = (index / bufferLength) * Math.PI * 2;

        for (let i = 0; i < numShapes; i++) {
            const rotation = (Math.PI * 2 * i) / numShapes;
            const x = centerX + Math.cos(angle + rotation) * radius;
            const y = centerY + Math.sin(angle + rotation) * radius;

            canvasCtx.beginPath();
            canvasCtx.arc(x, y, 10, 0, Math.PI * 2);

            // Use the inner loop index to pick a color from the palette if available.
            const colorToApply = (colorPalette && colorPalette.length > 1)
                ? colorPalette[i % colorPalette.length]
                : primaryColor;

            canvasCtx.fillStyle = colorToApply;
            canvasCtx.fill();
        }
    });
};
