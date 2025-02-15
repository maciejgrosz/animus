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
 * @param {Array} [colorPalette] - Optional array of colors for multi-color mode.
 */
export const drawParticleSystem = (analyser, dataArray, bufferLength, primaryColor, colorPalette) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();

    // Enable additive blending for particles.
    canvasCtx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < dataArray.length; i += 5) {
        const intensity = dataArray[i] / 255;
        const size = intensity * 10 * sensitivity;
        const speedX = (Math.random() - 0.5) * 4;
        const speedY = (Math.random() - 0.5) * 4;
        // Use multi-color if available; use Math.floor(i/5) so that groups of particles share colors.
        const colorToApply = (colorPalette && colorPalette.length > 1)
            ? colorPalette[Math.floor(i / 5) % colorPalette.length]
            : primaryColor;
        particles.push(new Particle(canvas.width / 4, canvas.height / 4, size, colorToApply, speedX, speedY));
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        if (particle.size <= 0) {
            particles.splice(i, 1);
        } else {
            particle.update();
            particle.draw(canvasCtx);
        }
    }

    canvasCtx.globalCompositeOperation = 'source-over';
};
