export const canvas = document.getElementById('audio-visualizer');
export const canvasCtx = canvas.getContext('2d');

export const adjustCanvasSize = () => {
    const dpr = window.devicePixelRatio || 1;
    // Calculate the desired display size (90% of window dimensions)
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    // Set the canvas resolution (internal size) to be scaled by the device pixel ratio.
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    // Set the CSS size so that it appears as 90% of the window.
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Reset any existing transform and scale the context.
    canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
    canvasCtx.scale(dpr, dpr);
};


let sensitivity = 1; // Default sensitivity

export const getSensitivity = () => sensitivity;

export const updateSensitivity = (newSensitivity, sensitivityValue) => {
    sensitivity = newSensitivity;
    sensitivityValue.textContent = sensitivity.toFixed(2);
};
