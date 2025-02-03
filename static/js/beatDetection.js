// beatDetection.js

// Default configuration parameters for beat detection:
const DEFAULT_HISTORY_SIZE = 43;          // Default number of past energy values to store
const DEFAULT_BEAT_THRESHOLD_FACTOR = 1.5;  // Default multiplier: beat must be this many times above average energy
const DEFAULT_MIN_BEAT_INTERVAL = 300;      // Default minimum time (in ms) between consecutive beats

// Internal state (shared across calls):
let energyHistory = [];
let lastBeatTime = 0;

/**
 * Analyzes the time-domain audio signal from the analyser and returns true if a beat is detected.
 * This version does not count claps; it returns true immediately when a beat is detected
 * based on the relative energy and a minimum interval.
 *
 * @param {AnalyserNode} analyser - The Web Audio API analyser node.
 * @param {Object} options - Optional settings to override defaults.
 * @param {number} options.historySize - Number of past energy values to store.
 * @param {number} options.thresholdFactor - Multiplier for the average energy.
 * @param {number} options.minInterval - Minimum time (in ms) between consecutive beats.
 * @returns {boolean} - True if a beat is detected, false otherwise.
 */
export function detectBeat(analyser, options = {}) {
    const historySize = options.historySize || DEFAULT_HISTORY_SIZE;
    const thresholdFactor = options.thresholdFactor || DEFAULT_BEAT_THRESHOLD_FACTOR;
    const minInterval = options.minInterval || DEFAULT_MIN_BEAT_INTERVAL;

    // Create an array to hold the time-domain data.
    const bufferLength = analyser.fftSize;
    const timeDomainData = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(timeDomainData);

    // Compute the instantaneous energy of the signal.
    // Calculate the mean square deviation from the center (128).
    let instantEnergy = 0;
    for (let i = 0; i < bufferLength; i++) {
        const sample = timeDomainData[i] - 128;
        instantEnergy += sample * sample;
    }
    instantEnergy /= bufferLength;

    // Update the energy history.
    energyHistory.push(instantEnergy);
    if (energyHistory.length > historySize) {
        energyHistory.shift();
    }

    // Compute the average energy over the stored history.
    const averageEnergy = energyHistory.reduce((sum, value) => sum + value, 0) / energyHistory.length;

    // Check if the instantaneous energy exceeds the threshold relative to the average.
    const now = performance.now();
    if (instantEnergy > thresholdFactor * averageEnergy && (now - lastBeatTime) > minInterval) {
        lastBeatTime = now;
        return true;
    }

    return false;
}
