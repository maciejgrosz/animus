export const canvas = document.getElementById('audio-visualizer');
export const canvasCtx = canvas.getContext('2d');

export const adjustCanvasSize = () => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * 0.9 * devicePixelRatio;
    canvas.height = window.innerHeight * 0.9 * devicePixelRatio;
    canvasCtx.scale(devicePixelRatio, devicePixelRatio);
};

let sensitivity = 1; // Default sensitivity

export const getSensitivity = () => sensitivity;

export const updateSensitivity = (newSensitivity, sensitivityValue) => {
    sensitivity = newSensitivity;
    sensitivityValue.textContent = sensitivity.toFixed(2);
};
