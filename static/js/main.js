import { adjustCanvasSize } from './canvasUtils.js';
import { setupAudioContext } from './audioSetup.js';
import { visualize, setVisualizationMode, stopVisualization } from './visualizations.js';
import { updateSensitivity } from './canvasUtils.js';

const recordBtn = document.getElementById('record-btn');
const stopBtn = document.getElementById('stop-btn');
const statusDisplay = document.getElementById('status');
const sensitivitySlider = document.getElementById('sensitivity-slider');
const sensitivityValue = document.getElementById('sensitivity-value');
const modeSelector = document.getElementById('mode-selector');

let audioContext;

recordBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = setupAudioContext(stream);

        visualize(); // Start visualization
        statusDisplay.textContent = 'Visualizing...';
        recordBtn.disabled = true;
        stopBtn.disabled = false;
    } catch (error) {
        console.error('Error accessing the microphone:', error);
        statusDisplay.textContent = 'Microphone access denied.';
    }
});

stopBtn.addEventListener('click', () => {
    if (audioContext) {
        audioContext.close();
    }
    stopVisualization()
    statusDisplay.textContent = 'Stopped visualizing.';
    recordBtn.disabled = false;
    stopBtn.disabled = true;
});

// Update sensitivity based on slider
sensitivitySlider.addEventListener('input', (event) => {
    updateSensitivity(parseFloat(event.target.value), sensitivityValue);
});

// Update visualization mode
modeSelector.addEventListener('change', (event) => {
    setVisualizationMode(event.target.value);
});

// Adjust canvas size on window resize
window.addEventListener('resize', adjustCanvasSize);
adjustCanvasSize(); // Initial adjustment
