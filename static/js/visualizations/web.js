import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawDynamicLineWeb = (analyser, dataArray, bufferLength, primaryColor, sensitivityParam, colorPalette) => {
    // Use provided sensitivityParam, or fall back to getSensitivity().
    const sensitivity = sensitivityParam || getSensitivity();

    // Update audio data.
    analyser.getByteFrequencyData(dataArray);

    const points = [];
    const numPoints = 50;

    // Generate points in a circular pattern.
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const radius = dataArray[i % bufferLength] * sensitivity;

        points.push({
            x: canvas.width / 4 + Math.cos(angle) * radius,
            y: canvas.height / 4 + Math.sin(angle) * radius,
        });
    }

    // Connect points using a color from the palette (if available).
    canvasCtx.lineWidth = 1;
    points.forEach((point, i) => {
        for (let j = i + 1; j < points.length; j++) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(point.x, point.y);
            canvasCtx.lineTo(points[j].x, points[j].y);

            // If a color palette is provided and has multiple colors,
            // choose a color based on the index; otherwise, use primaryColor.
            if (colorPalette && colorPalette.length > 1) {
                canvasCtx.strokeStyle = colorPalette[i % colorPalette.length];
            } else {
                canvasCtx.strokeStyle = primaryColor;
            }
            canvasCtx.stroke();
        }
    });
};
