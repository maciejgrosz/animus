import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

/**
 * Draws a waveform visualization that reacts to the audio waveform.
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The waveform data array.
 * @param {number} bufferLength - The length of the waveform buffer.
 * @param {string} primaryColor - The selected color for visualization.
 */
export const drawWaveform = (analyser, dataArray, bufferLength, primaryColor) => {
    analyser.getByteTimeDomainData(dataArray);
    const sensitivity = getSensitivity();

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = primaryColor; // 🌈 Use color mode from visualize.js
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
