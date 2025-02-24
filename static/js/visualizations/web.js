import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawDynamicLineWeb = (analyser, dataArray, bufferLength, primaryColor, sensitivityParam, colorPalette, centerX, centerY) => {
    const sensitivity = sensitivityParam || getSensitivity();
    analyser.getByteFrequencyData(dataArray);

    const points = [];
    const numPoints = 50;

    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const radius = dataArray[i % bufferLength] * sensitivity;

        points.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
        });
    }

    canvasCtx.lineWidth = 1;
    points.forEach((point, i) => {
        for (let j = i + 1; j < points.length; j++) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(point.x, point.y);
            canvasCtx.lineTo(points[j].x, points[j].y);
            const colorToApply = (colorPalette && colorPalette.length > 1)
                ? colorPalette[i % colorPalette.length]
                : primaryColor;
            canvasCtx.strokeStyle = colorToApply;
            canvasCtx.stroke();
        }
    });
};
