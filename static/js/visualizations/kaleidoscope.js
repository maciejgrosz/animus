import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawKaleidoscope = (analyser, dataArray, bufferLength, colorPalette) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;

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

            // ✅ Ensure `colorPalette` is valid and doesn't cause undefined colors
            const colorToApply = colorPalette.length > 1
                ? colorPalette[index % colorPalette.length]  // Use multiple colors in Kaleidoscope mode
                : colorPalette[0]; // Fallback to single color for other modes

            canvasCtx.fillStyle = colorToApply;
            canvasCtx.fill();
        }
    });
};
