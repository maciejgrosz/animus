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
 */
export const drawWaveform = (analyser, dataArray, bufferLength, primaryColor, sensitivityParam, colorPalette) => {
    // Retrieve time-domain data.
    analyser.getByteTimeDomainData(dataArray);
    const sensitivity = sensitivityParam || getSensitivity();

    // Clear the canvas.
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const sliceWidth = canvas.width / bufferLength;

    // For a multi-color effect, break the waveform into segments.
    // We'll group points in blocks (e.g., 10 points per segment).
    const segmentLength = 10;
    const numSegments = Math.floor(bufferLength / segmentLength);

    for (let seg = 0; seg < numSegments; seg++) {
        const start = seg * segmentLength;
        const end = start + segmentLength;

        // Determine the stroke color:
        const colorToApply = (colorPalette && colorPalette.length > 1)
            ? colorPalette[seg % colorPalette.length]
            : primaryColor;

        canvasCtx.beginPath();
        canvasCtx.strokeStyle = colorToApply;
        canvasCtx.lineWidth = 2;

        // Draw the segment.
        for (let i = start; i < end; i++) {
            const v = (dataArray[i] - 128) * sensitivity / 128;
            const y = (v * canvas.height) / 3 + canvas.height / 4;
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
