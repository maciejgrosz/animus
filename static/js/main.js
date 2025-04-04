import { adjustCanvasSize, updateSensitivity } from './canvasUtils.js';
import { setupAudioContext } from './audioSetup.js';
import { setupKeyboardControls } from './keyboardControls.js';
import { Visualizer } from './visualizations/Visualizer.js';
import { setupHydraModeToggle, selectHydraBackground } from './hydraHandler.js';


document.addEventListener('DOMContentLoaded', () => {
    const recordBtn = document.getElementById('record-btn');
    const stopBtn = document.getElementById('stop-btn');
    const statusDisplay = document.getElementById('status');
    const sensitivitySlider = document.getElementById('sensitivity-slider');
    const sensitivityValue = document.getElementById('sensitivity-value');
    const modeSelector = document.getElementById('mode-selector');
    const colorPicker = document.getElementById('color-picker');
    const colorModeSelector = document.getElementById('color-mode');

    // Advanced settings elements.
    const beatThresholdInput = document.getElementById('beat-threshold-factor');
    const beatThresholdDisplay = document.getElementById('beat-threshold-factor-value');
    const beatHistoryInput = document.getElementById('beat-history-size');
    const beatHistoryDisplay = document.getElementById('beat-history-size-value');
    const minBeatIntervalInput = document.getElementById('min-beat-interval');
    const minBeatIntervalDisplay = document.getElementById('min-beat-interval-value');

    // New toggle button for beat transition.
    const toggleBeatTransitionBtn = document.getElementById('toggle-beat-transition');
    // Advanced Settings Panel toggle
    const advancedToggle = document.getElementById("advanced-settings-toggle");
    const advancedPanel = document.getElementById("advanced-settings");


    let audioContext;
    let isVisualizing = false;
    let primaryColor = colorPicker.value;
    // Store the Visualizer instance so we can reuse it.
    let visualizer;
    const popup = document.getElementById('instruction-popup');
    const closeButton = document.getElementById('close-popup');

    if (popup && closeButton) {
        closeButton.addEventListener('click', () => {
            popup.classList.add('hidden');
        });
    }

    if (advancedToggle && advancedPanel) {
        advancedToggle.addEventListener("click", () => {
            advancedPanel.classList.toggle("hidden");
        });
    }
    setupHydraModeToggle();
    window.selectHydraBackground = selectHydraBackground;

// Mode selector change handler
    modeSelector.addEventListener('change', (event) => {
        const newMode = event.target.value;

        // ✅ Skip updating the visualizer if Hydra is selected
        if (newMode === 'hydra') {
            return; // Hydra visuals are handled separately
        }

        if (visualizer) {
            visualizer.setMode(newMode);
            const modeSensitivity = visualizer.modeSensitivity[newMode] || sensitivitySlider.value;
            sensitivitySlider.value = modeSensitivity;
            updateSensitivity(modeSensitivity, sensitivityValue);
        }
    });

// Color mode change handler
    colorModeSelector.addEventListener('change', (event) => {
        const newColorMode = event.target.value;

        // ✅ Only update color mode for p5.js visualizer
        if (visualizer && modeSelector.value !== 'hydra') {
            visualizer.setColorMode(newColorMode);
        }
    });

    // Update primary color.
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
    // Stop button: pause visualization.
    stopBtn.addEventListener('click', pauseVisualizationHandler);

    async function startVisualization() {
        if (isVisualizing) return;

        // If we already have a visualizer, simply restart the animation.
        if (visualizer) {
            visualizer.start();
            isVisualizing = true;
            statusDisplay.textContent = 'Visualizing...';
            recordBtn.disabled = true;
            stopBtn.disabled = false;
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Create audioContext only once.
            audioContext = setupAudioContext(stream);
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            // Create a new Visualizer instance.
            visualizer = new Visualizer(analyser);
            visualizer.setPrimaryColor(primaryColor);
            visualizer.setSensitivity(parseFloat(sensitivitySlider.value));
            visualizer.setMode(modeSelector.value);

            // Set advanced settings.
            visualizer.setBeatThreshold(parseFloat(beatThresholdInput.value));
            visualizer.setBeatHistorySize(parseInt(beatHistoryInput.value, 10));
            visualizer.setMinBeatInterval(parseInt(minBeatIntervalInput.value, 10));

            // Register a callback to update UI when the mode changes.
            visualizer.onModeChange = (newMode) => {
                modeSelector.value = newMode;
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

    // Instead of stopping and closing the audio context, pause the animation.
    function pauseVisualizationHandler() {
        if (!isVisualizing) return;
        if (visualizer) {
            visualizer.stop();
        }
        isVisualizing = false;
        statusDisplay.textContent = 'Paused';
        recordBtn.disabled = false;
        stopBtn.disabled = true;
        // Note: audioContext remains open, preserving visualizer state.
    }

    // Sensitivity slider update.
    sensitivitySlider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        updateSensitivity(value, sensitivityValue);
        if (visualizer) {
            visualizer.setSensitivity(value);
        }
    });

    // Mode selector update.
    modeSelector.addEventListener('change', (event) => {
        const newMode = event.target.value;
        if (visualizer) {
            visualizer.setMode(newMode);
            const modeSensitivity = visualizer.modeSensitivity[newMode] || sensitivitySlider.value;
            sensitivitySlider.value = modeSensitivity;
            updateSensitivity(modeSensitivity, sensitivityValue);
        }
    });

    // Advanced settings: update beat detection parameters.
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
    toggleBeatTransitionBtn.textContent = "Enable Beat Transition";
    // Toggle beat transition using the new button.
    toggleBeatTransitionBtn.addEventListener('click', () => {
        if (!visualizer) return;
        const currentState = visualizer.beatTransitionEnabled;
        visualizer.setBeatTransitionEnabled(!currentState);
        console.log("Beat transition enabled:", !currentState);
        toggleBeatTransitionBtn.textContent = !currentState ? "Disable Beat Transition" : "Enable Beat Transition";
    });

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
        toggleVisualization: () => {
            if (isVisualizing) {
                pauseVisualizationHandler();
            } else {
                startVisualization();
            }
        },
        modeSelector,
    });

    window.addEventListener('resize', adjustCanvasSize);
    adjustCanvasSize();
});


