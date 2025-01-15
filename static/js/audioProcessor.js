const recordBtn = document.getElementById('record-btn');
const stopBtn = document.getElementById('stop-btn');
const statusDisplay = document.getElementById('status');
const canvas = document.getElementById('audio-visualizer');
const canvasCtx = canvas.getContext('2d');
const modeSelector = document.getElementById('mode-selector');
const sensitivitySlider = document.getElementById('sensitivity-slider');
const sensitivityValue = document.getElementById('sensitivity-value');

let audioContext;
let analyser;
let dataArray;
let bufferLength;
let animationFrameId;
let visualizationMode = 'frequency'; // Default mode
let sensitivity = 1; // Default sensitivity factor

// Adjust canvas resolution
const adjustCanvasSize = () => {
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Set the canvas size to 90% of the viewport size
    const targetWidth = window.innerWidth * 0.9;
    const targetHeight = window.innerHeight * 0.9;

    // Update the logical size (accounting for high-DPI screens)
    canvas.width = targetWidth * devicePixelRatio;
    canvas.height = targetHeight * devicePixelRatio;

    // Scale the context to maintain clarity on high-DPI screens
    canvasCtx.scale(devicePixelRatio, devicePixelRatio);
};

// Set up audio context and analyser
const setupAudioContext = (stream) => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
};

// Visualization loop
const visualize = () => {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    if (visualizationMode === 'frequency') {
        drawFrequencyBars();
    } else if (visualizationMode === 'waveform') {
        drawWaveform();
    } else if (visualizationMode === 'radial') {
        drawRadialBurst();
    } else if (visualizationMode === 'spiral') {
        drawSpiral();
    } else if (visualizationMode === 'particle') {
        drawParticleSystem();
    }

    animationFrameId = requestAnimationFrame(visualize);
};

// Draw frequency bars
const drawFrequencyBars = () => {
    analyser.getByteFrequencyData(dataArray);

    const barWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] * sensitivity; // Apply sensitivity scaling
        const color = `rgb(${barHeight + 100}, 50, 150)`;

        canvasCtx.fillStyle = color;
        canvasCtx.fillRect(x, canvas.height / 4 - barHeight, barWidth, barHeight);

        x += barWidth;
    }
};
const drawSpiral = () => {
    analyser.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4;
    const maxRadius = Math.min(canvas.width, canvas.height) / 2; // Limit to canvas size
    const angleIncrement = Math.PI / 180; // Increment for spiral angle

    dataArray.forEach((value, index) => {
        const normalizedValue = (value / 255) * sensitivity; // Apply sensitivity
        const angle = index * angleIncrement * 5; // Spiral rotation speed
        const radius = (normalizedValue * maxRadius) / 1.5; // Scale radius by frequency intensity

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Draw circles along the spiral
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 3, 0, Math.PI * 2); // Small circle
        canvasCtx.fillStyle = `hsl(${index * 5}, 100%, 50%)`; // Dynamic color
        canvasCtx.fill();
    });
};
// Draw waveform
const drawWaveform = () => {
    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 123, 255)';
    canvasCtx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = (dataArray[i] - 128) * sensitivity / 128; // Scale around 0
        const y = (v * canvas.height) / 3 + canvas.height / 4; // Centered vertically TODO ducked
        console.log("canvas.height: ", canvas.height)
        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.stroke();
};

// Draw radial burst
const drawRadialBurst = () => {
    analyser.getByteFrequencyData(dataArray);

    const centerX = canvas.width / 4;
    const centerY = canvas.height / 4; // TODO ducked
    const maxRadius = Math.min(canvas.width, canvas.height) / 2; // Limit to canvas bounds

    dataArray.forEach((value, index) => {
        const radius = Math.min(value * sensitivity, maxRadius); // Clamp radius
        const angle = (index / dataArray.length) * Math.PI * 2;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Draw the point
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 2, 0, Math.PI * 2); // Small circle
        canvasCtx.fillStyle = `hsl(${index * 10}, 100%, 50%)`; // Dynamic color
        canvasCtx.fill();
    });
};

// Handle start recording
recordBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setupAudioContext(stream);

        visualize();
        statusDisplay.textContent = 'Visualizing...';
        recordBtn.disabled = true;
        stopBtn.disabled = false;
    } catch (error) {
        console.error('Error accessing the microphone:', error);
        statusDisplay.textContent = 'Microphone access denied.';
    }
});

// Particle class to handle individual particle behavior
class Particle {
    constructor(x, y, size, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    // Draw the particle
    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
    }

    // Update the particle's position
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Fade out particles by shrinking size
        this.size *= 0.95;

        // Reset if too small
        if (this.size < 0.5) {
            this.size = 0;
        }
    }
}

// Particle system variables
const particles = [];

const drawParticleSystem = () => {
    analyser.getByteFrequencyData(dataArray);

    // Create new particles
    for (let i = 0; i < dataArray.length; i += 5) {
        const intensity = (dataArray[i] / 255) * sensitivity; // Apply sensitivity
        const size = intensity * 10; // Particle size based on intensity
        const speedX = (Math.random() - 0.5) * 4 * sensitivity; // Adjust speed by sensitivity
        const speedY = (Math.random() - 0.5) * 4 * sensitivity; // Adjust speed by sensitivity
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random dynamic color

        particles.push(
            new Particle(canvas.width / 4, canvas.height / 4, size, color, speedX, speedY)
        );
    }

    // Clear the canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        if (particle.size <= 0) {
            particles.splice(i, 1); // Remove faded-out particles
        } else {
            particle.update();
            particle.draw(canvasCtx);
        }
    }
};


// Handle stop recording
stopBtn.addEventListener('click', () => {
    if (audioContext) {
        audioContext.close();
    }
    cancelAnimationFrame(animationFrameId);
    statusDisplay.textContent = 'Stopped visualizing.';
    recordBtn.disabled = false;
    stopBtn.disabled = true;
});

// Update sensitivity based on slider
sensitivitySlider.addEventListener('input', (event) => {
    sensitivity = parseFloat(event.target.value);
    sensitivityValue.textContent = sensitivity.toFixed(2);
});

// Update visualization mode
modeSelector.addEventListener('change', (event) => {
    visualizationMode = event.target.value;
});

// Adjust canvas size on window resize
window.addEventListener('resize', adjustCanvasSize);
adjustCanvasSize(); // Initial adjustment
