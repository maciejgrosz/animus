import { getAnalyser, getDataArray, getBufferLength } from './audioSetup.js';
import { canvas, canvasCtx } from './canvasUtils.js';
import { drawParticleSystem } from './visualizations/particleSystem.js';
import { drawFrequencyBars } from './visualizations/frequencyBars.js';
import { drawRadialBurst } from './visualizations/radialBurst.js';
import { drawSpiral } from './visualizations/spiral.js';
import { drawWaveform } from './visualizations/waveform.js';

let visualizationMode = 'frequency'; // Default mode
let animationFrameId;

export const setVisualizationMode = (mode) => {
    visualizationMode = mode;
};

export const stopVisualization = () => {
    if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId); // Cancel the animation loop
        animationFrameId = undefined; // Reset
    }
};

export const visualize = () => {
    const analyser = getAnalyser();
    const dataArray = getDataArray();
    const bufferLength = getBufferLength();

    if (!analyser || !dataArray || !bufferLength) {
        console.error('Analyser or data array is not set up');
        return;
    }

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    switch (visualizationMode) {
        case 'frequency':
            drawFrequencyBars(analyser, dataArray, bufferLength);
            break;
        case 'waveform':
            drawWaveform(analyser, dataArray, bufferLength);
            break;
        case 'radial':
            drawRadialBurst(analyser, dataArray, bufferLength);
            break;
        case 'spiral':
            drawSpiral(analyser, dataArray, bufferLength);
            break;
        case 'particle':
            drawParticleSystem(analyser, dataArray, bufferLength);
            break;
    }

    animationFrameId = requestAnimationFrame(visualize);
};
