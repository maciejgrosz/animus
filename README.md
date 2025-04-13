# Animus VJ Tool - Technical Documentation

This document provides technical details about the **Animus** VJ Tool, including setup instructions, dependencies, and contribution guidelines.

## Setup:
To run the project locally, follow the steps below:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/maciejgrosz/animus.git
    cd animus
    ```

2. **Install Dependencies**:
   If you are using `npm`, run the following command:
    ```bash
    npm install
    ```

3. **Start the Development Server**:
   After installing the dependencies, start the development server:
    ```bash
    npm run dev
    ```
   This will start the app on `http://localhost:5173`.

## Project Structure:
- **public/**: Contains static assets like the `README.md` file and other resources.
- **src/**: Contains the main React application code, including components like `HydraCanvas`, `ThreeCanvas`, and custom hooks like `useHydra`.
- **core/**: Contains reusable functions and modules like `createAmbientSphere.js` for 3D effects.

## Dependencies:
- **React**: Frontend framework for building the user interface.
- **Three.js**: JavaScript library for creating 3D graphics. Used for rendering the VJ visuals.
- **Hydra**: Tool for creating generative visuals that react to audio input. We use it in combination with Three.js to generate complex visuals.

## Audio Features:
- **Mic Input**: The app uses the browser's `getUserMedia` API to access the microphone. This input is processed to extract frequency bands (bass, mid, treble), which are then used to control the visuals in real-time.
- **Audio Analysis**: The frequency analysis is done in the backend using the Web Audio API, where we break down the audio signal into different frequency bands to control visual elements.

## Contributing:
Feel free to fork the project and contribute to its development. Here's how you can contribute:
1. **Fork the repo** and clone it to your local machine.
2. Create a **branch** (`git checkout -b feature-name`).
3. Make your changes, and **commit** (`git commit -am 'Added feature'`).
4. **Push** to your forked repo (`git push origin feature-name`).
5. Create a **Pull Request** with a description of your changes.

## License:
This project is licensed under the MIT License. See the `LICENSE` file for more information.