import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws a waveform visualization that reacts to the audio waveform.
 * If a multi-color palette is provided (with more than one color), the waveform is drawn
 * in segments, each with a different color.
 *
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The waveform data array.
 * @param {number} bufferLength - The length of the waveform buffer.
 * @param {string} primaryColor - The selected color for visualization.
 * @param {number} [sensitivityParam] - Optional sensitivity value.
 * @param {Array} [colorPalette] - Optional array of colors for multi-color mode.
 * @param {number} centerX - The horizontal center of the canvas (for reference, if needed).
 * @param {number} centerY - The vertical center of the canvas.
 */
export const drawWaveform = (
    analyser,
    dataArray,
    bufferLength,
    primaryColor,
    sensitivityParam,
    colorPalette,
    centerX,
    centerY
) => {
    // Retrieve time-domain data.
    analyser.getByteTimeDomainData(dataArray);
    const sensitivity = sensitivityParam || getSensitivity();

    // Clear the canvas.
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate slice width to spread waveform across the entire canvas width.
    const sliceWidth = canvas.width / bufferLength;

    // For multi-color effect, group points into segments.
    const segmentLength = 10;
    const numSegments = Math.floor(bufferLength / segmentLength);

    for (let seg = 0; seg < numSegments; seg++) {
        const start = seg * segmentLength;
        const end = start + segmentLength;

        // Choose a color: if a palette is provided with more than one color, cycle through it.
        const colorToApply = (colorPalette && colorPalette.length > 1)
            ? colorPalette[seg % colorPalette.length]
            : primaryColor;

        canvasCtx.beginPath();
        canvasCtx.strokeStyle = colorToApply;
        canvasCtx.lineWidth = 2;

        for (let i = start; i < end; i++) {
            // Calculate a normalized value (centered at 0) and then scale it.
            const v = (dataArray[i] - 128) * sensitivity / 128;
            // Use centerY as the vertical center for the waveform.
            const y = (v * canvas.height) / 3 + centerY;
            const x = i * sliceWidth;
            if (i === start) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
        }
        canvasCtx.stroke();
    }
};
