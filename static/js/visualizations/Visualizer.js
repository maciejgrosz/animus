import { getSensitivity } from '../canvasUtils.js';
import { drawParticleSystem } from './particleSystem.js';
import { drawFrequencyBars } from './frequencyBars.js';
import { drawRadialBurst } from './radialBurst.js';
import { drawSpiral } from './spiral.js';
import { drawWaveform } from './waveform.js';
import { drawExpandingLineWave } from "./expandingLine.js";
import { drawRotatingLineGrid } from "./rotatingLine.js";
import { drawDynamicLineWeb } from "./web.js";
import { drawFrequencyBarSpiral } from "./spiral2.js";
import { drawKaleidoscope } from "./kaleidoscope.js";
import { drawNeonRings } from "./neonRing.js";
import { drawInfiniteTunnel } from "./tunel.js";
import { drawSpiralVortex } from "./vortex.js";
import { drawPulsatingStars } from "./pulsatingStars.js";
import { drawSymmetricBurst } from "./symmetricBurst.js";
import { detectBeat } from '../beatDetection.js';

export class Visualizer {
    constructor(analyser) {
        // Get the canvas element and its 2D context.
        this.canvas = document.getElementById('audio-visualizer');
        if (!this.canvas) {
            console.error("Canvas element with id 'audio-visualizer' not found.");
            return;
        }
        this.canvasCtx = this.canvas.getContext('2d');

        // Store the provided audio analyser.
        this.analyser = analyser;

        // Default configuration.
        this.primaryColor = "#ff0000"; // from the color picker
        this.sensitivity = getSensitivity(); // initial sensitivity
        this.currentMode = "dynamicLineWeb"; // default animation mode
        this.colorMode = "default"; // default color mode (static)

        // Advanced beat-detection parameters.
        this.beatThresholdFactor = 1.5; // From advanced setting "Beat Threshold Factor"
        this.beatHistorySize = 43;      // From advanced setting "Beat History Size"
        this.minBeatInterval = 300;     // From advanced setting "Min Beat Interval (ms)"

        // For beat detection mode transitions.
        this.lastBeatTime = 0; // last time a beat triggered a mode change (ms)

        // We'll use lastHue for dynamic color modes.
        this.lastHue = 0;

        // Prepare audio data storage.
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        // Mapping of animation mode names to drawing functions.
        this.modes = {
            frequency: drawFrequencyBars,
            waveform: drawWaveform,
            radial: drawRadialBurst,
            spiral: drawSpiral,
            particle: drawParticleSystem,
            expanding: drawExpandingLineWave,
            rotating: drawRotatingLineGrid,
            web: drawDynamicLineWeb,
            dynamicLineWeb: drawDynamicLineWeb,
            "spiral-2": drawFrequencyBarSpiral,
            kaleidoscope: drawKaleidoscope,
            "neon-ring": drawNeonRings,
            tunel: drawInfiniteTunnel,
            vortex: drawSpiralVortex,
            "pulsating-stars": drawPulsatingStars,
            "symmetric-burst": drawSymmetricBurst,
        };

        // Store per-mode sensitivity.
        this.modeSensitivity = {};
        Object.keys(this.modes).forEach(mode => {
            this.modeSensitivity[mode] = this.sensitivity;
        });

        // Callback for mode changes.
        this.onModeChange = null;

        // New property to enable/disable beat-triggered transitions.
        this.beatTransitionEnabled = false;

        // Variable to store the requestAnimationFrame ID.
        this.animationFrameId = null;
    }

    // Start the animation loop.
    start() {
        this.animate();
    }

    // Stop the animation loop.
    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    // The animation loop.
    animate() {
        // Update audio data.
        this.analyser.getByteFrequencyData(this.dataArray);
        // Clear the canvas.
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Only perform beat detection if enabled.
        if (this.beatTransitionEnabled) {
            const beatOptions = {
                thresholdFactor: this.beatThresholdFactor,
                historySize: this.beatHistorySize,
                minInterval: this.minBeatInterval
            };
            // Note: Ensure detectBeat() expects (analyser, this.dataArray, beatOptions)
            const beatDetected = detectBeat(this.analyser, this.dataArray, beatOptions);
            const now = performance.now();
            if (beatDetected && now - this.lastBeatTime > this.minBeatInterval) {
                this.lastBeatTime = now;
                this.transitionMode();
            }
        }

        // Compute the effective color(s) based on the current color mode.
        const { computedColor, colorPalette } = this.computeVisualizationColor();
        const currentSensitivity = this.modeSensitivity[this.currentMode] || this.sensitivity;

        // Get the drawing function based on the current animation mode.
        const drawMethod = this.modes[this.currentMode];
        if (drawMethod) {
            drawMethod(this.analyser, this.dataArray, this.bufferLength, computedColor, currentSensitivity, colorPalette);
        } else {
            console.warn(`No drawing method found for animation mode: ${this.currentMode}`);
        }

        // Schedule the next frame.
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    // Transition to the next animation mode.
    transitionMode() {
        const modeKeys = Object.keys(this.modes);
        const currentIndex = modeKeys.indexOf(this.currentMode);
        const nextIndex = (currentIndex + 1) % modeKeys.length;
        this.currentMode = modeKeys[nextIndex];
        if (this.onModeChange) {
            this.onModeChange(this.currentMode);
        }
    }

    // Public setters.
    setMode(newMode) {
        if (this.modes[newMode]) {
            this.currentMode = newMode;
        } else {
            console.warn(`Animation mode "${newMode}" not found.`);
        }
    }
    setPrimaryColor(newColor) {
        this.primaryColor = newColor;
    }
    setSensitivity(newSensitivity) {
        this.modeSensitivity[this.currentMode] = newSensitivity;
    }
    setColorMode(newColorMode) {
        this.colorMode = newColorMode;
    }
    setBeatThreshold(newThresholdFactor) {
        this.beatThresholdFactor = newThresholdFactor;
    }
    setBeatHistorySize(newSize) {
        this.beatHistorySize = newSize;
    }
    setMinBeatInterval(newInterval) {
        this.minBeatInterval = newInterval;
    }
    // New setter: enable/disable beat transitions.
    setBeatTransitionEnabled(enabled) {
        this.beatTransitionEnabled = enabled;
    }

    /**
     * Compute the effective visualization color and palette based on the current color mode.
     */
    computeVisualizationColor() {
        let computedColor = this.primaryColor;

        if (this.colorMode === "frequency") {
            const avgFrequency = this.dataArray.reduce((sum, val) => sum + val, 0) / this.bufferLength;
            this.lastHue += (((avgFrequency / 255) * 360) - this.lastHue) * 0.05;
            computedColor = `hsl(${Math.round(this.lastHue)}, 100%, 50%)`;
        } else if (this.colorMode === "amplitude") {
            const avgAmplitude = this.dataArray.reduce((sum, val) => sum + Math.abs(val - 128), 0) / this.bufferLength;
            this.lastHue += (((avgAmplitude / 128) * 360) - this.lastHue) * 0.05;
            computedColor = `hsl(${Math.round(this.lastHue)}, 100%, 50%)`;
        } else if (this.colorMode === "rainbow") {
            this.lastHue = (performance.now() / 50) % 360;
            computedColor = `hsl(${Math.round(this.lastHue)}, 100%, 50%)`;
        }

        let colorPalette;
        if (this.colorMode === "kaleidoscope") {
            colorPalette = [];
            const baseHue = (performance.now() / 20) % 360;
            const numReflections = 6;
            for (let i = 0; i < numReflections; i++) {
                const hueShift = (baseHue + i * (360 / numReflections)) % 360;
                colorPalette.push(`hsl(${Math.round(hueShift)}, 100%, 70%)`);
            }
            computedColor = colorPalette[0];
        } else {
            colorPalette = [computedColor];
        }

        return { computedColor, colorPalette };
    }

    // Update multiple settings at once.
    updateSettings(newSettings) {
        if (newSettings.primaryColor) this.primaryColor = newSettings.primaryColor;
        if (newSettings.sensitivity) this.setSensitivity(newSettings.sensitivity);
        if (newSettings.colorMode) this.setColorMode(newSettings.colorMode);
        if (newSettings.beatThresholdFactor) this.setBeatThreshold(newSettings.beatThresholdFactor);
        if (newSettings.beatHistorySize) this.setBeatHistorySize(newSettings.beatHistorySize);
        if (newSettings.minBeatInterval) this.setMinBeatInterval(newSettings.minBeatInterval);
    }
}
