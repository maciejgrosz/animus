# Animus Architecture Documentation

Welcome to the Animus VJ Tool architecture guide. This document provides a high-level overview of how the system works.

## 📖 Documentation Index

- **[This File (ARCHITECTURE.md)]** - System overview and component relationships
- **[FLOW_DIAGRAMS.md](./FLOW_DIAGRAMS.md)** - Visual flow diagrams for key operations
- **[../src/core/three_presets/README.md](../src/core/three_presets/README.md)** - Three.js preset development guide
- **[../ROADMAP.md](../ROADMAP.md)** - Improvement tasks and roadmap
- **[../QUICK_START.md](../QUICK_START.md)** - Getting started guide

---

## 🎯 System Overview

Animus is a browser-based VJ tool that creates real-time audio-reactive visuals using two engines:

1. **Three.js Engine** - 3D WebGL graphics with custom shaders
2. **Hydra Engine** - Live-coding visual synthesizer

Both engines react to microphone input, extracting frequency bands (bass, mid, treble) and BPM to drive visual effects.

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         React App                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  App.jsx (Main Container)                                 │  │
│  │  - Receives BroadcastChannel messages                     │  │
│  │  - Manages preset switching logic                         │  │
│  │  - Auto-switch on beat detection                          │  │
│  └────────────────┬──────────────────────────────────────────┘  │
│                   │                                              │
│                   ↓                                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  VisualCanvas.jsx (Engine Orchestrator)                   │  │
│  │  - Manages engine lifecycle (Three.js / Hydra)            │  │
│  │  - Loads and unloads presets                              │  │
│  │  - Handles cleanup between switches                       │  │
│  └───────┬───────────────────────┬───────────────────────────┘  │
│          │                       │                               │
│          ↓                       ↓                               │
│  ┌──────────────┐        ┌──────────────┐                       │
│  │ Three.js     │        │ Hydra        │                       │
│  │ Container    │        │ Canvas       │                       │
│  └──────┬───────┘        └──────┬───────┘                       │
│         │                       │                                │
└─────────┼───────────────────────┼────────────────────────────────┘
          │                       │
          ↓                       ↓
┌─────────────────────┐   ┌──────────────────┐
│ Three.js Engine     │   │ Hydra Synth      │
│ (Singleton)         │   │                  │
│                     │   │                  │
│ ┌─────────────────┐ │   │ - Global funcs   │
│ │ init.js         │ │   │ - osc, noise     │
│ │ - Renderer      │ │   │ - out()          │
│ │ - Scene         │ │   │                  │
│ │ - Tick Manager  │ │   └──────────────────┘
│ └─────────────────┘ │
│                     │
│ ┌─────────────────┐ │
│ │ Presets         │ │
│ │ - threeTunnel   │ │
│ │ - blueVortex    │ │
│ │ - zippyZaps     │ │
│ │ - etc.          │ │
│ └─────────────────┘ │
└─────────────────────┘
          ↑
          │ Audio Refs
          │
┌─────────────────────────────────────────┐
│ Audio Processing                        │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ useAudioFeatures Hook             │   │
│ │ - Web Audio API                   │   │
│ │ - Frequency analysis              │   │
│ │ - BPM detection                   │   │
│ │ - Beat detection                  │   │
│ └───────────────────────────────────┘   │
│          ↓                              │
│ ┌───────────────────────────────────┐   │
│ │ BroadcastChannel                  │   │
│ │ - Sends audio features            │   │
│ │ - Sends beat triggers             │   │
│ │ - Cross-window communication      │   │
│ └───────────────────────────────────┘   │
│          ↓                              │
│ ┌───────────────────────────────────┐   │
│ │ audioRefs.js (Global State)       │   │
│ │ - bassRef.current                 │   │
│ │ - midRef.current                  │   │
│ │ - trebleRef.current               │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
          ↑
          │ Microphone Input
          │
     [🎤 User's Mic]
```

---

## 🔑 Core Components

### **1. VisualCanvas.jsx**
The engine orchestrator that manages both Three.js and Hydra.

**Responsibilities:**
- Initialize engines (singleton Three.js renderer, Hydra instance)
- Load/unload presets based on user selection
- Manage cleanup between preset switches
- Provide DOM containers for both engines

**Key Pattern:** Two `useEffect` hooks:
1. **Engine lifecycle** - Initializes/disposes engines when switching between Three.js ↔ Hydra
2. **Preset lifecycle** - Loads/unloads presets when user switches within same engine

**See:** [FLOW_DIAGRAMS.md](./FLOW_DIAGRAMS.md#visualcanvas-flow) for detailed flow.

---

### **2. init.js (Three.js Engine)**
Singleton engine that manages shared Three.js resources.

**Provides:**
- `useRenderer()` - Get the shared WebGL renderer
- `useScene()` - Get the shared scene
- `useCamera()` - Get the shared camera (optional)
- `useTick(callback)` - Subscribe to animation loop (60fps)
- `resetThreeState()` - Clear scene and dispose objects

**Why Singleton?**
- Only one WebGL context (browser limitations)
- Prevents memory leaks from multiple renderers
- Allows fast preset switching without reinitializing WebGL

**See:** [../src/core/three_presets/README.md](../src/core/three_presets/README.md) for preset development guide.

---

### **3. Three.js Presets**
Self-contained visual effects that use the singleton engine.

**Structure:**
```javascript
export function myPreset() {
    const renderer = useRenderer()  // Get shared resources
    const scene = useScene()
    
    // Create local objects
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial()
    
    // Subscribe to animation loop
    const cleanupTick = useTick(() => {
        renderer.render(scene, camera)
    })
    
    // Return cleanup function
    return () => {
        cleanupTick()           // Unsubscribe
        geometry.dispose()      // Free GPU memory
        material.dispose()
    }
}
```

**Key Pattern:** Each preset returns a cleanup function that VisualCanvas stores and calls when switching.

---

### **4. Audio Processing**
Real-time microphone analysis that drives visual reactivity.

**Pipeline:**
1. **Mic Input** → `getUserMedia()` captures audio
2. **Web Audio API** → Frequency analysis (FFT)
3. **Band Extraction** → Separate bass (20-140Hz), mid (140-400Hz), treble (400-2000Hz)
4. **Beat Detection** → Threshold-based beat triggers
5. **BPM Calculation** → Rolling average of beat intervals
6. **BroadcastChannel** → Send to all windows (main + settings)
7. **audioRefs** → Global state updated every frame

**Flow:**
```
Microphone → Web Audio API → Frequency Bands → audioRefs
                                    ↓
                              BroadcastChannel
                                    ↓
                    SettingsPanel (BPM display, controls)
                    App.jsx (beat triggers, auto-switch)
```

---

### **5. BroadcastChannel Communication**
Cross-window messaging between main app and settings panel.

**Messages:**
- `audioFeatures` - Audio data (bass, mid, treble, bpm) sent 60fps
- `beatDetected` - Trigger when beat detected
- `selectPreset` - User selected preset from settings
- `selectThree` - User selected Three.js preset
- `autoSwitchEnabled` - Auto-switch toggle changed
- `randomizePreset` - User clicked randomize button

**Why BroadcastChannel?**
- Settings panel opens in separate window (`window.open()`)
- Need to share state between windows
- More reliable than `postMessage` for same-origin communication

---

## 🎨 Preset Types

### **Three.js Presets (8 total)**
Located in: `src/core/three_presets/`

- **Full-screen shaders:** threeTunnel, blueVortex, zippyZaps
- **3D objects:** threeBloomIcosphere, ambientSphere, skull
- **Test/WIP:** maja, test997420

All follow singleton pattern (use shared renderer via `init.js`).

### **Hydra Presets (12 total)**
Located in: `src/hydra_presets/`

- Live-coding style visual synthesizer
- Use Hydra's global functions (osc, noise, modulate, etc.)
- Configured via `presets.js` array

---

## 🔄 Key Flows

### **Preset Switch Flow (Within Same Engine)**
```
User clicks preset
    ↓
VisualCanvas.selectedPreset changes
    ↓
useEffect #2 triggers
    ↓
React calls cleanup from previous render
    ↓
Previous preset:
    - Unsubscribes from tick
    - Disposes geometries/materials
    - Removes objects from scene
    ↓
resetThreeState() clears scene
    ↓
New preset loads:
    - Creates new objects
    - Subscribes to tick
    - Returns new cleanup function
    ↓
New preset renders at 60fps ✅
```

**See:** [FLOW_DIAGRAMS.md](./FLOW_DIAGRAMS.md#preset-switch-flow) for visual diagram.

---

### **Engine Switch Flow (Three.js ↔ Hydra)**
```
User switches engine
    ↓
VisualCanvas.selectedEngine changes
    ↓
useEffect #1 triggers
    ↓
React calls cleanup
    ↓
disposeEngine() destroys entire Three.js engine
disposeHydra() destroys Hydra instance
    ↓
setEngineReady(false) blocks preset loading
    ↓
Initialize new engine
    ↓
setEngineReady(true) allows preset loading
    ↓
useEffect #2 triggers (engineReady changed)
    ↓
Load first preset of new engine ✅
```

---

### **Cleanup Lifecycle**
```
Preset creates objects:
    geometry, material, mesh, camera
    ↓
Preset subscribes to tick:
    useTick(() => render())
    ↓
Preset returns cleanup function:
    return () => {
        cleanupTick()      // Unsubscribe
        dispose objects    // Free GPU memory
    }
    ↓
VisualCanvas stores cleanup:
    cleanupRef.current = cleanup
    ↓
User switches preset
    ↓
React calls: cleanupRef.current()
    ↓
Previous preset cleans up ✅
    ↓
New preset loads ✅
```

**Critical:** Without proper cleanup, memory leaks accumulate and browser crashes.

---

## 🐛 Common Issues & Solutions

### **Memory Leak**
**Symptom:** Performance degrades when switching presets rapidly.

**Causes:**
1. Preset doesn't return cleanup function
2. Cleanup doesn't call `cleanupTick()` (animation loop keeps running)
3. Cleanup doesn't dispose geometries/materials (GPU memory leak)

**Fix:** Follow checklist in [../src/core/three_presets/README.md](../src/core/three_presets/README.md)

---

### **Multiple Presets Rendering**
**Symptom:** Console shows multiple "rendering" logs, performance dies.

**Cause:** Previous preset's `useTick` not unsubscribed.

**Fix:** Ensure cleanup calls `cleanupTick()`:
```javascript
const cleanupTick = useTick(() => render())

return () => {
    cleanupTick()  // ← Must be called!
}
```

---

### **Shader Compilation Error**
**Symptom:** Black screen, console shows WebGL errors.

**Causes:**
1. Syntax error in GLSL shader
2. Uniform mismatch (JS ≠ GLSL)
3. Missing uniform updates

**Fix:**
1. Check browser console for shader errors
2. Verify uniform names match between JS and GLSL
3. Ensure uniforms updated every frame

---

### **Audio Not Reactive**
**Symptom:** Visuals don't respond to music.

**Causes:**
1. Microphone permission denied
2. `audioRefs` not being read in preset
3. Uniforms not updated in tick callback

**Fix:**
1. Check mic permission in browser
2. Import and use `bassRef.current` in preset
3. Update uniforms inside `useTick()` callback

---

## 📊 Performance Optimization

### **Current Bottlenecks**
1. All presets loaded upfront (no code splitting)
2. BroadcastChannel sends messages at 60fps (could throttle to 30fps)
3. No memoization in React components
4. Console logs in production build

**See:** [../ROADMAP.md](../ROADMAP.md) for optimization tasks.

---

### **Best Practices**
1. **Always dispose GPU resources** - geometry, material, textures
2. **Always unsubscribe from tick** - use `cleanupTick()`
3. **Use singleton renderer** - never create new `WebGLRenderer()`
4. **Profile with Chrome DevTools** - Memory tab to check for leaks
5. **Test rapid switching** - Switch presets 10+ times, check memory

---

## 🔧 Development Workflow

### **Adding a New Three.js Preset**
1. Create file in `src/core/three_presets/myPreset.js`
2. Follow template in [../src/core/three_presets/README.md](../src/core/three_presets/README.md)
3. Import in `VisualCanvas.jsx`
4. Add case to switch statement
5. Add to `presets.js` array with metadata
6. Test cleanup (switch rapidly, check memory)

### **Adding a New Hydra Preset**
1. Create file in `src/hydra_presets/myPreset.js`
2. Export function that uses Hydra globals
3. Add to `presets.js` array:
```javascript
{
    id: "myPreset",
    engine: "hydra",
    name: "My Preset",
    fn: () => myPreset(bassRef, midRef, trebleRef),
    preview: "path/to/thumbnail.png"
}
```
4. Test in app

---

## 🚀 Future Improvements

See [../ROADMAP.md](../ROADMAP.md) for complete task list.

**High Priority:**
- [ ] Replace global `audioRefs` with React Context
- [ ] Add error boundaries around VisualCanvas
- [ ] Implement code splitting for presets
- [ ] Add performance monitoring (Stats.js)

**Nice to Have:**
- [ ] Preset favorites system
- [ ] Keyboard shortcuts
- [ ] MIDI controller support (partial implementation exists)
- [ ] Preset recording/export

---

## 📚 Learning Resources

**Three.js:**
- [Official Docs](https://threejs.org/docs/)
- [Three.js Fundamentals](https://threejs.org/manual/)

**WebGL Shaders:**
- [The Book of Shaders](https://thebookofshaders.com/)
- [Shadertoy](https://www.shadertoy.com/)

**Hydra:**
- [Hydra Book](https://hydra-book.glitch.me/)
- [Hydra Examples](https://hydra.ojack.xyz/?sketch_id=example_0)

**Web Audio API:**
- [MDN Web Audio Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)


**Last Updated:** 2025-11-29  
**Version:** 2.0 (Post-memory-leak-fixes)
