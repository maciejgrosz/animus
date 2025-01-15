const recordBtn = document.getElementById('record-btn');
const stopBtn = document.getElementById('stop-btn');
const statusDisplay = document.getElementById('status');
const canvas = document.getElementById('audio-visualizer');
const canvasCtx = canvas.getContext('2d');

let audioContext;
let analyser;
let dataArray;
let bufferLength;
let animationFrameId;
let visualizationMode = 'waveform'; // Default mode

// Set up audio context and analyser
const setupAudioContext = (stream) => {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048; // FFT resolution
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
};

// Start visualization loop
const visualize = () => {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    if (visualizationMode === 'waveform') {
        analyser.getByteTimeDomainData(dataArray);
        drawWaveform();
    } else if (visualizationMode === 'frequency') {
        analyser.getByteFrequencyData(dataArray);
        drawFrequencyBars();
    } else if (visualizationMode === 'radial') {
        analyser.getByteFrequencyData(dataArray);
        drawRadialPattern();
    }

    animationFrameId = requestAnimationFrame(visualize);
};

// Draw waveform
const drawWaveform = () => {
    canvasCtx.fillStyle = 'rgb(240, 240, 240)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 123, 255)';
    canvasCtx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // Normalize
        const y = (v * canvas.height) / 2;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
};

// Draw frequency bars
const drawFrequencyBars = () => {
    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        const color = `rgb(${barHeight + 100}, 50, 150)`;

        canvasCtx.fillStyle = color;
        canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
    }
};

// Draw radial pattern
const drawRadialPattern = () => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    dataArray.forEach((value, index) => {
        const radius = value / 2; // Scale based on frequency intensity
        const angle = (index / dataArray.length) * Math.PI * 2;

        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 3, 0, Math.PI * 2); // Draw a small circle
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
        console.error('Error accessing the microphone', error);
        statusDisplay.textContent = 'Microphone access denied.';
    }
});

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

// Visualization mode selection
document.getElementById('mode-selector')?.addEventListener('change', (event) => {
    visualizationMode = event.target.value;
});
