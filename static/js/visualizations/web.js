import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawDynamicLineWeb = (analyser, dataArray, bufferLength, primaryColor) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();
    const points = [];
    const numPoints = 50;

    // 🔄 Generate Web Points
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const radius = dataArray[i % bufferLength] * sensitivity;

        points.push({
            x: canvas.width / 4 + Math.cos(angle) * radius,
            y: canvas.height / 4 + Math.sin(angle) * radius,
        });
    }

    // 🔗 Connect Points with Computed Color
    canvasCtx.lineWidth = 1; // Adjust thickness if needed
    points.forEach((point, i) => {
        for (let j = i + 1; j < points.length; j++) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(point.x, point.y);
            canvasCtx.lineTo(points[j].x, points[j].y);
            canvasCtx.strokeStyle = primaryColor; // 🌈 Apply Correct Color
            canvasCtx.stroke();
        }
    });
};
