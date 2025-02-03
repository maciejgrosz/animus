// beatDetection.js

// Configuration parameters for beat detection:
const HISTORY_SIZE = 43;          // Number of past energy values to store (adjust as needed)
const BEAT_THRESHOLD_FACTOR = 1.5; // How many times above the average energy a beat must be
const MIN_BEAT_INTERVAL = 300;     // Minimum time (in ms) between consecutive beats

// Internal state:
let energyHistory = [];
let lastBeatTime = 0;

/**
 * Analyzes the time-domain audio signal from the analyser and returns true if a beat is detected.
 *
 * @param {AnalyserNode} analyser - The Web Audio API analyser node.
 * @returns {boolean} - True if a beat is detected, false otherwise.
 */
export function detectBeat(analyser) {
    // Create an array to hold the time-domain data.
    const bufferLength = analyser.fftSize;
    const timeDomainData = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(timeDomainData);

    // Compute the instantaneous energy of the signal.
    // Here we calculate the mean square deviation from the center (128).
    let instantEnergy = 0;
    for (let i = 0; i < bufferLength; i++) {
        const sample = timeDomainData[i] - 128;
        instantEnergy += sample * sample;
    }
    instantEnergy /= bufferLength;

    // Update the energy history.
    energyHistory.push(instantEnergy);
    if (energyHistory.length > HISTORY_SIZE) {
        energyHistory.shift();
    }

    // Compute the average energy over the stored history.
    const averageEnergy = energyHistory.reduce((sum, value) => sum + value, 0) / energyHistory.length;

    // Check if the current energy significantly exceeds the average.
    const now = performance.now();
    if (instantEnergy > BEAT_THRESHOLD_FACTOR * averageEnergy && (now - lastBeatTime) > MIN_BEAT_INTERVAL) {
        lastBeatTime = now;
        return true;
    }

    return false;
}
