# Audio Flow Documentation

## Complete Audio Flow: Microphone → Visual Preset

This document explains how audio data travels from the microphone through processing to affect visual presets like `florDeFuego2`.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: MICROPHONE CAPTURE                                  │
│ File: useAudioFeatures.js (running in SettingsPanel)        │
└─────────────────────────────────────────────────────────────┘
                            ↓
    navigator.mediaDevices.getUserMedia()
                            ↓
    Web Audio API: analyser.getByteFrequencyData(dataArray)
                            ↓
    ┌─────────────────────────────────────────┐
    │ FFT Analysis (512 bins, 0-22050 Hz)    │
    │                                         │
    │ Bass:   20-140 Hz   (bins 0-3)        │
    │ Mid:    140-400 Hz  (bins 3-9)        │
    │ Treble: 400-2000 Hz (bins 9-46)       │
    └─────────────────────────────────────────┘
                            ↓
    getBandEnergy() → average energy per band
                            ↓
    boosted(val, gain) → val * gain * 0.2
                            ↓
    Example values: bass=0.45, mid=0.38, treble=0.52
                            ↓

┌─────────────────────────────────────────────────────────────┐
│ STEP 2: BROADCAST TO MAIN APP                               │
│ BroadcastChannel: "animus-control"                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
    channel.postMessage({
      type: "audioFeatures",
      value: { bass, mid, treble, bpm }
    })
                            ↓
    [Sent 60 times per second via requestAnimationFrame]
                            ↓

┌─────────────────────────────────────────────────────────────┐
│ STEP 3: RECEIVED IN APP.JSX                                 │
│ File: App.jsx (lines 88-92)                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
    channel.onmessage = (event) => {
      if (type === "audioFeatures") {
        bassRef.current = value.bass      // 0.45
        midRef.current = value.mid        // 0.38
        trebleRef.current = value.treble  // 0.52
      }
    }
                            ↓
    [Updates global refs 60fps]
                            ↓

┌─────────────────────────────────────────────────────────────┐
│ STEP 4: SMOOTHING IN AUDIOREFS.JS                          │
│ File: audioRefs.js                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
    When preset calls: getSmoothedBass()
                            ↓
    const raw = bassRef.current              // 0.45 (from mic)
    smoothBass += (raw - smoothBass) * 0.2  // Exponential smoothing
                            ↓
    Example progression:
    Frame 1: smoothBass = 0 + (0.45 - 0) * 0.2 = 0.09
    Frame 2: smoothBass = 0.09 + (0.45 - 0.09) * 0.2 = 0.16
    Frame 3: smoothBass = 0.16 + (0.45 - 0.16) * 0.2 = 0.22
    Frame 4: smoothBass = 0.22 + (0.45 - 0.22) * 0.2 = 0.27
    Frame 5: smoothBass = 0.27 + (0.45 - 0.27) * 0.2 = 0.31
    ...
    Frame 10: smoothBass ≈ 0.40  ← Takes time to reach target!
                            ↓
    return smoothBass  // Returns 0.40 instead of 0.45
                            ↓

┌─────────────────────────────────────────────────────────────┐
│ STEP 5: USED IN FLOR DE FUEGO 2                            │
│ File: florDeFuego2.js                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
    const bass = () => getSmoothedBass()  // Returns 0.40
                            ↓
    Line 13: osc(30 + bass() * 200, ...)
            = osc(30 + 0.40 * 200, ...)
            = osc(110, ...)  // Oscillator frequency
                            ↓
    Line 15: osc(20 + mid() * 150, ...)
            = osc(20 + 0.35 * 150, ...)
            = osc(72.5, ...)
                            ↓
    Line 16: noise(3 + treble() * 2, ...)
            = noise(3 + 0.48 * 2, ...)
            = noise(3.96, ...)
                            ↓
    Line 17: rotate(0.7 + mid() * 4.3)
            = rotate(0.7 + 0.35 * 4.3)
            = rotate(2.205)  // Radians
                            ↓
    Line 20: modulateRotate(o0, bass() * 1.5 + treble())
            = modulateRotate(o0, 0.40 * 1.5 + 0.48)
            = modulateRotate(o0, 1.08)  // Feedback distortion
                            ↓
    [Visual rendered to canvas]
```

---

## Current System Problems

### Problem 1: Clustered Values (0.4-0.5)

**Location:** `useAudioFeatures.js` line 52

```javascript
function boosted(val, gain, base = 0.2) {
    return Math.min(1, val * gain * base);
}
```

**Issue:**
- If `gain = 5`, then: `val * 5 * 0.2 = val * 1.0`
- Raw FFT values are typically 0.3-0.6
- **Result:** Output stuck at 0.3-0.6, never reaches 0 or 1

**Impact:** Narrow dynamic range, animations feel flat

---

### Problem 2: Smoothing Lag

**Location:** `audioRefs.js`

```javascript
smoothBass += (raw - smoothBass) * 0.2
```

**Issue:**
- Takes ~10 frames to reach 63% of target value
- **Bass kicks feel delayed and weak**
- Same smoothing for attack AND release (no distinction)

**Impact:** Delayed response, especially on transients (kicks, snares)

---

### Problem 3: No Threshold Gating

**Issue:**
- Background noise (~0.1-0.2) always present
- No "silence" = animations never rest
- Can't distinguish quiet from loud sections

**Impact:** Constant jitter, no calm moments

---

## Example: How Values Affect florDeFuego2

### Oscillator Frequency (Line 13)

```javascript
osc(30 + bass() * 200, ...)
```

**Current:** bass ranges 0.35-0.50  
→ Frequency ranges: **100-130 Hz** (narrow!)  

**After fix:** bass ranges 0-1  
→ Frequency ranges: **30-230 Hz** (wide, punchy!)

---

### Feedback Distortion (Line 20)

```javascript
modulateRotate(o0, bass() * 1.5 + treble())
```

**Current:** `0.4 * 1.5 + 0.5 = 1.1` (always around 1.0-1.2)  
→ **Subtle, constant warping**

**After fix:** `0-1.5` (silence to intense)  
→ **Dramatic drops on beats, calm during quiet**

---

## Proposed Improvements

### 1. Attack/Release Envelopes

Replace simple smoothing with separate attack/release rates:

```javascript
if (raw > smoothed) {
    // Rising = ATTACK (fast, e.g., 0.8)
    smoothed += (raw - smoothed) * attackRate
} else {
    // Falling = RELEASE (slower, e.g., 0.3)  
    smoothed += (raw - smoothed) * releaseRate
}
```

**Impact:** Bass kicks hit immediately but decay gracefully

---

### 2. Threshold Gating

```javascript
// Ignore signals below threshold
if (raw < 0.15) return 0
```

**Impact:** Clean silence, no jittery animations on quiet parts

---

### 3. Range Normalization

```javascript
// Map actual range (e.g., 0.2-0.7) → 0-1
normalized = (raw - minSeen) / (maxSeen - minSeen)
```

**Impact:** Full 0→1 dynamic range, not stuck at 0.4-0.5

---

### 4. Exponential Curve (Optional)

```javascript
// Apply power curve for more dramatic effect
punchy = Math.pow(normalized, 1.5)
```

**Impact:** Small sounds stay small, loud sounds feel HUGE

---

### 5. Peak Detection

```javascript
// Detect transients (sudden jumps)
if (raw - previous > 0.3) {
    triggerPeak = true  // Special "hit" signal
}
```

**Impact:** Presets can react to specific moments (cymbal crashes, bass drops)

---

## Files Involved

### Primary Files

1. **`src/hooks/useAudioFeatures.js`**
   - Captures microphone input via Web Audio API
   - Performs FFT analysis (512 bins)
   - Extracts bass/mid/treble frequency bands
   - Broadcasts values via BroadcastChannel

2. **`src/App.jsx`**
   - Receives audio data from BroadcastChannel
   - Updates global refs: `bassRef`, `midRef`, `trebleRef`

3. **`src/core/audioRefs.js`**
   - Provides smoothed audio values
   - Exports: `getSmoothedBass()`, `getSmoothedMid()`, `getSmoothedTreble()`

4. **`src/hydra_presets/florDeFuego2.js`** (example preset)
   - Consumes smoothed audio values
   - Maps them to visual parameters

### Supporting Files

- **`src/core/SettingsPanel.jsx`** - Initializes `useAudioFeatures` hook
- **`src/components/LiveAudioChart.jsx`** - Visualizes audio data

---

---

## Deep Dive: Frequency Band Indexing

### FFT Configuration

```javascript
analyser.fftSize = 512;
dataArray = new Uint8Array(analyser.frequencyBinCount);
```

- **`fftSize = 512`** → Performs FFT on 512 audio samples
- **`frequencyBinCount = fftSize / 2 = 256`** → FFT produces 256 frequency bins
- **`dataArray`** → Array of 256 values (0-255), each representing energy at a frequency

### Frequency Range Mapping

The 256 bins cover **0 Hz to 22,050 Hz** (Nyquist frequency, half of 44.1kHz sample rate):

```
Bin Index  |  Frequency
-----------|-------------
0          |  0 Hz
1          |  86 Hz      (22050 / 256)
2          |  172 Hz
3          |  258 Hz
...        |  ...
128        |  11,025 Hz  (middle)
...        |  ...
255        |  22,050 Hz
```

**Each bin = 86.13 Hz wide** (22050 ÷ 256)

### How `getBandEnergy()` Works

```javascript
function getBandEnergy(data, lowHz, highHz) {
    const lowIndex = Math.floor((lowHz / 22050) * data.length);
    const highIndex = Math.ceil((highHz / 22050) * data.length);
    let sum = 0;
    for (let i = lowIndex; i < highIndex; i++) {
        sum += data[i];
    }
    return sum / (highIndex - lowIndex) / 255;
}
```

**Example: Bass (20-140 Hz)**

```javascript
getBandEnergy(dataArray, 20, 140)
```

**Step 1: Calculate lowIndex**
```
lowIndex = Math.floor((20 / 22050) * 256)
         = Math.floor(0.000907 * 256)
         = Math.floor(0.232)
         = 0  ← Start at bin 0
```

**Step 2: Calculate highIndex**
```
highIndex = Math.ceil((140 / 22050) * 256)
          = Math.ceil(0.00635 * 256)
          = Math.ceil(1.625)
          = 2  ← End at bin 2
```

**Step 3: Sum Energy**
```javascript
for (let i = 0; i < 2; i++) {
    sum += data[i];  // Sum bins 0 and 1
}
```

**Step 4: Average & Normalize**
```javascript
return sum / (2 - 0) / 255;
```
- Divide by `(highIndex - lowIndex)` = average across bins
- Divide by `255` = normalize to 0-1 range (since data is 0-255)

### Visual Representation

```
Frequency Spectrum (256 bins, 0-22050 Hz)
┌──────────────────────────────────────────────────────────┐
│ Bass    │ Mid      │ Treble              │ High Freq... │
│ 20-140  │ 140-400  │ 400-2000            │ 2000-22050   │
│         │          │                     │              │
│ Bins    │ Bins     │ Bins                │ Bins         │
│ 0-2     │ 2-5      │ 5-23                │ 23-255       │
└──────────────────────────────────────────────────────────┘
```

**Bass (20-140 Hz):**
- `lowIndex = 0` (20 Hz)
- `highIndex = 2` (140 Hz)
- Uses bins: **0, 1** (2 bins total)

**Mid (140-400 Hz):**
- `lowIndex = 2` (140 Hz)
- `highIndex = 5` (400 Hz)
- Uses bins: **2, 3, 4** (3 bins total)

**Treble (400-2000 Hz):**
- `lowIndex = 5` (400 Hz)
- `highIndex = 23` (2000 Hz)
- Uses bins: **5-22** (18 bins total)

---

## Deep Dive: Exponential Smoothing

### Current Implementation

```javascript
// audioRefs.js
let smoothBass = 0;
const alpha = 0.2;

export const getSmoothedBass = () => {
    const raw = bassRef.current ?? 0;
    smoothBass += (raw - smoothBass) * alpha;
    return smoothBass;
};
```

### The Math: Exponential Moving Average (EMA)

**Formula:**
```
smoothed_new = smoothed_old + α × (raw - smoothed_old)
```

**Rewritten:**
```
smoothed_new = smoothed_old + α × raw - α × smoothed_old
smoothed_new = (1 - α) × smoothed_old + α × raw
```

**Key insight:** The new value is a weighted average:
- **α = 0.2** means 20% new value, 80% old value
- **α = 0.8** means 80% new value, 20% old value

### Example: Bass Kick Response

**Scenario:** Bass jumps from 0 → 1.0 (loud kick)

| Frame | Raw | Calculation | Smoothed | % of Target |
|-------|-----|-------------|----------|-------------|
| 0 | 0.0 | Initial | 0.00 | 0% |
| 1 | 1.0 | 0.0 + (1.0 - 0.0) × 0.2 | 0.20 | 20% |
| 2 | 1.0 | 0.2 + (1.0 - 0.2) × 0.2 | 0.36 | 36% |
| 3 | 1.0 | 0.36 + (1.0 - 0.36) × 0.2 | 0.49 | 49% |
| 4 | 1.0 | 0.49 + (1.0 - 0.49) × 0.2 | 0.59 | 59% |
| 5 | 1.0 | 0.59 + (1.0 - 0.59) × 0.2 | 0.67 | 67% |
| 10 | 1.0 | ... | 0.89 | 89% |
| 15 | 1.0 | ... | 0.96 | 96% |
| 20 | 1.0 | ... | 0.99 | 99% |

**Key points:**
- Takes **~11 frames** to reach 90% of target
- Takes **~20 frames** to fully reach 1.0
- At 60fps, that's **~330ms delay** (human perception notices delays >100ms)

### The Problem: Same Speed for Rise & Fall

**Bass kick hits:**
```
Frame 1: raw = 1.0 → smoothed = 0.20  (slow rise)
```

**Bass kick ends:**
```
Frame 11: raw = 0.0 → smoothed = 0.80 - (0.80 × 0.2) = 0.64  (slow fall)
```

**Issue:** Both attack and release use same α = 0.2
- **Attack should be FAST** (α = 0.8) → instant hit
- **Release should be SLOW** (α = 0.1) → smooth decay

### Visual Comparison

```
RAW SIGNAL (Bass Kick):
1.0 ┤     ████
0.8 ┤    ██  ██
0.6 ┤   ██    ██
0.4 ┤  ██      ██
0.2 ┤ ██        ██
0.0 ┼─────────────────
    └───────────────── Time (frames)

CURRENT SMOOTHING (α = 0.2):
1.0 ┤        ╭───╮
0.8 ┤      ╭─╯   ╰─╮
0.6 ┤    ╭─╯       ╰─╮
0.4 ┤  ╭─╯           ╰─╮
0.2 ┤╭─╯               ╰─╮
0.0 ┼────────────────────
    └───────────────── Time
    ↑ Delayed rise    ↑ Delayed fall

DESIRED (Attack=0.8, Release=0.2):
1.0 ┤  ╭───╮
0.8 ┤  █   ╰╮
0.6 ┤ ██    ╰╮
0.4 ┤ █      ╰╮
0.2 ┤██       ╰╮
0.0 ┼────────────────
    └───────────────── Time
    ↑ Fast rise!  ↑ Smooth fall
```

### Mathematical Properties

**Response Time (time to reach 63% of target):**
```
τ = 1 / α

α = 0.2 → τ = 5 frames (83ms at 60fps)
α = 0.8 → τ = 1.25 frames (21ms at 60fps)
α = 0.05 → τ = 20 frames (333ms at 60fps)
```

**Why 63%?** From exponential decay formula: `e^(-1) ≈ 0.37`, so `1 - 0.37 = 0.63`

---

## Summary

**Current behavior:** Smooth but boring, narrow range (0.4-0.5), delayed response  
**Desired behavior:** Punchy, wide 0-1 range, instant attack, smooth release

**Key insights:**

### 1. Frequency Bins
- **256 bins cover 0-22,050 Hz**
- Each bin = 86 Hz wide
- `lowIndex/highIndex` select which bins to average
- Bass uses only bins 0-2 (~20-172 Hz)

### 2. Smoothing Problem
- **Current:** Same speed (α=0.2) for rise and fall
- **Issue:** Bass kicks feel sluggish (takes 11 frames to hit 90%)
- **Solution:** Use fast attack (0.8) + slow release (0.2)

### 3. Root Causes of "0.4-0.5 Clustering"
1. `boosted()` function limiting dynamic range
2. Exponential smoothing flattening transients
3. No threshold gating allowing noise through

Fixing these three issues will dramatically improve audio reactivity across all presets.
