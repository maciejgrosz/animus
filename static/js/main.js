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

    let audioContext;
    let isVisualizing = false; // Track visualization state
    let primaryColor = colorPicker.value;
    let colorMode = colorModeSelector.value;
    let visualizer;

    // Update color mode when user selects a new option.
    colorModeSelector.addEventListener('change', (event) => {
        const colorMode = event.target.value;
        if (visualizer) {
            visualizer.setColorMode(colorMode);
        }
    });

    // Update primary color when the color picker value changes.
    colorPicker.addEventListener('input', (event) => {
        primaryColor = event.target.value;
        if (visualizer) {
            visualizer.setPrimaryColor(primaryColor);
        }
    });

    // Get available visualization modes (for keyboard controls, etc.)
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
            visualizer.setSensitivity(parseFloat(sensitivitySlider.value));
            visualizer.setMode(modeSelector.value); // Use the current mode selector value

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

    // Toggle visualization (e.g., triggered via keyboard).
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

    // Update visualization mode from the mode selector.
    modeSelector.addEventListener('change', (event) => {
        if (visualizer) {
            visualizer.setMode(event.target.value);
        }
    });

    // Setup keyboard controls for additional interactivity.
    setupKeyboardControls({
        modes,
        setVisualizationMode: (mode) => { if (visualizer) visualizer.setMode(mode); },
        toggleVisualization,
        modeSelector,
    });

    // Adjust canvas size on window resize.
    window.addEventListener('resize', adjustCanvasSize);
    adjustCanvasSize(); // Initial adjustment
});
