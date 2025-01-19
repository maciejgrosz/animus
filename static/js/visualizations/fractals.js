export const drawMandelbrot = (canvas, ctx) => {
    const maxIterations = 100; // Higher values = more detail
    const zoom = 200; // Adjust zoom level
    const panX = canvas.width / 2; // X offset
    const panY = canvas.height / 2; // Y offset

    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            let zx = (x - panX) / zoom;
            let zy = (y - panY) / zoom;
            let cX = zx;
            let cY = zy;
            let iterations = 0;

            while (zx * zx + zy * zy < 4 && iterations < maxIterations) {
                const tempX = zx * zx - zy * zy + cX;
                zy = 2 * zx * zy + cY;
                zx = tempX;
                iterations++;
            }

            const color = iterations === maxIterations ? 'black' : `hsl(${iterations * 10}, 100%, 50%)`;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
        }
    }
};

export const drawJulia = (canvas, ctx, real = -0.7, imaginary = 0.27015) => {
    const maxIterations = 200;
    const zoom = 200;
    const panX = canvas.width / 2;
    const panY = canvas.height / 2;

    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            let zx = (x - panX) / zoom;
            let zy = (y - panY) / zoom;
            let iterations = 0;

            while (zx * zx + zy * zy < 4 && iterations < maxIterations) {
                const tempX = zx * zx - zy * zy + real;
                zy = 2 * zx * zy + imaginary;
                zx = tempX;
                iterations++;
            }

            const color = iterations === maxIterations ? 'black' : `hsl(${iterations * 10}, 100%, 50%)`;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
        }
    }
};

export const drawDynamicMandelbrot = (canvas, ctx, analyser, dataArray) => {
    analyser.getByteFrequencyData(dataArray);
    const amplitude = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

    const maxIterations = 100 + Math.round(amplitude / 2);
    const zoom = 200 + amplitude * 5;
    const panX = canvas.width / 2 + Math.sin(amplitude / 50) * 100;
    const panY = canvas.height / 2 + Math.cos(amplitude / 50) * 100;

    const pixelStep = zoom > 300 ? 2 : 4; // Adaptive pixel density
    for (let x = 0; x < canvas.width; x += pixelStep) {
        for (let y = 0; y < canvas.height; y += pixelStep) {
            let zx = (x - panX) / zoom;
            let zy = (y - panY) / zoom;
            let cX = zx;
            let cY = zy;
            let iterations = 0;

            while (zx * zx + zy * zy < 4 && iterations < maxIterations) {
                const tempX = zx * zx - zy * zy + cX;
                zy = 2 * zx * zy + cY;
                zx = tempX;
                iterations++;
            }

            const color = iterations === maxIterations
                ? 'black'
                : `hsl(${(iterations * 10 + amplitude) % 360}, 100%, 50%)`;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, pixelStep, pixelStep); // Fill block
        }
    }
};

export const drawBufferedMandelbrot = (mainCanvas, ctx, analyser, dataArray) => {
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = mainCanvas.width;
    offscreenCanvas.height = mainCanvas.height;
    const offscreenCtx = offscreenCanvas.getContext('2d');

    analyser.getByteFrequencyData(dataArray);
    const amplitude = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

    const maxIterations = 100 + Math.round(amplitude / 2);
    const zoom = 200 + amplitude * 5;
    const panX = mainCanvas.width / 2 + Math.sin(amplitude / 50) * 100;
    const panY = mainCanvas.height / 2 + Math.cos(amplitude / 50) * 100;

    const pixelStep = 4;
    for (let x = 0; x < mainCanvas.width; x += pixelStep) {
        for (let y = 0; y < mainCanvas.height; y += pixelStep) {
            let zx = (x - panX) / zoom;
            let zy = (y - panY) / zoom;
            let cX = zx;
            let cY = zy;
            let iterations = 0;

            while (zx * zx + zy * zy < 4 && iterations < maxIterations) {
                const tempX = zx * zx - zy * zy + cX;
                zy = 2 * zx * zy + cY;
                zx = tempX;
                iterations++;
            }

            const color = iterations === maxIterations
                ? 'black'
                : `hsl(${(iterations * 10 + amplitude) % 360}, 100%, 50%)`;
            offscreenCtx.fillStyle = color;
            offscreenCtx.fillRect(x, y, pixelStep, pixelStep);
        }
    }

    ctx.drawImage(offscreenCanvas, 0, 0); // Render offscreen canvas onto the main canvas
};


// Initialize the Web Worker
const fractalWorker = new Worker('./static/js/fractalWorker.js');

// Handle messages from the worker
fractalWorker.onmessage = (event) => {
    const { buffer } = event.data;
    const imageData = new ImageData(new Uint8ClampedArray(buffer), canvas.width, canvas.height);
    canvasCtx.putImageData(imageData, 0, 0);
};

export const drawFractalWithWorker = (canvas, ctx, analyser, dataArray) => {
    analyser.getByteFrequencyData(dataArray);
    const amplitude = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

    fractalWorker.postMessage({
        width: canvas.width,
        height: canvas.height,
        zoom: 200 + amplitude * 5,
        panX: canvas.width / 2,
        panY: canvas.height / 2,
        maxIterations: 100 + Math.round(amplitude / 2),
    });

    fractalWorker.onmessage = (event) => {
        const { buffer } = event.data;
        const imageData = new ImageData(new Uint8ClampedArray(buffer), canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);
    };
};