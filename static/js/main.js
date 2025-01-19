 import { adjustCanvasSize } from './canvasUtils.js';
import { setupAudioContext } from './audioSetup.js';
import { visualize, setVisualizationMode, stopVisualization } from './visualizations.js';
import { updateSensitivity } from './canvasUtils.js';

const toggleBtn = document.getElementById('toggle-btn')
const statusDisplay = document.getElementById('status');
const sensitivitySlider = document.getElementById('sensitivity-slider');
const sensitivityValue = document.getElementById('sensitivity-value');
const modeSelector = document.getElementById('mode-selector');

let audioContext;

toggleBtn.addEventListener('click', async () => {
    if (toggleBtn.textContent !== 'Stop') {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = setupAudioContext(stream);

            visualize(); // Start visualization
            statusDisplay.textContent = 'Visualizing...';
            toggleBtn.textContent = 'Stop'
        } catch (error) {
            console.error('Error accessing the microphone:', error);
            statusDisplay.textContent = 'Microphone access denied.';
        }
    } else {
        if (audioContext) {
            audioContext.close();
        }
        stopVisualization()
        statusDisplay.textContent = 'Stopped visualizing.';
        toggleBtn.textContent = 'Start'
    }
})

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
