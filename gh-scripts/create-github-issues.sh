#!/bin/bash

# Create GitHub Issues from ROADMAP.md
# Usage: ./scripts/create-github-issues.sh
# Requires: GitHub CLI (gh) installed and authenticated

echo "🚀 Creating GitHub Issues from ROADMAP..."

# Task 1: Fix Three.js Memory Leaks
gh issue create \
  --title "🚨 Fix Three.js Memory Leaks & Cleanup" \
  --label "bug,performance,critical" \
  --body "## Problem
Critical performance issue: Mixed renderer lifecycle patterns causing memory leaks when switching presets.

## Current Issues
- Some presets create their own renderer (e.g., \`zippyZaps.js\`)
- \`init.js\` uses singleton pattern
- Inconsistent cleanup logic across presets
- Memory accumulates with each preset switch

## Solution
- [ ] Choose ONE pattern: singleton renderer (recommended) OR per-preset renderers
- [ ] Audit all files in \`three_presets/\`
- [ ] Ensure proper disposal: geometries, materials, textures, render passes
- [ ] Use \`resetThreeState()\` consistently before each preset
- [ ] Add memory profiling to verify fixes

## Files to Modify
- \`src/core/engine/init.js\`
- \`src/core/VisualCanvas.jsx\`
- All files in \`src/core/three_presets/*.js\`

**Effort**: 2-3 days
**Priority**: Critical"

echo "✅ Created Issue #1"

# Task 2: Audit Preset Cleanup
gh issue create \
  --title "🧹 Audit & Fix All Three.js Preset Cleanup" \
  --label "bug,performance,critical" \
  --body "## Checklist
Verify each preset returns proper cleanup function:

- [ ] \`threeTunnel.js\` - returns proper cleanup function
- [ ] \`threeBloomIcosphere.js\` - disposes geometry/material/passes
- [ ] \`ambientSphere.js\` - removes event listeners
- [ ] \`blueVortex.js\` - disposes shader materials
- [ ] \`skull.js\` - disposes loaded models/textures
- [ ] \`zippyZaps.js\` - **CRITICAL**: creates own renderer, needs refactor
- [ ] \`maja.js\` - cleanup verification
- [ ] \`test997420.js\` - cleanup verification

## Cleanup Checklist Per Preset
\`\`\`javascript
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
\`\`\`

**Effort**: 1-2 days
**Priority**: Critical
**Depends on**: #1"

echo "✅ Created Issue #2"

# Task 3: React Context
gh issue create \
  --title "🔄 Replace Global Refs with React Context" \
  --label "refactor,architecture,high-priority" \
  --body "## Problem
\`audioRefs.js\` exports mutable global objects, violating React principles.

**Current Code** (bad):
\`\`\`javascript
export const bassRef = { current: 0 };
export const midRef = { current: 0 };
export const trebleRef = { current: 0 };
\`\`\`

## Solution
Create Context API provider

## Implementation Steps
- [ ] Create \`src/contexts/AudioContext.jsx\`
- [ ] Move audio refs into context state
- [ ] Wrap app with \`<AudioProvider>\`
- [ ] Update all consumers with \`useAudio()\` hook
- [ ] Remove \`audioRefs.js\`

## Files to Update
- \`src/App.jsx\`
- \`src/core/presets.js\`
- All \`src/core/three_presets/*.js\`
- All \`src/hydra_presets/*.js\`
- \`src/hooks/useAudioFeatures.js\`

**Effort**: 1 day
**Priority**: High"

echo "✅ Created Issue #3"

# Task 4: Error Boundaries
gh issue create \
  --title "🛡️ Add React Error Boundaries" \
  --label "bug,ux,high-priority" \
  --body "## Problem
No error handling. A shader compilation error crashes the entire app.

## Implementation
- [ ] Create \`src/components/ErrorBoundary.jsx\`
- [ ] Wrap \`<VisualCanvas>\` with error boundary
- [ ] Wrap \`<SettingsPanel>\` with error boundary
- [ ] Add root-level error boundary
- [ ] Display user-friendly error messages
- [ ] Add \"Retry\" button

**Effort**: 3-4 hours
**Priority**: High"

echo "✅ Created Issue #4"

# Task 5: Performance Monitoring
gh issue create \
  --title "📊 Add Performance Monitoring" \
  --label "performance,tooling" \
  --body "## Implementation
- [ ] Install \`stats.js\`: \`npm install stats.js\`
- [ ] Add FPS counter in dev mode
- [ ] Add memory usage display
- [ ] Track draw calls
- [ ] Add performance marks for preset switches
- [ ] Use React Profiler on VisualCanvas

## Code Example
\`\`\`javascript
import Stats from 'stats.js';

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb
document.body.appendChild(stats.dom);

function animate() {
    stats.begin();
    // render
    stats.end();
}
\`\`\`

**Effort**: 4-5 hours
**Priority**: High"

echo "✅ Created Issue #5"

# Task 6: Remove Console Logs
gh issue create \
  --title "🧪 Remove Console Logs from Production" \
  --label "cleanup,performance" \
  --body "## Implementation
Create logging utility:

\`\`\`javascript
// src/utils/logger.js
const isDev = import.meta.env.DEV;

export const logger = {
    debug: (...args) => isDev && console.log(...args),
    info: (...args) => console.info(...args),
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args),
};
\`\`\`

## Replace All
- \`console.log\` → \`logger.debug\`
- \`console.warn\` → \`logger.warn\`
- \`console.error\` → \`logger.error\`

**Effort**: 2 hours
**Priority**: Medium"

echo "✅ Created Issue #6"

# Task 7: Extract Constants
gh issue create \
  --title "⚙️ Extract Magic Numbers to Constants" \
  --label "refactor,maintainability" \
  --body "## Create \`src/config/constants.js\`

\`\`\`javascript
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
\`\`\`

**Effort**: 1 hour
**Priority**: Medium"

echo "✅ Created Issue #7"

# Task 8: Optimize BroadcastChannel
gh issue create \
  --title "🎯 Optimize BroadcastChannel Usage" \
  --label "performance,optimization" \
  --body "## Problem
Sending messages every frame (~60fps) is wasteful.

## Solution
- [ ] Throttle audio messages to 30fps max
- [ ] Use \`requestAnimationFrame\` for throttling
- [ ] Consider SharedArrayBuffer for zero-copy data
- [ ] Add message queue

## Example
\`\`\`javascript
let lastMessageTime = 0;
const MESSAGE_THROTTLE_MS = 33; // ~30fps

function sendAudioFeatures(data) {
    const now = performance.now();
    if (now - lastMessageTime < MESSAGE_THROTTLE_MS) return;
    
    lastMessageTime = now;
    channel.postMessage({ type: 'audioFeatures', value: data });
}
\`\`\`

**Effort**: 3 hours
**Priority**: High"

echo "✅ Created Issue #8"

# Task 9: React Memoization
gh issue create \
  --title "💾 Add React Memoization" \
  --label "performance,optimization" \
  --body "## Add to
- [ ] \`PresetGrid.jsx\` - wrap with \`React.memo\`
- [ ] \`SettingsPanel.jsx\` - memoize handlers with \`useCallback\`
- [ ] \`presets.js\` - wrap preset array in \`useMemo\`
- [ ] Audio processing calculations

## Example
\`\`\`javascript
const PresetGrid = React.memo(({ onSelect, presets }) => {
    // component code
});

const handlePresetSelect = useCallback((preset) => {
    channelRef.current?.postMessage({ type: 'selectPreset', id: preset.id });
}, []);
\`\`\`

**Effort**: 2-3 hours
**Priority**: Medium"

echo "✅ Created Issue #9"

# Task 10: Remove Dead Code
gh issue create \
  --title "🗑️ Remove Dead Code" \
  --label "cleanup,technical-debt" \
  --body "## Tasks
- [ ] Delete \`src/core/visualEngineManager.js\` (empty file)
- [ ] Remove commented imports in \`App.jsx\`
- [ ] Search for \`TODO\` comments and address
- [ ] Run ESLint and fix all warnings
- [ ] Remove unused imports

**Effort**: 1 hour
**Priority**: Low"

echo "✅ Created Issue #10"

# Task 11: TypeScript
gh issue create \
  --title "🔍 Add TypeScript to Core Files" \
  --label "refactor,type-safety,medium-priority" \
  --body "## Gradual Migration Strategy
1. [ ] Install TypeScript: \`npm install -D typescript @types/react @types/react-dom @types/three\`
2. [ ] Add \`tsconfig.json\`
3. [ ] Rename core files: \`init.js\` → \`init.ts\`, \`audioRefs.js\` → \`audioRefs.ts\`
4. [ ] Add types for uniforms, presets, audio features
5. [ ] Gradually migrate other files

**Effort**: 2-3 days
**Priority**: Medium"

echo "✅ Created Issue #11"

# Task 12: Loading States
gh issue create \
  --title "🎨 Add Loading & Error States UI" \
  --label "ux,enhancement" \
  --body "## Add
- [ ] Loading spinner when initializing engines
- [ ] \"Requesting microphone access...\" message
- [ ] \"WebGL not supported\" fallback
- [ ] Shader compilation error display
- [ ] Toast notification component
- [ ] Retry buttons

**Effort**: 4 hours
**Priority**: Medium"

echo "✅ Created Issue #12"

# Task 13: Keyboard Shortcuts
gh issue create \
  --title "⌨️ Implement Keyboard Shortcuts" \
  --label "feature,ux,enhancement" \
  --body "## Shortcuts
- \`Space\` - Toggle auto-switch
- \`←/→\` - Previous/Next preset
- \`F\` - Fullscreen
- \`M\` - Mute audio
- \`R\` - Randomize preset
- \`Esc\` - Toggle UI
- \`1-9\` - Quick preset selection
- \`?\` - Show help overlay

## Create
\`src/hooks/useKeyboardShortcuts.js\`

**Effort**: 3-4 hours
**Priority**: Medium"

echo "✅ Created Issue #13"

# Task 14: Standardize Patterns
gh issue create \
  --title "🔧 Standardize Component Patterns" \
  --label "refactor,code-quality" \
  --body "## Consistency Rules
- Use named exports for components
- Use \`const\` arrow functions for React components
- Organize imports: external → internal → types
- Remove emoji comments or use consistently
- Configure Prettier

## Run
\`\`\`bash
npm install -D prettier
npx prettier --write \"src/**/*.{js,jsx}\"
\`\`\`

**Effort**: 3-4 hours
**Priority**: Low"

echo "✅ Created Issue #14"

# Task 15: Code Splitting
gh issue create \
  --title "📦 Implement Code Splitting" \
  --label "performance,optimization" \
  --body "## Implementation
- [ ] Lazy load presets with \`React.lazy()\`
- [ ] Split Hydra and Three.js bundles
- [ ] Lazy load SettingsPanel route
- [ ] Add \`<Suspense>\` boundaries

## Example
\`\`\`javascript
const SettingsPanel = lazy(() => import('@core/SettingsPanel'));

<Suspense fallback={<Loading />}>
    <SettingsPanel />
</Suspense>
\`\`\`

**Effort**: 3-4 hours
**Priority**: Medium"

echo "✅ Created Issue #15"

# Task 16: Unit Tests
gh issue create \
  --title "🧪 Add Unit Tests for Audio Processing" \
  --label "testing,quality" \
  --body "## Test
- [ ] \`useAudioFeatures\` hook (mock Web Audio API)
- [ ] BPM detection algorithm
- [ ] Frequency band calculations
- [ ] Smoothing functions

## Setup
\`\`\`bash
npm install -D vitest @testing-library/react
\`\`\`

**Effort**: 1 day
**Priority**: Medium"

echo "✅ Created Issue #16"

# Task 17: MIDI
gh issue create \
  --title "🎛️ Fix MIDI Implementation" \
  --label "feature,bug,enhancement" \
  --body "## Current State
Partially implemented in \`SettingsPanel.jsx\`

## Complete
- [ ] Add MIDI device selection UI
- [ ] Map all controls (not just pads 36-38)
- [ ] Persist MIDI mappings to \`localStorage\`
- [ ] Add MIDI learn mode
- [ ] Test with physical MIDI controller

**Effort**: 1 day
**Priority**: Low"

echo "✅ Created Issue #17"

# Task 18: Favorites
gh issue create \
  --title "💡 Add Preset Favorites & History" \
  --label "feature,enhancement" \
  --body "## Features
- [ ] Star icon on presets
- [ ] Store favorites in \`localStorage\`
- [ ] \"Recently Used\" section in settings
- [ ] Preset search/filter
- [ ] Shuffle mode
- [ ] Usage statistics

**Effort**: 4-5 hours
**Priority**: Low"

echo "✅ Created Issue #18"

# Task 19: WebGL Detection
gh issue create \
  --title "📱 Add Fullscreen & WebGL Detection" \
  --label "ux,enhancement" \
  --body "## Implementation
- [ ] Use Fullscreen API on start
- [ ] Detect WebGL2 support
- [ ] Check max texture size
- [ ] Detect mobile devices
- [ ] Show graceful degradation messages

**Effort**: 2 hours
**Priority**: Low"

echo "✅ Created Issue #19"

# Task 20: Documentation
gh issue create \
  --title "📝 Improve Documentation" \
  --label "documentation" \
  --body "## Create
- [ ] Architecture diagram
- [ ] Preset creation guide
- [ ] \`CONTRIBUTING.md\`
- [ ] Troubleshooting section
- [ ] JSDoc comments
- [ ] BroadcastChannel protocol docs

**Effort**: 1 day
**Priority**: Low"

echo "✅ Created Issue #20"

echo ""
echo "🎉 Successfully created 20 GitHub issues!"
echo ""
echo "View them at: https://github.com/maciejgrosz/animus/issues"
