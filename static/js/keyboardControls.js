// keyboardControls.js

export const setupKeyboardControls = ({
                                          modes,
                                          setVisualizationMode,
                                          toggleVisualization,
                                          modeSelector,
                                      }) => {
    let currentModeIndex = 0; // Tracks the current visualization mode

    document.addEventListener('keydown', (event) => {
        if (event.key === 'n' || event.key === 'N') {
            // Next visualization mode
            currentModeIndex = (currentModeIndex + 1) % modes.length;
            setVisualizationMode(modes[currentModeIndex]);
            modeSelector.value = modes[currentModeIndex]; // Update the selector
        } else if (event.key === 'p' || event.key === 'P') {
            // Previous visualization mode
            currentModeIndex = (currentModeIndex - 1 + modes.length) % modes.length;
            setVisualizationMode(modes[currentModeIndex]);
            modeSelector.value = modes[currentModeIndex]; // Update the selector
        } else if (event.key === ' ') {
            // Toggle visualization with spacebar
            event.preventDefault(); // Prevent default scrolling behavior
            toggleVisualization();
        }
    });
};
