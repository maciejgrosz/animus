import { adjustCanvasSize, updateSensitivity } from './canvasUtils.js';
import { setupAudioContext } from './audioSetup.js';
import { setupKeyboardControls } from './keyboardControls.js';
import { Visualizer } from './visualizations/Visualizer.js';

// Wrap initialization to ensure DOM elements are loaded.
document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('record-btn');
    const stopBtn = document.getElementById('stop-btn');
    const statusDisplay = document.getElementById('status');
    const sensitivitySlider = document.getElementById('sensitivity-slider');
    const sensitivityValue = document.getElementById('sensitivity-value');
    const modeSelector = document.getElementById('mode-selector');
    const colorPicker = document.getElementById('color-picker');
    const colorModeSelector = document.getElementById('color-mode');

    // Advanced settings elements
    const beatThresholdInput = document.getElementById('beat-threshold-factor');
    const beatThresholdDisplay = document.getElementById('beat-threshold-factor-value');
    const beatHistoryInput = document.getElementById('beat-history-size');
    const beatHistoryDisplay = document.getElementById('beat-history-size-value');
    const minBeatIntervalInput = document.getElementById('min-beat-interval');
    const minBeatIntervalDisplay = document.getElementById('min-beat-interval-value');

    let audioContext;
    let isVisualizing = false; // Track visualization state
    let primaryColor = colorPicker.value;
    let visualizer;

    // Update color mode when user selects a new option.
    colorModeSelector.addEventListener('change', (event) => {
        const newColorMode = event.target.value;
        if (visualizer) {
            visualizer.setColorMode(newColorMode);
        }
    });

    // Update primary color when the color picker value changes.
    colorPicker.addEventListener('input', (event) => {
        primaryColor = event.target.value;
        if (visualizer) {
            visualizer.setPrimaryColor(primaryColor);
        }
    });

    // Get available visualization modes.
    const modes = Array.from(modeSelector.options).map(option => option.value);

    // Record button: start visualization.
    recordBtn.addEventListener('click', startVisualization);
    // Stop button: stop visualization.
    stopBtn.addEventListener('click', stopVisualizationHandler);

    async function startVisualization() {
        if (isVisualizing) return;
        try {
            // Request microphone access.
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = setupAudioContext(stream);

            // Create and configure the analyser.
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            // Initialize the Visualizer.
            visualizer = new Visualizer(analyser);
            visualizer.setPrimaryColor(primaryColor);
            // Set the initial sensitivity for the default mode.
            visualizer.setSensitivity(parseFloat(sensitivitySlider.value));
            // Set the initial animation mode.
            visualizer.setMode(modeSelector.value);

            // Set initial advanced settings based on slider defaults.
            visualizer.setBeatThreshold(parseFloat(beatThresholdInput.value));
            visualizer.setBeatHistorySize(parseInt(beatHistoryInput.value, 10));
            visualizer.setMinBeatInterval(parseInt(minBeatIntervalInput.value, 10));

            // Register a callback to update the UI when the mode changes.
            visualizer.onModeChange = (newMode) => {
                // Update the mode selector to reflect the new mode.
                modeSelector.value = newMode;
                // Update the sensitivity slider using the per-mode saved setting.
                const modeSensitivity = visualizer.modeSensitivity[newMode] || sensitivitySlider.value;
                sensitivitySlider.value = modeSensitivity;
                updateSensitivity(modeSensitivity, sensitivityValue);
            };

            visualizer.start();
            isVisualizing = true;
            statusDisplay.textContent = 'Visualizing...';
            recordBtn.disabled = true;
            stopBtn.disabled = false;
        } catch (error) {
            console.error('Error accessing the microphone:', error);
            statusDisplay.textContent = 'Microphone access denied.';
        }
    }

    // Stop visualization and close audio context.
    function stopVisualizationHandler() {
        if (!isVisualizing) return;
        if (visualizer) {
            visualizer.stop();
        }
        if (audioContext) {
            audioContext.close();
        }
        isVisualizing = false;
        statusDisplay.textContent = 'Stopped visualizing.';
        recordBtn.disabled = false;
        stopBtn.disabled = true;
    }

    // Toggle visualization.
    function toggleVisualization() {
        if (isVisualizing) {
            stopVisualizationHandler();
        } else {
            startVisualization();
        }
    }

    // Update sensitivity based on slider input.
    sensitivitySlider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        updateSensitivity(value, sensitivityValue);
        if (visualizer) {
            visualizer.setSensitivity(value);
        }
    });

    // Update visualization mode from the mode selector and synchronize sensitivity.
    modeSelector.addEventListener('change', (event) => {
        const newMode = event.target.value;
        if (visualizer) {
            visualizer.setMode(newMode);
            const modeSensitivity = visualizer.modeSensitivity[newMode] || sensitivitySlider.value;
            sensitivitySlider.value = modeSensitivity;
            updateSensitivity(modeSensitivity, sensitivityValue);
        }
    });

    // Advanced settings: Update beat detection parameters.
    beatThresholdInput.addEventListener('input', (event) => {
        const newThreshold = parseFloat(event.target.value);
        beatThresholdDisplay.textContent = newThreshold;
        if (visualizer) {
            visualizer.setBeatThreshold(newThreshold);
        }
    });

    beatHistoryInput.addEventListener('input', (event) => {
        const newHistorySize = parseInt(event.target.value, 10);
        beatHistoryDisplay.textContent = newHistorySize;
        if (visualizer) {
            visualizer.setBeatHistorySize(newHistorySize);
        }
    });

    minBeatIntervalInput.addEventListener('input', (event) => {
        const newMinInterval = parseInt(event.target.value, 10);
        minBeatIntervalDisplay.textContent = newMinInterval;
        if (visualizer) {
            visualizer.setMinBeatInterval(newMinInterval);
        }
    });
    // Setup keyboard controls for additional interactivity.
    setupKeyboardControls({
        modes,
        setVisualizationMode: (mode) => {
            if (visualizer) {
                visualizer.setMode(mode);
                modeSelector.value = mode;
                const modeSensitivity = visualizer.modeSensitivity[mode] || sensitivitySlider.value;
                sensitivitySlider.value = modeSensitivity;
                updateSensitivity(modeSensitivity, sensitivityValue);
            }
        },
        toggleVisualization,
        modeSelector,
    });

    // Adjust canvas size on window resize.
    window.addEventListener('resize', adjustCanvasSize);
    adjustCanvasSize(); // Initial adjustment
});
