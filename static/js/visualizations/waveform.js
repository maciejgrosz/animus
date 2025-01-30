import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

let lastHue = 0; // 🔴 Store previous hue for smooth transitions

export const drawWaveform = (analyser, dataArray, bufferLength) => {
    analyser.getByteTimeDomainData(dataArray);
    const sensitivity = getSensitivity();

    // 🎨 Calculate Dynamic Color Based on Sound Wave Amplitude
    const avgAmplitude = dataArray.reduce((sum, val) => sum + Math.abs(val - 128), 0) / bufferLength;
    const targetHue = (avgAmplitude / 128) * 360; // Map amplitude to color wheel

    // 🔄 Smoothly transition color using interpolation
    lastHue = lastHue + (targetHue - lastHue) * 0.05; // Adjust transition speed (0.05 = slow, 0.2 = fast)
    const primaryColor = `hsl(${lastHue}, 100%, 50%)`; // Convert to HSL color

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = primaryColor; // 🌈 Apply Smoothed Color
    canvasCtx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = (dataArray[i] - 128) * sensitivity / 128; // Scale around 0
        const y = (v * canvas.height) / 3 + canvas.height / 4; // Centered vertically

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.stroke();
};
