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
import { detectBeat } from './beatDetection.js';

let visualizationMode = 'frequency'; // Default visualization
let animationFrameId;
let lastHue = 0; // Store previous hue for smooth transitions
let colorPalette = []; // 🔹 Ensure it resets properly each frame

/**
 * Handles visualization rendering.
 * @param {string} colorMode - The selected color mode (static, frequency, amplitude, rainbow, kaleidoscope).
 * @param {string} primaryColor - The selected base color.
 */


// Define an array of visualization modes to cycle through.
const animationModes = [
    "frequency",
    "waveform",
    "radial",
    "spiral",
    "particle",
    "expanding",
    "rotating",
    "web",
    "spiral-2",
    "kaleidoscope",
    "neon-ring",
    "tunel",
    "vortex",
    "pulsating-stars",
    "symmetric-burst",
    "combined"
];

// Global variables to track the current mode and beat-based transition.
let currentAnimationIndex = 0;          // Index in the animationModes array.
let beatCounter = 0;                    // Count beats until a transition is triggered.
const BEAT_THRESHOLD = 10;              // Change animation every 10 beats.

function computeVisualizationColor(currentColorMode, getPrimaryColor, dataArray, bufferLength) {
    let computedColor = getPrimaryColor();

    if (currentColorMode === "frequency") {
        const avgFrequency = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
        lastHue += ((avgFrequency / 255) * 360 - lastHue) * 0.05;
        computedColor = `hsl(${Math.round(lastHue)}, 100%, 50%)`;
    } else if (currentColorMode === "amplitude") {
        const avgAmplitude = dataArray.reduce((sum, val) => sum + Math.abs(val - 128), 0) / bufferLength;
        lastHue += ((avgAmplitude / 128) * 360 - lastHue) * 0.05;
        computedColor = `hsl(${Math.round(lastHue)}, 100%, 50%)`;
    } else if (currentColorMode === "rainbow") {
        lastHue = (performance.now() / 50) % 360;
        computedColor = `hsl(${Math.round(lastHue)}, 100%, 50%)`;
    }

    // Handle kaleidoscope mode separately.
    if (currentColorMode === "kaleidoscope") {
        colorPalette = [];
        const baseHue = (performance.now() / 20) % 360;
        const numReflections = 6;
        for (let i = 0; i < numReflections; i++) {
            const hueShift = (baseHue + i * (360 / numReflections)) % 360;
            colorPalette.push(`hsl(${Math.round(hueShift)}, 100%, 70%)`);
        }
    } else {
        colorPalette = [computedColor];
    }

    return { computedColor, colorPalette };
}

// Updates the visualization mode based on beat detection.
function updateVisualizationMode(analyser) {
    const beat = detectBeat(analyser);
    if (beat) {
        beatCounter++;
        if (beatCounter >= BEAT_THRESHOLD) {
            currentAnimationIndex = (currentAnimationIndex + 1) % animationModes.length;
            visualizationMode = animationModes[currentAnimationIndex];
            beatCounter = 0;
        }
    }
}

// Renders the visualization based on the current mode.
function renderVisualization(visualizationMode, analyser, dataArray, bufferLength, computedColor, colorPalette) {
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
            drawKaleidoscope(analyser, dataArray, bufferLength, colorPalette);
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
            drawCombinedVisualizations(analyser, dataArray, bufferLength, colorPalette);
            break;
        default:
            console.warn("Unknown visualization mode:", visualizationMode);
    }
}

// --- Main Visualization Function ---
export const visualize = (getColorMode, getPrimaryColor) => {
    // Retrieve current settings.
    const currentColorMode = getColorMode();
    const analyser = getAnalyser();
    const dataArray = getDataArray();
    const bufferLength = getBufferLength();

    if (!analyser || !dataArray || !bufferLength) {
        console.error('Analyser or data array is not set up');
        return;
    }

    // Update audio data.
    analyser.getByteFrequencyData(dataArray);

    // Compute colors.
    const { computedColor, colorPalette } = computeVisualizationColor(
        currentColorMode, getPrimaryColor, dataArray, bufferLength
    );

    // Update mode based on beat detection.
    updateVisualizationMode(analyser);

    // Clear canvas.
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Render the current visualization.
    renderVisualization(visualizationMode, analyser, dataArray, bufferLength, computedColor, colorPalette);

    // Continue animation loop.
    animationFrameId = requestAnimationFrame(() => visualize(getColorMode, getPrimaryColor));
};

/**
 * Draws a combined visualization of multiple effects.
 * @param {object} analyser - The audio analyser.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The buffer length.
 * @param {Array} colorPalette - The selected colors for visualization.
 */
export const drawCombinedVisualizations = (analyser, dataArray, bufferLength, colorPalette) => {
    // Clear the canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // 🎨 Calculate amplitude for dynamic background
    const amplitude = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

    // 🎨 Draw the background with smooth color transition
    drawGradientBackground(amplitude, colorPalette[0]);

    // 🎵 Draw the waveform using dynamic colors
    drawWaveform(analyser, dataArray, bufferLength, colorPalette[0]);

    // 🌟 Draw the particle system with matching colors
    drawParticleSystem(analyser, dataArray, bufferLength, colorPalette[0]);
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
