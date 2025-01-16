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

export const drawParticleSystem = (analyser, dataArray, bufferLength) => {
    analyser.getByteFrequencyData(dataArray);
    const sensitivity = getSensitivity();

    for (let i = 0; i < dataArray.length; i += 5) {
        const intensity = (dataArray[i] / 255) * sensitivity;
        const size = intensity * 10;
        const speedX = (Math.random() - 0.5) * 4 * sensitivity;
        const speedY = (Math.random() - 0.5) * 4 * sensitivity;
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;

        particles.push(new Particle(canvas.width / 4, canvas.height / 4, size, color, speedX, speedY));
    }

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        if (particle.size <= 0) {
            particles.splice(i, 1);
        } else {
            particle.update();
            particle.draw(canvasCtx);
        }
    }
};
