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
        this.primaryColor = "#ff0000"; // color from the color picker
        this.sensitivity = getSensitivity(); // initial sensitivity
        this.currentMode = "dynamicLineWeb"; // default animation mode
        this.colorMode = "default"; // default color mode (static)

        // Initialize lastHue for dynamic color modes.
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

        // (Optional) Integrate beat detection here.
        // const beat = detectBeat(this.analyser);
        // if (beat) { /* trigger effects or switch mode */ }

        // Compute the effective color(s) based on the current color mode.
        const { computedColor, colorPalette } = this.computeVisualizationColor();

        // Get the drawing function based on the animation mode.
        const drawMethod = this.modes[this.currentMode];
        if (drawMethod) {
            // Pass the computed color (and color palette) along with other parameters.
            // (Adjust your drawing function signatures as needed.)
            drawMethod(this.analyser, this.dataArray, this.bufferLength, computedColor, this.sensitivity, colorPalette);
        } else {
            console.warn(`No drawing method found for animation mode: ${this.currentMode}`);
        }

        // Schedule the next frame.
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    // Public setter: update the animation mode.
    setMode(newMode) {
        if (this.modes[newMode]) {
            this.currentMode = newMode;
        } else {
            console.warn(`Animation mode "${newMode}" not found.`);
        }
    }

    // Public setter: update the primary color.
    setPrimaryColor(newColor) {
        this.primaryColor = newColor;
    }

    // Public setter: update the sensitivity.
    setSensitivity(newSensitivity) {
        this.sensitivity = newSensitivity;
    }

    // Public setter: update the color mode.
    setColorMode(newColorMode) {
        this.colorMode = newColorMode;
    }

    /**
     * Compute the effective visualization color and palette based on the current color mode.
     * For modes "frequency", "amplitude", and "rainbow", use audio data.
     * For "kaleidoscope", compute a palette.
     * For any other mode (including "default"), return the primaryColor.
     */
    computeVisualizationColor() {
        let computedColor = this.primaryColor; // default to the color picker value
        let colorPalette;

        // For modes that respond to audio.
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

        // Handle kaleidoscope mode separately.
        if (this.colorMode === "kaleidoscope") {
            colorPalette = [];
            const baseHue = (performance.now() / 20) % 360;
            const numReflections = 6;
            for (let i = 0; i < numReflections; i++) {
                const hueShift = (baseHue + i * (360 / numReflections)) % 360;
                colorPalette.push(`hsl(${Math.round(hueShift)}, 100%, 70%)`);
            }
            // For kaleidoscope mode, you might want the computedColor to be one of the palette colors.
            computedColor = colorPalette[0];
        } else {
            // For all other color modes, use a single-color palette.
            colorPalette = [computedColor];
        }

        return { computedColor, colorPalette };
    }

    // (Optional) Update multiple settings at once.
    updateSettings(newSettings) {
        if (newSettings.primaryColor) this.primaryColor = newSettings.primaryColor;
        if (newSettings.sensitivity) this.sensitivity = newSettings.sensitivity;
        if (newSettings.colorMode) this.setColorMode(newSettings.colorMode);
    }
}
