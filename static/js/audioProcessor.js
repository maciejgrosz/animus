const recordBtn = document.getElementById('record-btn');
const stopBtn = document.getElementById('stop-btn');
const statusDisplay = document.getElementById('status');
const canvas = document.getElementById('audio-visualizer');
const canvasCtx = canvas.getContext('2d');
const modeSelector = document.getElementById('mode-selector');

let audioContext;
let analyser;
let dataArray;
let bufferLength;
let animationFrameId;
let visualizationMode = 'frequency'; // Default mode

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
    canvas.width = window.innerWidth * 0.9 * devicePixelRatio; // 90% of viewport width
    canvas.height = window.innerHeight * 0.8 * devicePixelRatio; // 80% of viewport height
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    if (visualizationMode === 'frequency') {
        drawFrequencyBars();
    } else if (visualizationMode === 'waveform') {
        drawWaveform();
    } else if (visualizationMode === 'radial') {
        drawRadialBurst();
    }

    animationFrameId = requestAnimationFrame(visualize); // smooth visualization
};

// Draw frequency bars
const drawFrequencyBars = () => {
    analyser.getByteFrequencyData(dataArray);


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

// Draw waveform
const drawWaveform = () => {
    analyser.getByteTimeDomainData(dataArray);

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

// Draw radial burst
const drawRadialBurst = () => {
    analyser.getByteFrequencyData(dataArray);

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
        console.error('Error accessing the microphone:', error);
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

// Update visualization mode
modeSelector.addEventListener('change', (event) => {
    visualizationMode = event.target.value;
});
