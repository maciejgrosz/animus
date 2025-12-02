export const amplitudeRef = { current: 0 };
export const bassRef = { current: 0 };
export const midRef = { current: 0 };
export const trebleRef = { current: 0 };

// Peak detection exports
export const peakBassRef = { current: false };
export const peakMidRef = { current: false };
export const peakTrebleRef = { current: false };

// Smoothed state
let smoothBass = 0;
let smoothMid = 0;
let smoothTreble = 0;

// Previous values for peak detection
let prevBass = 0;
let prevMid = 0;
let prevTreble = 0;

// Normalization tracking (adapts to song dynamics over time)
let bassMin = 0.1;
let bassMax = 0.8;
let midMin = 0.1;
let midMax = 0.8;
let trebleMin = 0.1;
let trebleMax = 0.8;

// Attack/Release rates (higher = faster response)
const ATTACK_RATE = 0.7;   // Fast attack for punchy response
const RELEASE_RATE = 0.15; // Slower release for smooth decay

// Threshold gating (ignore noise below this value)
const THRESHOLD = 0.08;

// Peak detection threshold (sudden jump)
const PEAK_THRESHOLD = 0.25;

// Normalization adaptation speed
const NORM_ADAPT_SPEED = 0.001;

function applyEnvelope(raw, smoothed, attack, release) {
    // Threshold gating - treat values below threshold as 0
    if (raw < THRESHOLD) {
        raw = 0;
    }
    
    // Attack/Release envelope
    if (raw > smoothed) {
        // Rising signal = fast attack
        smoothed += (raw - smoothed) * attack;
    } else {
        // Falling signal = slower release
        smoothed += (raw - smoothed) * release;
    }
    
    return smoothed;
}

function normalize(value, min, max) {
    // Prevent division by zero
    if (max - min < 0.1) return value;
    
    // Map value from [min, max] to [0, 1]
    const normalized = (value - min) / (max - min);
    return Math.max(0, Math.min(1, normalized));
}

function updateMinMax(value, currentMin, currentMax) {
    // Slowly adapt min/max to song dynamics
    let newMin = currentMin;
    let newMax = currentMax;
    
    if (value < currentMin) {
        newMin = currentMin + (value - currentMin) * NORM_ADAPT_SPEED * 10;
    }
    if (value > currentMax) {
        newMax = currentMax + (value - currentMax) * NORM_ADAPT_SPEED * 10;
    }
    
    // Slowly drift back to reasonable defaults
    newMin += (0.1 - newMin) * NORM_ADAPT_SPEED;
    newMax += (0.8 - newMax) * NORM_ADAPT_SPEED;
    
    return { min: newMin, max: newMax };
}

export const getSmoothedBass = () => {
    const raw = bassRef.current ?? 0;
    
    // Update normalization range
    const { min, max } = updateMinMax(raw, bassMin, bassMax);
    bassMin = min;
    bassMax = max;
    
    // Normalize to 0-1 range
    const normalized = normalize(raw, bassMin, bassMax);
    
    // Apply envelope
    smoothBass = applyEnvelope(normalized, smoothBass, ATTACK_RATE, RELEASE_RATE);
    
    // Peak detection
    if (normalized - prevBass > PEAK_THRESHOLD) {
        peakBassRef.current = true;
        setTimeout(() => { peakBassRef.current = false; }, 100);
    }
    prevBass = normalized;
    
    return smoothBass;
};

export const getSmoothedMid = () => {
    const raw = midRef.current ?? 0;
    
    // Update normalization range
    const { min, max } = updateMinMax(raw, midMin, midMax);
    midMin = min;
    midMax = max;
    
    // Normalize to 0-1 range
    const normalized = normalize(raw, midMin, midMax);
    
    // Apply envelope
    smoothMid = applyEnvelope(normalized, smoothMid, ATTACK_RATE, RELEASE_RATE);
    
    // Peak detection
    if (normalized - prevMid > PEAK_THRESHOLD) {
        peakMidRef.current = true;
        setTimeout(() => { peakMidRef.current = false; }, 100);
    }
    prevMid = normalized;
    
    return smoothMid;
};

export const getSmoothedTreble = () => {
    const raw = trebleRef.current ?? 0;
    
    // Update normalization range
    const { min, max } = updateMinMax(raw, trebleMin, trebleMax);
    trebleMin = min;
    trebleMax = max;
    
    // Normalize to 0-1 range
    const normalized = normalize(raw, trebleMin, trebleMax);
    
    // Apply envelope
    smoothTreble = applyEnvelope(normalized, smoothTreble, ATTACK_RATE, RELEASE_RATE);
    
    // Peak detection
    if (normalized - prevTreble > PEAK_THRESHOLD) {
        peakTrebleRef.current = true;
        setTimeout(() => { peakTrebleRef.current = false; }, 100);
    }
    prevTreble = normalized;
    
    return smoothTreble;
};
