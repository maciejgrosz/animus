import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawDynamicLineWeb = (analyser, dataArray, bufferLength, primaryColor, sensitivityParam, colorPalette) => {
    // Use provided sensitivityParam, or fall back to getSensitivity().
    const sensitivity = sensitivityParam || getSensitivity();

    // Update audio data.
    analyser.getByteFrequencyData(dataArray);

    const points = [];
    const numPoints = 50;

    // Use responsive center:
    const centerX = canvas.width < 600 ? canvas.width / 2 : canvas.width / 4;
    const centerY = canvas.height < 600 ? canvas.height / 2 : canvas.height / 4;

    // Generate points in a circular pattern.
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const radius = dataArray[i % bufferLength] * sensitivity;

        points.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
        });
    }

    // Connect points using a color from the palette (if available).
    canvasCtx.lineWidth = 1;
    points.forEach((point, i) => {
        for (let j = i + 1; j < points.length; j++) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(point.x, point.y);
            canvasCtx.lineTo(points[j].x, points[j].y);
            // Cycle through the palette if provided; otherwise, use primaryColor.
            const colorToApply = (colorPalette && colorPalette.length > 1)
                ? colorPalette[i % colorPalette.length]
                : primaryColor;
            canvasCtx.strokeStyle = colorToApply;
            canvasCtx.stroke();
        }
    });
};
