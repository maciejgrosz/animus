import { getAnalyser, getDataArray, getBufferLength } from './audioSetup.js';
import { canvas, canvasCtx } from './canvasUtils.js';
import { drawParticleSystem } from './visualizations/particleSystem.js';
import { drawFrequencyBars } from './visualizations/frequencyBars.js';
import { drawRadialBurst } from './visualizations/radialBurst.js';
import { drawSpiral } from './visualizations/spiral.js';
import { drawWaveform } from './visualizations/waveform.js';
import { drawGradientBackground } from './visualizations/background.js';
import { drawExpandingLineWave } from "./visualizations/expandingLine.js";
import { drawRotatingLineGrid } from "./visualizations/rotatingLine.js";
import { drawDynamicLineWeb } from "./visualizations/web.js";
import { drawFrequencyBarSpiral } from "./visualizations/spiral2.js";
import { drawKaleidoscope } from "./visualizations/kaleidoscope.js";
import { drawNeonRings } from "./visualizations/neonRing.js";
import { drawInfiniteTunnel } from "./visualizations/tunel.js";
import { drawSpiralVortex } from "./visualizations/vortex.js";
import { drawPulsatingStars } from "./visualizations/pulsatingStars.js";
import { drawSymmetricBurst } from "./visualizations/symmetricBurst.js";

let visualizationMode = 'frequency'; // Default visualization
let animationFrameId;
let lastHue = 0; // Store previous hue for smooth transitions

/**
 * Handles visualization rendering.
 * @param {string} colorMode - The selected color mode (static, frequency, amplitude, rainbow).
 * @param {string} primaryColor - The selected base color.
 */
export const visualize = (colorMode, primaryColor) => {
    const analyser = getAnalyser();
    const dataArray = getDataArray();
    const bufferLength = getBufferLength();

    if (!analyser || !dataArray || !bufferLength) {
        console.error('Analyser or data array is not set up');
        return;
    }

    analyser.getByteFrequencyData(dataArray);

    // 🎨 Compute the correct primary color
    let computedColor = primaryColor; // Default: Use static color

    if (colorMode === "frequency") {
        const avgFrequency = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
        lastHue += ((avgFrequency / 255) * 360 - lastHue) * 0.05; // Smooth transition
        computedColor = `hsl(${Math.round(lastHue)}, 100%, 50%)`;
    } else if (colorMode === "amplitude") {
        const avgAmplitude = dataArray.reduce((sum, val) => sum + Math.abs(val - 128), 0) / bufferLength;
        lastHue += ((avgAmplitude / 128) * 360 - lastHue) * 0.05;
        computedColor = `hsl(${Math.round(lastHue)}, 100%, 50%)`;
    } else if (colorMode === "rainbow") {
        lastHue = (performance.now() / 50) % 360; // Smooth cycling
        computedColor = `hsl(${Math.round(lastHue)}, 100%, 50%)`;
    }

    // Clear canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // 🎨 Apply visualization based on mode
    switch (visualizationMode) {
        case 'frequency':
            drawFrequencyBars(analyser, dataArray, bufferLength, computedColor);
            break;
        case 'waveform':
            drawWaveform(analyser, dataArray, bufferLength, computedColor);
            break;
        case 'radial':
            drawRadialBurst(analyser, dataArray, bufferLength, computedColor);
            break;
        case 'spiral':
            drawSpiral(analyser, dataArray, bufferLength, computedColor);
            break;
        case 'particle':
            drawParticleSystem(analyser, dataArray, bufferLength, computedColor);
            break;
        case 'expanding':
            drawExpandingLineWave(analyser, dataArray, bufferLength, computedColor);
            break;
        case 'rotating':
            drawRotatingLineGrid(analyser, dataArray, bufferLength, computedColor);
            break;
        case 'web':
            drawDynamicLineWeb(analyser, dataArray, bufferLength, computedColor);
            break;
        case 'spiral-2':
            drawFrequencyBarSpiral(analyser, dataArray, bufferLength, computedColor);
            break;
        case 'kaleidoscope':
            drawKaleidoscope(analyser, dataArray, bufferLength, computedColor);
            break;
        case 'neon-ring':
            drawNeonRings(analyser, dataArray, bufferLength, computedColor);
            break;
        case 'tunel':
            drawInfiniteTunnel(analyser, dataArray, bufferLength, computedColor);
            break;
        case 'vortex':
            drawSpiralVortex(analyser, dataArray, bufferLength, computedColor);
            break;
        case 'pulsating-stars':
            drawPulsatingStars(analyser, dataArray, bufferLength, computedColor);
            break;
        case 'symmetric-burst':
            drawSymmetricBurst(analyser, dataArray, bufferLength, computedColor);
            break;
        case 'combined':
            drawCombinedVisualizations(analyser, dataArray, bufferLength, computedColor);
            break;
    }

    // 🔄 Keep looping with updated color mode
    animationFrameId = requestAnimationFrame(() => visualize(colorMode, primaryColor));
};

/**
 * Draws a combined visualization of multiple effects.
 * @param {object} analyser - The audio analyser.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The buffer length.
 * @param {string} primaryColor - The selected color for visualization.
 */
export const drawCombinedVisualizations = (analyser, dataArray, bufferLength, primaryColor) => {
    // Clear the canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // 🎨 Calculate amplitude for dynamic background
    const amplitude = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

    // 🎨 Draw the background with smooth color transition
    drawGradientBackground(amplitude, primaryColor);

    // 🎵 Draw the waveform using dynamic colors
    drawWaveform(analyser, dataArray, bufferLength, primaryColor);

    // 🌟 Draw the particle system with matching colors
    drawParticleSystem(analyser, dataArray, bufferLength, primaryColor);
};

/**
 * Sets the visualization mode.
 * @param {string} mode - The selected visualization mode.
 */
export const setVisualizationMode = (mode) => {
    visualizationMode = mode;
};

/**
 * Stops the visualization loop.
 */
export const stopVisualization = () => {
    if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId); // Cancel the animation loop
        animationFrameId = undefined; // Reset
    }
};
