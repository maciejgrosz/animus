import { getSensitivity, canvas, canvasCtx } from '../canvasUtils.js';

class Particle {
    constructor(x, y, size, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size *= 0.95;
        if (this.size < 0.5) {
            this.size = 0;
        }
    }
}

const particles = [];

/**
 * Draws a particle system that reacts to the audio frequency.
 * @param {object} analyser - The Web Audio API analyser node.
 * @param {Uint8Array} dataArray - The frequency data array.
 * @param {number} bufferLength - The length of the frequency buffer.
 * @param {string} primaryColor - The selected color for visualization.
 */
export const drawParticleSystem = (analyser, dataArray, bufferLength, primaryColor) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();

    // Enable additive blending for particles
    canvasCtx.globalCompositeOperation = 'lighter';

    // Create new particles
    for (let i = 0; i < dataArray.length; i += 5) {
        const intensity = (dataArray[i] / 255); // Normalize intensity
        const size = intensity * 10 * sensitivity; // Particle size based on intensity
        const speedX = (Math.random() - 0.5) * 4; // Random horizontal movement
        const speedY = (Math.random() - 0.5) * 4; // Random vertical movement
        const color = primaryColor; // 🌈 Use color mode from visualize.js

        particles.push(
            new Particle(canvas.width / 4, canvas.height / 4, size, color, speedX, speedY)
        );
    }

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        if (particle.size <= 0) {
            particles.splice(i, 1); // Remove faded particles
        } else {
            particle.update();
            particle.draw(canvasCtx); // Draw particle with blending
        }
    }

    // Reset to default blending
    canvasCtx.globalCompositeOperation = 'source-over';
};
