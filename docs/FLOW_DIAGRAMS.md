# Flow Diagrams

Visual diagrams showing key operations in the Animus system.

---

## Table of Contents
- [VisualCanvas Flow](#visualcanvas-flow)
- [Preset Switch Flow](#preset-switch-flow)
- [Engine Switch Flow](#engine-switch-flow)
- [Cleanup Lifecycle](#cleanup-lifecycle)
- [Audio Processing Pipeline](#audio-processing-pipeline)
- [Tick Manager Subscription](#tick-manager-subscription)

---

## VisualCanvas Flow

Complete flow of how VisualCanvas manages engines and presets.

```
┌────────────────────────────────────────────────────────────────┐
│                    VisualCanvas Component                      │
└────────────────────────────────────────────────────────────────┘
                              │
                              ↓
        ┌─────────────────────────────────────────┐
        │  Props: selectedEngine, selectedPreset  │
        └─────────────────────────────────────────┘
                              │
         ┌────────────────────┴────────────────────┐
         │                                         │
         ↓                                         ↓
┌──────────────────┐                    ┌───────────────────┐
│  useEffect #1    │                    │   useEffect #2    │
│  Dependencies:   │                    │   Dependencies:   │
│  [selectedEngine]│                    │   [engineReady,   │
└──────────────────┘                    │    selectedEngine,│
         │                              │    selectedPreset]│
         │                              └───────────────────┘
         │                                        │
         ↓                                        │
   setEngineReady(false)                         │
         │                                        │
         ↓                                        │
   ┌──────────────┐                              │
   │ Three.js?    │                              │
   └──────────────┘                              │
    Yes │     │ No                                │
        │     └──────────┐                       │
        ↓                ↓                        │
  initEngine(...)   setEngineReady(true)         │
  (async)                                        │
        │                                        │
        ↓                                        │
  setEngineReady(true) ──────────────────────────┤
                                                 │
                                                 ↓
                                        if (!engineReady) return
                                                 │
                                                 ↓
                                         resetThreeState()
                                                 │
                                                 ↓
                                        ┌────────────────┐
                                        │ Load Preset    │
                                        │ (switch/case)  │
                                        └────────────────┘
                                                 │
                                                 ↓
                                        cleanup = preset()
                                                 │
                                                 ↓
                                        cleanupRef.current = cleanup
                                                 │
                                                 ↓
                                        return () => {
                                            cleanupRef.current()
                                        }
```

---

## Preset Switch Flow

What happens when user switches from Preset A to Preset B (same engine).

```
User clicks "Preset B"
        │
        ↓
┌───────────────────┐
│ selectedPreset    │
│ changes:          │
│ "presetA" →       │
│ "presetB"         │
└───────────────────┘
        │
        ↓
┌───────────────────────────────────────────┐
│ useEffect #2 Dependencies Change          │
│ [engineReady, selectedEngine, selectedPreset] │
└───────────────────────────────────────────┘
        │
        ↓
┌───────────────────────────────────────────┐
│ React Cleanup Phase                       │
│ Calls: return () => cleanupRef.current()  │
└───────────────────────────────────────────┘
        │
        ↓
┌─────────────────────────────────────┐
│ Preset A Cleanup Runs               │
│                                     │
│ 1. cleanupTick()                    │
│    - Unsubscribes from tick manager │
│    - Stops 60fps render loop        │
│                                     │
│ 2. geometry.dispose()               │
│    - Frees GPU vertex data          │
│                                     │
│ 3. material.dispose()               │
│    - Frees GPU shader program       │
│                                     │
│ 4. scene.remove(mesh, camera)       │
│    - Removes from scene graph       │
└─────────────────────────────────────┘
        │
        ↓
┌─────────────────────────────────────┐
│ resetThreeState()                   │
│ - Extra safety clear                │
│ - Disposes any missed objects       │
│ - Removes all scene children        │
│ - Disposes post-processing passes   │
└─────────────────────────────────────┘
        │
        ↓
┌─────────────────────────────────────┐
│ Load Preset B                       │
│                                     │
│ switch (selectedPreset) {           │
│   case "presetB":                   │
│     cleanup = presetB()             │
│ }                                   │
└─────────────────────────────────────┘
        │
        ↓
┌─────────────────────────────────────┐
│ Preset B Initialization             │
│                                     │
│ 1. useRenderer(), useScene()        │
│    - Gets singleton resources       │
│                                     │
│ 2. scene.clear()                    │
│    - Clears scene                   │
│                                     │
│ 3. Create objects                   │
│    - new Camera()                   │
│    - new Geometry()                 │
│    - new Material()                 │
│    - new Mesh()                     │
│                                     │
│ 4. useTick(() => render())          │
│    - Subscribe to animation loop    │
│                                     │
│ 5. return cleanup function          │
└─────────────────────────────────────┘
        │
        ↓
┌─────────────────────────────────────┐
│ cleanupRef.current = cleanup        │
│ (Store Preset B cleanup for later)  │
└─────────────────────────────────────┘
        │
        ↓
   Preset B now rendering at 60fps ✅
```

**Timeline:**
```
0ms   - User clicks
10ms  - React triggers cleanup
11ms  - Preset A unsubscribes from tick
12ms  - Preset A disposes GPU resources
15ms  - resetThreeState() clears scene
20ms  - Preset B initializes
25ms  - Preset B subscribes to tick
26ms  - Preset B starts rendering ✅
```

---

## Engine Switch Flow

What happens when user switches from Three.js to Hydra (or vice versa).

```
User clicks "Switch to Hydra"
        │
        ↓
┌───────────────────┐
│ selectedEngine    │
│ changes:          │
│ "three" → "hydra" │
└───────────────────┘
        │
        ↓
┌───────────────────────────────────────────┐
│ useEffect #1 Dependencies Change          │
│ [selectedEngine]                          │
└───────────────────────────────────────────┘
        │
        ↓
┌───────────────────────────────────────────┐
│ React Cleanup Phase                       │
│ Calls: return () => {                     │
│   disposeEngine()                         │
│   disposeHydra()                          │
│ }                                         │
└───────────────────────────────────────────┘
        │
        ↓
┌─────────────────────────────────────┐
│ disposeEngine()                     │
│                                     │
│ 1. Remove renderer canvas from DOM  │
│ 2. renderer.dispose()               │
│    - Destroys WebGL context         │
│ 3. Dispose all post-processing      │
│ 4. Remove event listeners           │
│ 5. Clear scene                      │
│ 6. Set initialized = false          │
└─────────────────────────────────────┘
        │
        ↓
┌─────────────────────────────────────┐
│ disposeHydra()                      │
│                                     │
│ 1. hydra.stop()                     │
│ 2. Remove canvas                    │
│ 3. Clear global functions           │
└─────────────────────────────────────┘
        │
        ↓
┌─────────────────────────────────────┐
│ useEffect #1 Setup Phase            │
│                                     │
│ setEngineReady(false)               │
│   - Blocks preset loading           │
└─────────────────────────────────────┘
        │
        ↓
┌─────────────────────────────────────┐
│ Initialize New Engine (Hydra)      │
│                                     │
│ if (selectedEngine === "hydra") {   │
│   setEngineReady(true)              │
│   // Hydra doesn't need async init  │
│ }                                   │
└─────────────────────────────────────┘
        │
        ↓
┌─────────────────────────────────────┐
│ engineReady = true                  │
│   - Triggers useEffect #2           │
└─────────────────────────────────────┘
        │
        ↓
┌─────────────────────────────────────┐
│ useEffect #2 Runs                   │
│                                     │
│ if (selectedEngine === "hydra") {   │
│   initHydra(canvas)                 │
│   applyPreset(hydraPreset.fn)       │
│ }                                   │
└─────────────────────────────────────┘
        │
        ↓
   Hydra engine now running ✅
```

**Key Difference from Preset Switch:**
- **Entire engine disposed** (not just preset cleanup)
- **WebGL context destroyed** and recreated
- **More expensive operation** (100-200ms vs 10-20ms)

---

## Cleanup Lifecycle

Complete lifecycle of a preset from creation to disposal.

```
┌─────────────────────────────────────────────────────────────┐
│                    Preset Lifecycle                         │
└─────────────────────────────────────────────────────────────┘

1. CREATION PHASE
   ────────────────
   User selects preset
        │
        ↓
   VisualCanvas calls preset function:
   cleanup = createTunnel()
        │
        ↓
   ┌──────────────────────────────────┐
   │ Inside createTunnel():           │
   │                                  │
   │ // Get singleton resources       │
   │ const renderer = useRenderer()   │
   │ const scene = useScene()         │
   │                                  │
   │ // Create local objects          │
   │ const geometry = new Geometry()  │
   │ const material = new Material()  │
   │ const mesh = new Mesh(...)       │
   │                                  │
   │ // Subscribe to animation        │
   │ const cleanup = useTick(() => {  │
   │   renderer.render(scene, camera) │
   │ })                               │
   │                                  │
   │ // Return cleanup function       │
   │ return () => {                   │
   │   cleanup()                      │
   │   geometry.dispose()             │
   │   material.dispose()             │
   │   scene.remove(mesh)             │
   │ }                                │
   └──────────────────────────────────┘
        │
        │ Returns cleanup function
        ↓
   cleanupRef.current = cleanup
   (Stored for later use)


2. ACTIVE PHASE
   ─────────────
   Preset is rendering at 60fps
        │
        ↓
   Every frame (16.67ms):
        │
        ↓
   Tick Manager calls all subscribers
        │
        ↓
   Preset's useTick callback runs:
        │
        ↓
   ┌──────────────────────────────────┐
   │ useTick(() => {                  │
   │   uniforms.iTime.value = time    │
   │   uniforms.uBass.value = bass    │
   │   renderer.render(scene, camera) │
   │ })                               │
   └──────────────────────────────────┘
        │
        ↓
   GPU renders frame
        │
        ↓
   [Loop continues...]


3. DISPOSAL PHASE
   ───────────────
   User switches to different preset
        │
        ↓
   React cleanup triggers:
   cleanupRef.current()
        │
        ↓
   Preset's cleanup function runs:
        │
        ↓
   ┌──────────────────────────────────┐
   │ 1. cleanup()                     │
   │    │                             │
   │    ↓                             │
   │    Calls useTick cleanup         │
   │    │                             │
   │    ↓                             │
   │    Removes from tick subscribers │
   │    │                             │
   │    ↓                             │
   │    ✅ Animation loop stopped     │
   │                                  │
   │ 2. geometry.dispose()            │
   │    │                             │
   │    ↓                             │
   │    Frees GPU vertex buffers      │
   │    │                             │
   │    ↓                             │
   │    ✅ GPU memory freed           │
   │                                  │
   │ 3. material.dispose()            │
   │    │                             │
   │    ↓                             │
   │    Frees GPU shader program      │
   │    │                             │
   │    ↓                             │
   │    ✅ Shader compiled released   │
   │                                  │
   │ 4. scene.remove(mesh)            │
   │    │                             │
   │    ↓                             │
   │    Removes from scene graph      │
   │    │                             │
   │    ↓                             │
   │    ✅ Object dereferenced        │
   └──────────────────────────────────┘
        │
        ↓
   ✅ Preset fully cleaned up
   ✅ No memory leaks
   ✅ No lingering animations
```

**What Happens Without Proper Cleanup:**

```
❌ WITHOUT cleanup():
   - useTick callback keeps running forever
   - Renders on top of new preset
   - Multiple presets rendering simultaneously
   - Performance death

❌ WITHOUT dispose():
   - GPU memory fills up
   - Textures/geometries accumulate
   - Browser eventually runs out of memory
   - WebGL context lost

❌ WITHOUT scene.remove():
   - Objects stay in scene graph
   - Increase traversal time
   - Picking/raycasting breaks
   - Memory not freed by GC
```

---

## Audio Processing Pipeline

How audio flows from microphone to visual presets.

```
┌─────────────────┐
│  🎤 Microphone  │
│  User's audio   │
│  input          │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────────────┐
│ navigator.mediaDevices.getUserMedia()   │
│ - Request mic permission                │
│ - Create MediaStream                    │
└────────┬────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────┐
│ Web Audio API                           │
│                                         │
│ AudioContext                            │
│    ↓                                    │
│ MediaStreamSource                       │
│    ↓                                    │
│ AnalyserNode (FFT)                      │
│    ↓                                    │
│ getByteFrequencyData()                  │
│    - Returns 0-255 values               │
│    - 512 frequency bins                 │
└────────┬────────────────────────────────┘
         │
         ↓
┌─────────────────────────────────────────┐
│ Frequency Band Extraction               │
│ (useAudioFeatures hook)                 │
│                                         │
│ getBandEnergy(data, lowHz, highHz)      │
│    ↓                 ↓         ↓        │
│ Bass (20-140Hz)  Mid (140-400Hz)        │
│                  Treble (400-2000Hz)    │
│    │                 │         │        │
│    └────────┬────────┴─────────┘        │
│             ↓                           │
│    Normalize to 0-1 range               │
│    Apply sensitivity multiplier         │
└────────┬────────────────────────────────┘
         │
         ├──────────────────┬─────────────────┐
         ↓                  ↓                 ↓
┌────────────────┐  ┌──────────────┐  ┌──────────────┐
│ Beat Detection │  │ BPM Tracking │  │ audioRefs    │
│                │  │              │  │              │
│ if (bass >     │  │ Beat         │  │ bassRef      │
│   threshold) { │  │ intervals    │  │ .current = X │
│   BEAT!        │  │    ↓         │  │              │
│ }              │  │ Rolling avg  │  │ midRef       │
│                │  │    ↓         │  │ .current = Y │
│                │  │ BPM = 60000/ │  │              │
│                │  │   interval   │  │ trebleRef    │
│                │  │              │  │ .current = Z │
└───────┬────────┘  └──────┬───────┘  └──────┬───────┘
        │                  │                 │
        └──────────┬───────┴─────────────────┘
                   ↓
         ┌─────────────────────┐
         │ BroadcastChannel    │
         │ "animus-control"    │
         │                     │
         │ postMessage({       │
         │   type: "audio      │
         │     Features",      │
         │   value: {          │
         │     bass,           │
         │     mid,            │
         │     treble,         │
         │     bpm             │
         │   }                 │
         │ })                  │
         └─────────┬───────────┘
                   │
         ┌─────────┴─────────────────────┐
         │                               │
         ↓                               ↓
┌─────────────────┐           ┌──────────────────┐
│ App.jsx         │           │ SettingsPanel    │
│ (Main Window)   │           │ (Popup Window)   │
│                 │           │                  │
│ - Auto-switch   │           │ - Display BPM    │
│   on beat       │           │ - Show levels    │
│ - Randomize     │           │ - Sensitivity    │
│                 │           │   controls       │
└─────────┬───────┘           └──────────────────┘
          │
          ↓
┌─────────────────────────────────┐
│ Three.js / Hydra Presets        │
│                                 │
│ // In useTick callback:         │
│ uniforms.uBass.value =          │
│   bassRef.current               │
│                                 │
│ uniforms.uMid.value =           │
│   midRef.current                │
│                                 │
│ // GPU shader reads uniforms    │
│ // and creates audio-reactive   │
│ // visuals                      │
└─────────────────────────────────┘
```

**Frame Timing:**
```
Frame 0   (0ms):   Mic sample → FFT → Extract bands → Update refs → Render
Frame 1  (16ms):   Mic sample → FFT → Extract bands → Update refs → Render
Frame 2  (33ms):   Mic sample → FFT → Extract bands → Update refs → Render
...
(Repeats at 60fps)
```

---

## Tick Manager Subscription

How presets subscribe/unsubscribe from the animation loop.

```
┌────────────────────────────────────────────────────────┐
│                 Tick Manager (tick-manager.js)         │
│                                                        │
│  subscribers = []  ← List of callback functions       │
│                                                        │
│  function startLoop() {                               │
│    requestAnimationFrame(() => {                      │
│      // Call all subscribers                          │
│      subscribers.forEach(callback => callback())      │
│      startLoop()  // Loop forever                     │
│    })                                                 │
│  }                                                    │
└────────────────────────────────────────────────────────┘
                    ↑                       ↑
                    │                       │
         ┌──────────┘                       └──────────┐
         │ useTick()                                   │ cleanup()
         │                                             │
┌────────┴─────────────────────┐    ┌─────────────────┴────────┐
│ Preset Subscribes            │    │ Preset Unsubscribes      │
│                              │    │                          │
│ const cleanup = useTick(() =>│    │ cleanup()                │
│   render()                   │    │   ↓                      │
│ })                           │    │ Remove from subscribers  │
│   ↓                          │    │                          │
│ subscribers.push(callback)   │    │ subscribers =            │
│                              │    │   subscribers.filter()   │
└──────────────────────────────┘    └──────────────────────────┘


EXAMPLE: Multiple Presets (BAD - without cleanup)
─────────────────────────────────────────────────

Load Preset A:
subscribers = [presetA_callback]

Load Preset B (without calling cleanup):
subscribers = [presetA_callback, presetB_callback]
              ↑ Still here!    ↑ Added

Load Preset C (without calling cleanup):
subscribers = [presetA_callback, presetB_callback, presetC_callback]
              ↑ Accumulating!

Every frame (16ms):
  presetA_callback() → render A  ❌ Wasted work
  presetB_callback() → render B  ❌ Wasted work
  presetC_callback() → render C  ✅ Only this should run!

Result: 3× the work, performance death 💀


EXAMPLE: Proper Cleanup (GOOD)
───────────────────────────────

Load Preset A:
subscribers = [presetA_callback]

Load Preset B:
1. Call cleanup from Preset A
   subscribers = []  ← Cleared
2. Subscribe Preset B
   subscribers = [presetB_callback]

Load Preset C:
1. Call cleanup from Preset B
   subscribers = []  ← Cleared
2. Subscribe Preset C
   subscribers = [presetC_callback]

Every frame:
  presetC_callback() → render C  ✅ Only current preset!

Result: Optimal performance ✅
```

**Visual Timeline:**

```
Preset A lifecycle:
════════════════════════════════════════════════════════
useTick()          Active (60fps)         cleanup()
    │──────────────────────────────────────────│
    └─ subscribed                      unsubscribed ─┘
                                                ↓
Preset B lifecycle:
════════════════════════════════════════════════════════
                                        useTick()
                                            │─────────...
                                            └─ subscribed


Without cleanup:
════════════════════════════════════════════════════════
Preset A: │═══════════════════════════════════════════...
          └─ Never unsubscribed! Keeps running forever ❌

Preset B:                                   │═══════════...
                                            └─ Also running

Both running simultaneously! 💀
```

---

## Memory Leak Visualization

What happens with and without proper cleanup.

```
GOOD CLEANUP:
═════════════

Memory Usage Over Time (switching presets every 5 seconds):

MB
100 ┤
 90 ┤  ╭╮      ╭╮      ╭╮      ╭╮
 80 ┤  ││      ││      ││      ││
 70 ┤  ││      ││      ││      ││
 60 ┤  ││      ││      ││      ││
 50 ┤╭╮││╭╮  ╭╮││╭╮  ╭╮││╭╮  ╭╮││╭╮
 40 ┤│╰╯╰╯│  │╰╯╰╯│  │╰╯╰╯│  │╰╯╰╯│
 30 ┤│    │  │    │  │    │  │    │
 20 ┤│    │  │    │  │    │  │    │
 10 ┤│    │  │    │  │    │  │    │
  0 ┼┴────┴──┴────┴──┴────┴──┴────┴──▶ Time
    0s   5s  10s  15s  20s  25s  30s

Memory spikes when loading, drops after cleanup ✅
Stable baseline, no accumulation ✅


BAD - NO CLEANUP:
═════════════════

MB
100 ┤                                    ╭─
 90 ┤                               ╭───╯
 80 ┤                          ╭───╯
 70 ┤                     ╭───╯
 60 ┤                ╭───╯
 50 ┤           ╭───╯
 40 ┤      ╭───╯
 30 ┤ ╭───╯
 20 ┤╭╯
 10 ┤│
  0 ┼┴──────────────────────────────────▶ Time
    0s   5s  10s  15s  20s  25s  30s
                                    ↑
                              CRASH! 💀

Memory continuously accumulates ❌
Each preset adds to the pile ❌
Eventually runs out of memory ❌
```

---

**See also:**
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System overview
- [../src/core/three_presets/README.md](../src/core/three_presets/README.md) - Preset development guide

---

**Last Updated:** 2025-11-29
