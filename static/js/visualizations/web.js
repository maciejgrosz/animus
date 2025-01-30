import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

let lastHue = 0; // 🔴 Store previous hue for smooth transitions

export const drawDynamicLineWeb = (analyser, dataArray, bufferLength) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();

    const points = [];
    const numPoints = 50;

    // 🎨 Calculate Dynamic Color Based on Sound Frequencies
    const avgFrequency = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
    const targetHue = (avgFrequency / 255) * 360; // Map frequency to color wheel

    // 🔄 Smoothly transition color using interpolation
    lastHue = lastHue + (targetHue - lastHue) * 0.05; // Adjust transition speed (0.05 = slow, 0.2 = fast)
    const primaryColor = `hsl(${lastHue}, 100%, 50%)`; // Convert to HSL color

    // 🔄 Generate Web Points
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const radius = dataArray[i % bufferLength] * sensitivity;

        points.push({
            x: canvas.width / 4 + Math.cos(angle) * radius,
            y: canvas.height / 4 + Math.sin(angle) * radius,
        });
    }

    // 🔗 Connect Points with Smoothly Changing Color
    points.forEach((point, i) => {
        for (let j = i + 1; j < points.length; j++) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(point.x, point.y);
            canvasCtx.lineTo(points[j].x, points[j].y);
            canvasCtx.strokeStyle = primaryColor; // 🌈 Apply Smoothed Color
            canvasCtx.lineWidth = 1; // Adjust thickness if needed
            canvasCtx.stroke();
        }
    });
};
