import { adjustCanvasSize } from './canvasUtils.js';
import { setupAudioContext } from './audioSetup.js';
import { visualize, setVisualizationMode, stopVisualization as importedStopVisualization } from './visualizations.js';
import { updateSensitivity } from './canvasUtils.js';
import { setupKeyboardControls } from './keyboardControls.js';

const recordBtn = document.getElementById('record-btn');
const stopBtn = document.getElementById('stop-btn');
const statusDisplay = document.getElementById('status');
const sensitivitySlider = document.getElementById('sensitivity-slider');
const sensitivityValue = document.getElementById('sensitivity-value');
const modeSelector = document.getElementById('mode-selector');
const colorPicker = document.getElementById('color-picker');
const colorModeSelector = document.getElementById('color-mode');

let audioContext;
let isVisualizing = false; // Track the visualization state
let primaryColor = colorPicker.value; // Default color
let colorMode = colorModeSelector.value; // Get initial color mode

// 🎨 Update color mode when user selects an option
colorModeSelector.addEventListener('change', (event) => {
    colorMode = event.target.value;
});

// 🎨 Update primary color when the color picker value changes
colorPicker.addEventListener('input', (event) => {
    primaryColor = event.target.value;
});

// Get all available visualization modes from the selector
const modes = Array.from(modeSelector.options).map(option => option.value);

recordBtn.addEventListener('click', startVisualization);
stopBtn.addEventListener('click', stopVisualizationHandler);

// 🎵 Start visualization
async function startVisualization() {
    if (isVisualizing) return;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = setupAudioContext(stream);

        visualize(colorMode, primaryColor); // ✅ Pass both color mode and color
        isVisualizing = true;
        statusDisplay.textContent = 'Visualizing...';
        recordBtn.disabled = true;
        stopBtn.disabled = false;
    } catch (error) {
        console.error('Error accessing the microphone:', error);
        statusDisplay.textContent = 'Microphone access denied.';
    }
}

// 🎵 Stop visualization
function stopVisualizationHandler() {
    if (!isVisualizing) return;

    if (audioContext) {
        audioContext.close();
    }

    importedStopVisualization(); // Call the imported stopVisualization function
    isVisualizing = false;
    statusDisplay.textContent = 'Stopped visualizing.';
    recordBtn.disabled = false;
    stopBtn.disabled = true;
}

// ⏯ Toggle visualization (Spacebar)
function toggleVisualization() {
    if (isVisualizing) {
        stopVisualizationHandler();
    } else {
        startVisualization();
    }
}

// 🎛 Update sensitivity based on slider
sensitivitySlider.addEventListener('input', (event) => {
    updateSensitivity(parseFloat(event.target.value), sensitivityValue);
});

// 🎨 Update visualization mode
modeSelector.addEventListener('change', (event) => {
    setVisualizationMode(event.target.value);
});

// ⌨ Setup keyboard controls
setupKeyboardControls({
    modes,
    setVisualizationMode,
    toggleVisualization,
    modeSelector,
});

// 📏 Adjust canvas size on window resize
window.addEventListener('resize', adjustCanvasSize);
adjustCanvasSize(); // Initial adjustment
