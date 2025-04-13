import React from "react";

const ReadmePage = () => {
    return (
        <div className="relative w-screen h-screen bg-black text-white p-8">
            <div className="bg-black/90 p-8 rounded-2xl text-white text-center max-w-3xl mx-auto overflow-auto">
                <h1 className="text-4xl font-bold mb-4">Animus VJ Tool</h1>
                <p className="text-md text-gray-300 mb-6">
                    Welcome to **Animus**, a browser-based visual performance tool that generates audio-reactive visuals using your microphone or audio input.
                </p>
                <h2 className="text-2xl font-bold mb-4">Features:</h2>
                <ul className="text-md text-gray-300 mb-6">
                    <li>- **Audio-reactive visuals**: Control the visuals in real-time with sound.</li>
                    <li>- **Presets**: Switch between various visual presets and effects.</li>
                    <li>- **Interactive VJ panel**: Customize and interact with the visuals using the user interface.</li>
                    <li>- **Settings button**: Access the settings and additional configurations from the settings button.</li>
                </ul>
                <h2 className="text-2xl font-bold mb-4">Requirements:</h2>
                <ul className="text-md text-gray-300 mb-6">
                    <li>- **Microphone**: This tool requires access to your microphone to capture audio input. Please ensure that your browser has microphone permissions enabled.</li>
                    <li>- **Browser**: The app works best on modern browsers that support WebGL and access to media devices (such as Chrome or Firefox).</li>
                </ul>
                <h2 className="text-2xl font-bold mb-4">How to Use:</h2>
                <p className="text-md text-gray-300 mb-4">
                    1. **Start the Show**: Click on the "Start Show" button to start the audio-reactive visuals based on your microphone input.
                </p>
                <p className="text-md text-gray-300 mb-4">
                    2. **Change Visuals**: Click the "Settings" button in the top-right corner of the screen to access the settings panel where you can change visual parameters, switch between presets, and adjust the audio-reactive settings.
                </p>
                <p className="text-md text-gray-300 mb-4">
                    3. **README Button**: Click the "README" button to access this guide at any time. It will open this file in a new window.
                </p>
                <h2 className="text-2xl font-bold mb-4">Accessing the VJ Panel:</h2>
                <p className="text-md text-gray-300 mb-6">
                    The **VJ panel** is accessible via the **Settings** button located in the top-right corner of the screen. From the panel, you can control various parameters for the visuals such as:
                    - **Mic Sensitivity**: Adjust how sensitive the visuals are to the microphone input.
                    - **Preset Switching**: Switch between different visual presets that respond to the audio input.
                    - **Audio Features**: Fine-tune the frequency bands (bass, mid, treble) to influence the visuals.
                </p>
            </div>
        </div>
    );
};

export default ReadmePage;
