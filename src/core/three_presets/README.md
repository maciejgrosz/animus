# Three.js Presets - Architecture Documentation

## 📋 Overview

This directory contains Three.js visual presets for the Animus VJ Tool. Each preset is a self-contained visual effect that uses WebGL shaders and Three.js to create audio-reactive graphics.

## 🏗️ Architecture Pattern: Singleton Renderer

All presets follow the **singleton pattern** - they share a single WebGL renderer, scene, and animation loop managed by `init.js`. This prevents memory leaks and ensures optimal performance.

---

## 🎯 Preset Structure

Every preset follows this standard structure:

```javascript
import * as THREE from 'three'
import { bassRef, midRef, trebleRef } from '@core/audioRefs'
import fragmentShader from '../../shaders/myShader.frag?raw'
import {
    useRenderer,
    useScene,
    useCamera,     // Optional: use shared camera
    useRenderSize,
    useTick
} from '@core/engine/init.js'

export function myPreset() {
    // 1. Get singleton resources
    const renderer = useRenderer()
    const scene = useScene()
    const { width, height } = useRenderSize()
    
    // 2. Safety check (optional but recommended)
    if (!scene || !renderer) {
        console.warn('[myPreset] Renderer or scene not initialized')
        return () => {}
    }
    
    // 3. Clean slate - remove previous preset's objects
    scene.clear()
    scene.background = null
    scene.fog = null
    
    // 4. Create your camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 5
    scene.add(camera)
    
    // 5. Create shader uniforms (data sent to GPU)
    const uniforms = {
        iResolution: { value: new THREE.Vector2(width, height) },
        iTime: { value: 0 },
        uBass: { value: 0 },
        uMid: { value: 0 },
        uTreble: { value: 0 }
    }
    
    // 6. Create material with shaders
    const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader
    })
    
    // 7. Create geometry and mesh
    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    
    // 8. Create animation clock
    const clock = new THREE.Clock()
    
    // 9. Subscribe to animation loop (60fps)
    const cleanupTick = useTick(() => {
        // Update uniforms every frame
        uniforms.iTime.value = clock.getElapsedTime()
        uniforms.uBass.value = bassRef.current
        uniforms.uMid.value = midRef.current
        uniforms.uTreble.value = trebleRef.current
        
        // Render the scene
        renderer.render(scene, camera)
    })
    
    // 10. Return cleanup function (CRITICAL!)
    return () => {
        cleanupTick()           // Unsubscribe from animation loop
        scene.remove(mesh)      // Remove from scene graph
        scene.remove(camera)    // Remove camera
        geometry.dispose()      // Free GPU memory (vertices)
        material.dispose()      // Free GPU memory (shader program)
    }
}
```

---

## 🔄 Animation Flow

```
┌─────────────────────────────────────────────────────┐
│  init.js (Singleton Engine)                         │
│  ┌─────────────────────────────────────────┐        │
│  │ Tick Manager (60fps animation loop)     │        │
│  │ - Manages list of subscribers           │        │
│  │ - Calls each subscriber every frame     │        │
│  └─────────────────────────────────────────┘        │
│                                                      │
│  ┌─────────────────────────────────────────┐        │
│  │ Singleton Resources (shared by all)     │        │
│  │ - ONE WebGL renderer                    │        │
│  │ - ONE scene (object container)          │        │
│  │ - ONE camera (optional shared)          │        │
│  └─────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────┘
                      ↑         ↑
                      │         │
          useRenderer()│         │useTick(callback)
          useScene()  │         │
                      │         │
┌─────────────────────┴─────────┴─────────────────────┐
│  myPreset.js (Subscriber)                           │
│                                                      │
│  1. Get shared renderer/scene                       │
│  2. Clear scene                                     │
│  3. Create objects (camera, mesh, material)         │
│  4. useTick(() => {                                 │
│       uniforms.iTime.value = time  ──────────┐      │
│       renderer.render(scene, camera)         │      │
│     })                                       │      │
│  5. return cleanup()                         │      │
└──────────────────────────────────────────────┼──────┘
                                               │
                                               ↓
                            ┌──────────────────────────┐
                            │  GPU Shader (.frag file) │
                            │  - Reads uniforms        │
                            │  - Calculates colors     │
                            │  - Draws pixels          │
                            └──────────────────────────┘
```

---

## 📦 Key Concepts

### **1. Singleton Renderer**

All presets share ONE WebGL renderer:

```javascript
const renderer = useRenderer()  // Returns the same renderer for all presets
```

**Why?**
- Creating multiple WebGL contexts is expensive
- Browser limits number of contexts (typically 8-16)
- Prevents memory leaks

**❌ DON'T:**
```javascript
const renderer = new THREE.WebGLRenderer()  // Creates duplicate renderer!
```

---

### **2. Subscription Pattern**

Presets subscribe to the animation loop via `useTick()`:

```javascript
const cleanupTick = useTick(() => {
    // This runs 60 times per second
    renderer.render(scene, camera)
})

// Later, when preset switches:
cleanupTick()  // Unsubscribes (stops running)
```

**How it works:**
- Tick manager keeps a list of subscribers
- Each frame, it calls all subscribers
- `cleanupTick()` removes you from the list

**Why this prevents leaks:**
```javascript
// Without cleanup:
Load preset A → useTick subscribes → 1 subscriber
Switch to preset B → useTick subscribes → 2 subscribers (A still running!)
Switch to preset C → useTick subscribes → 3 subscribers (A, B still running!)
❌ All presets running simultaneously!

// With cleanup:
Load preset A → useTick subscribes → 1 subscriber
Switch to preset B → cleanupTick() unsubscribes A → 1 subscriber (only B)
Switch to preset C → cleanupTick() unsubscribes B → 1 subscriber (only C)
✅ Only current preset running!
```

---

### **3. Scene Management**

```javascript
scene.clear()       // Removes objects from scene graph
scene.background = null
scene.fog = null
```

**Important:** `scene.clear()` does NOT free GPU memory!

You must also call:
```javascript
geometry.dispose()   // Frees vertex data from GPU
material.dispose()   // Frees shader program from GPU
```

**Think of it as:**
- `scene.clear()` = Remove furniture from room (room still exists)
- `dispose()` = Throw furniture away (free memory)

---

### **4. Uniforms (CPU → GPU Communication)**

Uniforms are variables sent from JavaScript to your shader:

```javascript
// JavaScript side (CPU)
const uniforms = {
    iTime: { value: 0 },      // Animation time
    uBass: { value: 0.5 }     // Audio data
}

// Update every frame
uniforms.iTime.value = clock.getElapsedTime()
uniforms.uBass.value = bassRef.current

// GLSL shader side (GPU)
uniform float iTime;
uniform float uBass;

void main() {
    // Use iTime for animation
    // Use uBass for audio reactivity
}
```

**Uniforms are HOW you make shaders audio-reactive!**

---

### **5. Cleanup (CRITICAL!)**

Every preset MUST return a cleanup function:

```javascript
return () => {
    cleanupTick()           // 1. Stop animation loop
    scene.remove(mesh)      // 2. Remove from scene graph
    scene.remove(camera)    // 3. Remove camera
    geometry.dispose()      // 4. Free GPU memory (vertices)
    material.dispose()      // 5. Free GPU memory (shader)
}
```

**Order matters:**
1. Unsubscribe first (stops updates)
2. Remove from scene (breaks references)
3. Dispose GPU resources (free memory)

**Without cleanup:**
- Memory leaks (GPU memory fills up)
- Performance degradation
- Eventually browser crashes

---

## 🎨 Shader Types

### **Full-Screen Quad Shader**
For effects that cover the entire screen (tunnels, fractals, etc.):

```javascript
const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10)
const geometry = new THREE.PlaneGeometry(2, 2)  // 2x2 fills screen
```

**Examples:** `zippyZaps`, `threeTunnel`, `blueVortex`

---

### **3D Object Shader**
For effects on 3D models (icospheres, cubes, etc.):

```javascript
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
const geometry = new THREE.IcosahedronGeometry(1, 4)
```

**Examples:** `threeBloomIcosphere`, `ambientSphere`, `skull`

---

## 📊 Audio Integration

Presets read audio data from global refs:

```javascript
import { bassRef, midRef, trebleRef } from '@core/audioRefs'

// In useTick callback:
uniforms.uBass.value = bassRef.current     // 0-1 range
uniforms.uMid.value = midRef.current       // 0-1 range
uniforms.uTreble.value = trebleRef.current // 0-1 range
```

**Audio smoothing (optional):**
```javascript
let smoothedBass = 0

// In useTick:
const smoothingFactor = 0.05
smoothedBass += (bassRef.current - smoothedBass) * smoothingFactor
uniforms.uBass.value = smoothedBass  // Smoother, less jittery
```

---

## ✅ Checklist for New Presets

When creating a new preset, ensure:

- [ ] Uses `useRenderer()` (NOT `new THREE.WebGLRenderer()`)
- [ ] Uses `useScene()` (NOT `new THREE.Scene()`)
- [ ] Calls `scene.clear()` at start
- [ ] Creates all objects locally (camera, mesh, material)
- [ ] Subscribes to animation loop with `useTick()`
- [ ] Updates uniforms every frame
- [ ] Returns cleanup function
- [ ] Cleanup calls `cleanupTick()`
- [ ] Cleanup disposes geometries (`geometry.dispose()`)
- [ ] Cleanup disposes materials (`material.dispose()`)
- [ ] Cleanup removes objects (`scene.remove(mesh)`)
- [ ] No `requestAnimationFrame()` loops (use `useTick` instead)

---

## 🐛 Common Mistakes

### ❌ Creating Own Renderer
```javascript
// WRONG - Creates memory leak
const renderer = new THREE.WebGLRenderer()
container.appendChild(renderer.domElement)
```

✅ **Fix:** Use singleton
```javascript
const renderer = useRenderer()
```

---

### ❌ Using requestAnimationFrame
```javascript
// WRONG - Can't be cancelled properly
function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate()
```

✅ **Fix:** Use useTick
```javascript
const cleanupTick = useTick(() => {
    renderer.render(scene, camera)
})
```

---

### ❌ Missing Cleanup
```javascript
// WRONG - Memory leak
return () => {
    // Nothing here!
}
```

✅ **Fix:** Complete cleanup
```javascript
return () => {
    cleanupTick()
    geometry.dispose()
    material.dispose()
    scene.remove(mesh)
}
```

---

### ❌ Disposing Singleton Renderer
```javascript
// WRONG - Breaks other presets
return () => {
    renderer.dispose()  // Don't dispose shared renderer!
}
```

✅ **Fix:** Only dispose your own resources
```javascript
return () => {
    geometry.dispose()   // Only dispose what you created
    material.dispose()
}
```

---

## 📚 Reference Presets

**Good examples to learn from:**

- **`threeTunnel.js`** - Full-screen shader preset (simple, clean)
- **`blueVortex.js`** - Multi-band audio reactivity
- **`zippyZaps.js`** - Audio smoothing example
- **`threeBloomIcosphere.js`** - 3D object with post-processing

**Fixed presets (previously had memory leaks):**
- ~~`maja.js`~~ - Now uses singleton pattern ✅
- ~~`test997420.js`~~ - Now uses singleton pattern ✅

---

## 🔧 Debugging Tips

**Memory leak?**
1. Open Chrome DevTools → Performance → Memory
2. Switch between presets rapidly
3. If memory keeps growing → missing cleanup

**Multiple presets rendering?**
1. Add `console.log('rendering', presetName)` in useTick
2. Switch presets
3. If multiple logs appear → cleanup not called

**Shader not working?**
1. Check browser console for shader compilation errors
2. Verify uniforms are defined in both JS and GLSL
3. Use `console.log(uniforms)` to debug values

---

## 🚀 Performance Tips

1. **Dispose everything** - GPU memory is limited
2. **Use lower polygon counts** - Less vertices = better performance
3. **Simplify shaders** - Complex math in shaders is expensive
4. **Throttle updates** - Don't update every uniform every frame if not needed
5. **Profile with DevTools** - Use Chrome's performance profiler

---

## 📖 Further Reading

- [Three.js Documentation](https://threejs.org/docs/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [The Book of Shaders](https://thebookofshaders.com/)
- [Shadertoy](https://www.shadertoy.com/) - Shader examples

---

**Last Updated:** 2025-11-29  
**Architecture Version:** Singleton Pattern (v2)
