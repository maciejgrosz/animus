import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawFrequencyBars = (analyser, dataArray, bufferLength, primaryColor, sensitivityParam, colorPalette) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = sensitivityParam || getSensitivity();

    const barWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] * sensitivity;

        // Use the palette if available.
        const colorToApply = (colorPalette && colorPalette.length > 1)
            ? colorPalette[i % colorPalette.length]
            : primaryColor;

        canvasCtx.fillStyle = colorToApply;
        canvasCtx.fillRect(x, canvas.height / 4 - barHeight, barWidth, barHeight);

        x += barWidth;
    }
};
