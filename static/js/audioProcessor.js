const recordBtn = document.getElementById('record-btn');
const stopBtn = document.getElementById('stop-btn');
const statusDisplay = document.getElementById('status');
const canvas = document.getElementById('audio-visualizer');
const canvasCtx = canvas.getContext('2d');

let mediaRecorder;
let analyser;
let audioContext;
let audioChunks = [];
let animationFrameId;

// Start Recording and Visualization
recordBtn.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048; // Controls resolution
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    statusDisplay.textContent = 'Recording and Visualizing...';
    recordBtn.disabled = true;
    stopBtn.disabled = false;

    audioChunks = [];
    mediaRecorder.addEventListener('dataavailable', event => {
      audioChunks.push(event.data);
    });

    // Visualization Loop
    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray); // For waveform
      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
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

    draw();
  } catch (error) {
    console.error('Error accessing the microphone', error);
    statusDisplay.textContent = 'Microphone access denied.';
  }
});

// Stop Recording and Visualization
stopBtn.addEventListener('click', () => {
  mediaRecorder.stop();
  cancelAnimationFrame(animationFrameId);
  statusDisplay.textContent = 'Stopped recording.';
  recordBtn.disabled = false;
  stopBtn.disabled = true;
});
