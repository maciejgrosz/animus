onmessage = (event) => {
    const { width, height, zoom, panX, panY, maxIterations } = event.data;
    const buffer = new ArrayBuffer(width * height * 4);
    const data = new Uint8ClampedArray(buffer);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
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

            const color = iterations === maxIterations ? 0 : (iterations * 10) % 256;
            const index = (y * width + x) * 4;
            data[index] = color; // Red
            data[index + 1] = color; // Green
            data[index + 2] = color; // Blue
            data[index + 3] = 255; // Alpha
        }
    }

    postMessage({ buffer }, [buffer]);
};
