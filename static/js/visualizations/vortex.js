import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

let lastHue = 0; // 🔴 Store previous hue for smooth transitions

export const drawSpiralVortex = (analyser, dataArray, bufferLength) => {
    analyser.getByteFrequencyData(dataArray);

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;
    const maxRadius = Math.min(canvas.width, canvas.height) / 2;
    const sensitivity = getSensitivity();

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // 🎨 Calculate Dynamic Color Based on Sound Intensity
    const avgFrequency = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
    const targetHue = (avgFrequency / 255) * 360; // Map frequency to color wheel

    // 🔄 Smoothly transition color using interpolation
    lastHue = lastHue + (targetHue - lastHue) * 0.05; // Adjust transition speed (0.05 = slow, 0.2 = fast)
    const primaryColor = `hsl(${lastHue}, 100%, 50%)`; // Convert to HSL color

    dataArray.forEach((value, index) => {
        const radius = (value / 255) * maxRadius * sensitivity;
        const angle = (index / bufferLength) * Math.PI * 8 + performance.now() * 0.002; // Rotation effect

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 5, 0, Math.PI * 2);
        canvasCtx.fillStyle = primaryColor; // 🌈 Apply Smooth Color Transition
        canvasCtx.fill();
    });
};
