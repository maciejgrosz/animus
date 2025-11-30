# Animus VJ Tool - Improvement Roadmap

This roadmap addresses performance issues, architectural improvements, and feature enhancements.

## 🚨 Critical Priority (Fix ASAP)

### 1. Fix Three.js Memory Leaks & Cleanup
**Label**: `bug`, `performance`, `critical`  
**Effort**: 2-3 days

**Problem**: Mixed renderer lifecycle patterns causing memory leaks when switching presets.

**Current Issues**:
- Some presets create their own renderer (e.g., `zippyZaps.js`)
- `init.js` uses singleton pattern
- Inconsistent cleanup logic across presets
- Memory accumulates with each preset switch

**Solution**:
- [ ] Choose ONE pattern: singleton renderer (recommended) OR per-preset renderers
- [ ] Audit all files in `three_presets/`: threeTunnel, threeBloomIcosphere, ambientSphere, blueVortex, skull, zippyZaps, maja, test997420
- [ ] Ensure proper disposal: geometries, materials, textures, render passes
- [ ] Use `resetThreeState()` consistently before each preset
- [ ] Add memory profiling to verify fixes

**Files to modify**:
- `src/core/engine/init.js`
- `src/core/VisualCanvas.jsx`
- All files in `src/core/three_presets/*.js`

---

### 2. Audit & Fix All Three.js Preset Cleanup
**Label**: `bug`, `performance`, `critical`  
**Effort**: 1-2 days

**Checklist** (verify each preset):
- [ ] `threeTunnel.js` - returns proper cleanup function
- [ ] `threeBloomIcosphere.js` - disposes geometry/material/passes
- [ ] `ambientSphere.js` - removes event listeners
- [ ] `blueVortex.js` - disposes shader materials
- [ ] `skull.js` - disposes loaded models/textures
- [ ] `zippyZaps.js` - CRITICAL: creates own renderer, needs refactor
- [ ] `maja.js` - cleanup verification
- [ ] `test997420.js` - cleanup verification

**Cleanup checklist per preset**:
```javascript
return () => {
    // 1. Dispose geometries
    geometry?.dispose()
    
    // 2. Dispose materials (including shader materials)
    material?.dispose()
    
    // 3. Dispose textures
    texture?.dispose()
    
    // 4. Remove meshes from scene
    scene.remove(mesh)
    
    // 5. Dispose post-processing passes
    pass?.dispose()
    
    // 6. Remove event listeners
    window.removeEventListener('resize', handleResize)
    
    // 7. Cancel animation frames
    cancelAnimationFrame(animationId)
}
```

---

### 3. Replace Global Refs with React Context
**Label**: `refactor`, `architecture`, `high-priority`  
**Effort**: 1 day

**Problem**: `audioRefs.js` exports mutable global objects, violating React principles.

**Current Code** (bad):
```javascript
export const bassRef = { current: 0 };
export const midRef = { current: 0 };
export const trebleRef = { current: 0 };
```

**Solution**: Create Context API provider

**Implementation Steps**:
- [ ] Create `src/contexts/AudioContext.jsx`
- [ ] Move audio refs into context state
- [ ] Wrap app with `<AudioProvider>`
- [ ] Update all consumers with `useAudio()` hook
- [ ] Remove `audioRefs.js`

**Files to update**:
- `src/App.jsx`
- `src/core/presets.js`
- All `src/core/three_presets/*.js`
- All `src/hydra_presets/*.js`
- `src/hooks/useAudioFeatures.js`

**Example Context**:
```javascript
// src/contexts/AudioContext.jsx
import { createContext, useContext, useRef } from 'react';

const AudioContext = createContext();

export function AudioProvider({ children }) {
    const bassRef = useRef(0);
    const midRef = useRef(0);
    const trebleRef = useRef(0);
    const amplitudeRef = useRef(0);
    
    return (
        <AudioContext.Provider value={{ bassRef, midRef, trebleRef, amplitudeRef }}>
            {children}
        </AudioContext.Provider>
    );
}

export const useAudio = () => useContext(AudioContext);
```

---

### 4. Add React Error Boundaries
**Label**: `bug`, `ux`, `high-priority`  
**Effort**: 3-4 hours

**Problem**: No error handling. A shader compilation error crashes the entire app.

**Implementation**:
- [ ] Create `src/components/ErrorBoundary.jsx`
- [ ] Wrap `<VisualCanvas>` with error boundary
- [ ] Wrap `<SettingsPanel>` with error boundary
- [ ] Add root-level error boundary
- [ ] Display user-friendly error messages
- [ ] Add "Retry" button

**Example**:
```jsx
// src/components/ErrorBoundary.jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
    state = { hasError: false, error: null };
    
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    
    render() {
        if (this.state.hasError) {
            return (
                <div className="error-screen">
                    <h1>Visual Engine Error</h1>
                    <p>{this.state.error.message}</p>
                    <button onClick={() => window.location.reload()}>
                        Reload App
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
```

---

## ⚡ High Priority (Performance)

### 5. Add Performance Monitoring
**Label**: `performance`, `tooling`  
**Effort**: 4-5 hours

**Implementation**:
- [ ] Install `stats.js`: `npm install stats.js`
- [ ] Add FPS counter in dev mode
- [ ] Add memory usage display
- [ ] Track draw calls
- [ ] Add performance marks for preset switches
- [ ] Use React Profiler on VisualCanvas

**Code**:
```javascript
import Stats from 'stats.js';

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb
document.body.appendChild(stats.dom);

function animate() {
    stats.begin();
    // render
    stats.end();
}
```

---

### 6. Remove Console Logs from Production
**Label**: `cleanup`, `performance`  
**Effort**: 2 hours

**Create logging utility**:
```javascript
// src/utils/logger.js
const isDev = import.meta.env.DEV;

export const logger = {
    debug: (...args) => isDev && console.log(...args),
    info: (...args) => console.info(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
};
```

**Replace all**:
- `console.log` → `logger.debug`
- `console.warn` → `logger.warn`
- `console.error` → `logger.error`

---

### 7. Extract Magic Numbers to Constants
**Label**: `refactor`, `maintainability`  
**Effort**: 1 hour

**Create** `src/config/constants.js`:
```javascript
export const AUDIO_CONFIG = {
    SWITCH_COOLDOWN_MS: 2000,
    MIN_BEAT_INTERVAL_MS: 300,
    SMOOTHING_ALPHA: 0.05,
    BPM_BUFFER_SIZE: 5,
    DEFAULT_BASS_SENSITIVITY: 5,
    DEFAULT_MID_SENSITIVITY: 5,
    DEFAULT_TREBLE_SENSITIVITY: 5,
};

export const VISUAL_CONFIG = {
    DEFAULT_ENGINE: 'hydra',
    AUTO_SWITCH_ENABLED: true,
};
```

---

### 8. Optimize BroadcastChannel Usage
**Label**: `performance`, `optimization`  
**Effort**: 3 hours

**Problem**: Sending messages every frame (~60fps) is wasteful.

**Solution**:
- [ ] Throttle audio messages to 30fps max
- [ ] Use `requestAnimationFrame` for throttling
- [ ] Consider SharedArrayBuffer for zero-copy data
- [ ] Add message queue

**Example**:
```javascript
let lastMessageTime = 0;
const MESSAGE_THROTTLE_MS = 33; // ~30fps

function sendAudioFeatures(data) {
    const now = performance.now();
    if (now - lastMessageTime < MESSAGE_THROTTLE_MS) return;
    
    lastMessageTime = now;
    channel.postMessage({ type: 'audioFeatures', value: data });
}
```

---

### 9. Add React Memoization
**Label**: `performance`, `optimization`  
**Effort**: 2-3 hours

**Add to**:
- [ ] `PresetGrid.jsx` - wrap with `React.memo`
- [ ] `SettingsPanel.jsx` - memoize handlers with `useCallback`
- [ ] `presets.js` - wrap preset array in `useMemo`
- [ ] Audio processing calculations

**Example**:
```javascript
const PresetGrid = React.memo(({ onSelect, presets }) => {
    // component code
});

const handlePresetSelect = useCallback((preset) => {
    channelRef.current?.postMessage({ type: "selectPreset", id: preset.id });
}, []);
```

---

## 🧹 Code Quality

### 10. Remove Dead Code
**Label**: `cleanup`, `technical-debt`  
**Effort**: 1 hour

**Tasks**:
- [ ] Delete `src/core/visualEngineManager.js` (empty file)
- [ ] Remove commented imports in `App.jsx`
- [ ] Search for `TODO` comments and address
- [ ] Run ESLint and fix all warnings
- [ ] Remove unused imports

---

### 11. Add TypeScript to Core Files
**Label**: `refactor`, `type-safety`, `medium-priority`  
**Effort**: 2-3 days

**Gradual migration strategy**:
1. [ ] Install TypeScript: `npm install -D typescript @types/react @types/react-dom @types/three`
2. [ ] Add `tsconfig.json`
3. [ ] Rename core files: `init.js` → `init.ts`, `audioRefs.js` → `audioRefs.ts`
4. [ ] Add types for uniforms, presets, audio features
5. [ ] Gradually migrate other files

---

### 12. Standardize Component Patterns
**Label**: `refactor`, `code-quality`  
**Effort**: 3-4 hours

**Consistency rules**:
- Use named exports for components
- Use `const` arrow functions for React components
- Organize imports: external → internal → types
- Remove emoji comments or use consistently
- Configure Prettier

**Run**:
```bash
npm install -D prettier
npx prettier --write "src/**/*.{js,jsx}"
```

---

## 🎨 UX Improvements

### 13. Add Loading & Error States UI
**Label**: `ux`, `enhancement`  
**Effort**: 4 hours

**Add**:
- [ ] Loading spinner when initializing engines
- [ ] "Requesting microphone access..." message
- [ ] "WebGL not supported" fallback
- [ ] Shader compilation error display
- [ ] Toast notification component
- [ ] Retry buttons

---

### 14. Implement Keyboard Shortcuts
**Label**: `feature`, `ux`, `enhancement`  
**Effort**: 3-4 hours

**Shortcuts**:
- `Space` - Toggle auto-switch
- `←/→` - Previous/Next preset
- `F` - Fullscreen
- `M` - Mute audio
- `R` - Randomize preset
- `Esc` - Toggle UI
- `1-9` - Quick preset selection
- `?` - Show help overlay

**Create** `src/hooks/useKeyboardShortcuts.js`

---

### 15. Add Preset Favorites & History
**Label**: `feature`, `enhancement`  
**Effort**: 4-5 hours

**Features**:
- [ ] Star icon on presets
- [ ] Store favorites in `localStorage`
- [ ] "Recently Used" section in settings
- [ ] Preset search/filter
- [ ] Shuffle mode
- [ ] Usage statistics

---

### 16. Add Fullscreen & WebGL Detection
**Label**: `ux`, `enhancement`  
**Effort**: 2 hours

**Implementation**:
- [ ] Use Fullscreen API on start
- [ ] Detect WebGL2 support
- [ ] Check max texture size
- [ ] Detect mobile devices
- [ ] Show graceful degradation messages

---

## 🧪 Testing

### 17. Add Unit Tests for Audio Processing
**Label**: `testing`, `quality`  
**Effort**: 1 day

**Test**:
- [ ] `useAudioFeatures` hook (mock Web Audio API)
- [ ] BPM detection algorithm
- [ ] Frequency band calculations
- [ ] Smoothing functions

**Setup**:
```bash
npm install -D vitest @testing-library/react
```

---

## 🎵 MIDI

### 18. Fix MIDI Implementation
**Label**: `feature`, `bug`, `enhancement`  
**Effort**: 1 day

**Current state**: Partially implemented in `SettingsPanel.jsx`

**Complete**:
- [ ] Add MIDI device selection UI
- [ ] Map all controls (not just pads 36-38)
- [ ] Persist MIDI mappings to `localStorage`
- [ ] Add MIDI learn mode
- [ ] Test with physical MIDI controller

---

## 📦 Optimization

### 19. Implement Code Splitting
**Label**: `performance`, `optimization`  
**Effort**: 3-4 hours

**Implementation**:
- [ ] Lazy load presets with `React.lazy()`
- [ ] Split Hydra and Three.js bundles
- [ ] Lazy load SettingsPanel route
- [ ] Add `<Suspense>` boundaries

**Example**:
```javascript
const SettingsPanel = lazy(() => import('@core/SettingsPanel'));

<Suspense fallback={<Loading />}>
    <SettingsPanel />
</Suspense>
```

---

## 📚 Documentation

### 20. Improve Documentation
**Label**: `documentation`  
**Effort**: 1 day

**Create**:
- [ ] Architecture diagram
- [ ] Preset creation guide
- [ ] `CONTRIBUTING.md`
- [ ] Troubleshooting section
- [ ] JSDoc comments
- [ ] BroadcastChannel protocol docs

---

## 🎯 Recommended Order

**Week 1** (Critical fixes):
1. Task #1 - Fix Three.js Memory Leaks
2. Task #2 - Audit Preset Cleanup
3. Task #5 - Add Performance Monitoring
4. Task #4 - Add Error Boundaries

**Week 2** (Architecture):
5. Task #3 - React Context
6. Task #6 - Remove Console Logs
7. Task #7 - Extract Constants
8. Task #10 - Remove Dead Code

**Week 3** (Performance & UX):
9. Task #8 - Optimize BroadcastChannel
10. Task #9 - React Memoization
11. Task #12 - Loading States
12. Task #13 - Keyboard Shortcuts

**Week 4** (Features & Polish):
13. Task #15 - Preset Favorites
14. Task #18 - Complete MIDI
15. Task #19 - Code Splitting
16. Task #20 - Documentation

---

## 📊 Progress Tracking

- **Total Tasks**: 20
- **Critical Priority**: 4 tasks
- **High Priority**: 5 tasks
- **Medium Priority**: 11 tasks

**Estimated Total Effort**: 4-5 weeks (part-time) or 2-3 weeks (full-time)

---

## 🐛 Known Issues Summary

1. **Memory leaks** when switching Three.js presets
2. **Global state** instead of Context API
3. **No error boundaries** - crashes aren't caught
4. **Console spam** in production builds
5. **BroadcastChannel** sends 60 messages/second
6. **No memoization** causing unnecessary re-renders
7. **Dead code** and empty files
8. **Incomplete MIDI** implementation
9. **No TypeScript** - type errors at runtime
10. **No tests** for critical audio logic

---

**Created**: 2025-11-29  
**Last Updated**: 2025-11-29  
**Status**: Roadmap defined, implementation pending
