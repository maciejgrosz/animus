import { getAnalyser, getDataArray, getBufferLength } from './audioSetup.js';
import { canvas, canvasCtx } from './canvasUtils.js';
import { drawParticleSystem } from './visualizations/particleSystem.js';
import { drawFrequencyBars } from './visualizations/frequencyBars.js';
import { drawRadialBurst } from './visualizations/radialBurst.js';
import { drawSpiral } from './visualizations/spiral.js';
import { drawWaveform } from './visualizations/waveform.js';
import { drawGradientBackground } from './visualizations/background.js';
import {drawExpandingLineWave} from "./visualizations/expandingLine.js";
import {drawRotatingLineGrid} from "./visualizations/rotatingLine.js";
import {drawDynamicLineWeb} from "./visualizations/web.js";
import {drawFrequencyBarSpiral} from "./visualizations/spiral2.js";
import {drawKaleidoscope} from "./visualizations/kaleidoscope.js";
import {drawNeonRings} from "./visualizations/neonRing.js";
import {drawInfiniteTunnel} from "./visualizations/tunel.js";
import {drawSpiralVortex} from "./visualizations/vortex.js";
import {drawPulsatingStars} from "./visualizations/pulsatingStars.js";
import {drawSymmetricBurst} from "./visualizations/symmetricBurst.js";

let visualizationMode = 'frequency'; // Default mode
let animationFrameId;

export const drawCombinedVisualizations = (analyser, dataArray, bufferLength) => {
    // Clear the canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate amplitude for dynamic background
    const amplitude = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

    // Draw the background
    drawGradientBackground(amplitude);

    // Draw the waveform
    drawWaveform(analyser, dataArray, bufferLength);

    // Draw the particle system
    drawParticleSystem(analyser, dataArray, bufferLength);
};


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
        case 'combined':
            drawCombinedVisualizations(analyser, dataArray, bufferLength);
            break;
        case 'expanding':
            drawExpandingLineWave(analyser, dataArray, bufferLength);
            break;
        case 'rotating':
            drawRotatingLineGrid(analyser, dataArray, bufferLength);
            break;
        case 'web':
            drawDynamicLineWeb(analyser, dataArray, bufferLength);
            break;
        case 'spiral-2':
            drawFrequencyBarSpiral(analyser, dataArray, bufferLength);
            break;
        case 'kaleidoscope':
            drawKaleidoscope(analyser, dataArray, bufferLength);
            break;
        case 'neon-ring':
            drawNeonRings(analyser, dataArray, bufferLength);
            break;
        case 'tunel':
            drawInfiniteTunnel(analyser, dataArray, bufferLength);
            break;
        case 'vortex':
            drawSpiralVortex(analyser, dataArray, bufferLength);
            break;
        case 'pulsating-stars':
            drawPulsatingStars(analyser, dataArray, bufferLength);
            break;
        case 'symmetric-burst':
            drawSymmetricBurst(analyser, dataArray, bufferLength);
            break;
        }

    animationFrameId = requestAnimationFrame(visualize);
};
