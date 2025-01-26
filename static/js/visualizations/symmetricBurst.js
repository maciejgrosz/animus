import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

export const drawSymmetricBurst = (analyser, dataArray, bufferLength) => {
    analyser.getByteFrequencyData(dataArray);

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;
    const numSymmetries = 8; // Number of reflected segments

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    dataArray.forEach((value, index) => {
        const sensitivity = getSensitivity();
        const radius = (value / 255) * sensitivity * 1000; // Increase scale for visibility
        const baseAngle = (index / bufferLength) * Math.PI * 2;
        const angleIncrement = (Math.PI * 2) / numSymmetries;

        for (let symmetry = 0; symmetry < numSymmetries; symmetry++) {
            const angle = baseAngle + symmetry * angleIncrement;

            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            canvasCtx.beginPath();
            canvasCtx.arc(x, y, 5, 0, Math.PI * 2); // Draw a visible dot
            canvasCtx.fillStyle = `hsl(${index * 15 + symmetry * 20}, 100%, 60%)`; // Bright colors
            canvasCtx.fill();
        }
    });
};
