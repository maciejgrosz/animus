import { useEffect, useRef, useState } from "react";
import { presets } from "@core/presets.js";
import {
    bassRef,
    midRef,
    trebleRef,
} from "@core/audioRefs";
import VisualCanvas from "@core/VisualCanvas";

/**
 * App.jsx - Main application orchestrator
 * 
 * Responsibilities:
 * 1. State Management: Tracks which engine (three/hydra) and preset is active
 * 2. BroadcastChannel Listener: Receives commands from settings panel (separate window)
 * 3. Auto-switching: Handles beat-triggered preset transitions
 * 4. UI Layer: Shows welcome screen, settings button
 * 
 * Flow:
 * Settings Panel → BroadcastChannel → App.jsx (updates state) → VisualCanvas (renders)
 * 
 * Note: Some Hydra logic here duplicates VisualCanvas behavior (lines 107-124)
 * This may cause double-initialization and should be refactored.
 */
export default function App() {
    // ═══════════════════════════════════════════════════════════════
    // STATE: Engine & Preset Selection
    // ═══════════════════════════════════════════════════════════════
    const [showUI, setShowUI] = useState(true);  // Welcome screen visibility
    const [useThree, setUseThree] = useState(true);  // false = Hydra, true = Three.js
    const [selectedThreeId, setSelectedThreeId] = useState("threeBloomIcosphere");  // Active Three.js preset
    const [selectedHydraId, setSelectedHydraId] = useState("nesso");  // Active Hydra preset
    
    // ═══════════════════════════════════════════════════════════════
    // REFS: Persistent values that don't trigger re-renders
    // ═══════════════════════════════════════════════════════════════
    const currentPresetIndex = useRef(0);  // Index in presets array
    const lastSwitchTime = useRef(0);  // Timestamp for cooldown
    const switchCooldown = 2000;  // Min 2s between auto-switches
    const autoSwitchEnabled = useRef(false);  // Auto-switch on beat detection

    // ═══════════════════════════════════════════════════════════════
    // AUTO-SWITCHING: Beat-triggered preset changes
    // ═══════════════════════════════════════════════════════════════
    const triggerNextPreset = () => {
        // Cooldown: Prevent rapid switching
        const now = Date.now();
        if (now - lastSwitchTime.current < switchCooldown) return;
        lastSwitchTime.current = now;

        // Cycle to next preset in array
        const nextIndex = (currentPresetIndex.current + 1) % presets.length;
        const nextPreset = presets[nextIndex];

        if (nextPreset) {
            // Check preset's engine type
            if (nextPreset.engine === "threejs") {
                setUseThree(true);
                setSelectedThreeId(nextPreset.id);
            } else {
                // Hydra preset - update both engine and preset ID
                setUseThree(false);
                setSelectedHydraId(nextPreset.id);
            }
            currentPresetIndex.current = nextIndex;
            console.log("🎚️ Auto-switched to preset:", nextPreset.name);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // EFFECT #1: BroadcastChannel Listener
    // ═══════════════════════════════════════════════════════════════
    // Receives messages from settings panel (separate browser window)
    // Message types:
    //   - audioFeatures: Real-time audio data (bass/mid/treble)
    //   - selectPreset: User clicked preset in settings
    //   - selectThree: User clicked Three.js preset
    //   - autoSwitchEnabled: Toggle beat-triggered switching
    //   - beatDetected: Audio beat detected → trigger auto-switch
    //   - randomizePreset: Call preset's randomization function
    useEffect(() => {
        const channel = new BroadcastChannel("animus-control");

        channel.onmessage = (event) => {
            const { type, value, id } = event.data;

            // Audio features from microphone input
            if (type === "audioFeatures") {
                bassRef.current = value.bass;
                midRef.current = value.mid;
                trebleRef.current = value.treble;
            } 
            // User selected preset from grid
            else if (type === "selectPreset" && id) {
                const match = presets.find((p) => p.id === id);
                if (match) {
                    // Check preset's engine type
                    if (match.engine === "threejs") {
                        setUseThree(true);
                        setSelectedThreeId(match.id);
                    } else {
                        // Hydra preset - update both engine and preset ID
                        setUseThree(false);
                        setSelectedHydraId(match.id);
                    }
                    currentPresetIndex.current = presets.findIndex((p) => p.id === id);
                    console.log("🎛️ Switched to preset:", match.name);
                } else {
                    console.warn("❌ Preset ID not found:", id);
                }
            } 
            // User selected Three.js preset specifically
            else if (type === "selectThree") {
                setUseThree(true);
                if (id) setSelectedThreeId(id);
                currentPresetIndex.current = -1;  // -1 = not in Hydra presets array
                console.log("🎥 Switched to Three.js shader:", id);
            } 
            // Toggle auto-switching feature
            else if (type === "autoSwitchEnabled") {
                autoSwitchEnabled.current = !!value;
                console.log("🔁 Auto-switch now", autoSwitchEnabled.current ? "enabled" : "disabled");
            } 
            // Beat detected by audio analysis → auto-switch if enabled
            else if (type === "beatDetected") {
                if (autoSwitchEnabled.current) {
                    triggerNextPreset();
                }
            } 
            // Call preset's randomization function (if exists)
            else if (type === "randomizePreset") {
                // Preset can expose window.__RANDOMIZE function for parameter randomization
                if (typeof window.__RANDOMIZE === "function") {
                    window.__RANDOMIZE();
                    console.log("🎲 Randomized preset parameters");
                } else {
                    console.warn("⚠️ This preset doesn't support randomization");
                }
            }
        };

        return () => channel.close();  // Cleanup: Close channel on unmount
    }, []);

    // ═══════════════════════════════════════════════════════════════
    // UI EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════
    const handleStart = () => {
        // Hide welcome screen when either canvas exists
        const hydra = document.getElementById("hydra-canvas");
        const three = document.getElementById("three-container");
        if (hydra || three) {
            setShowUI(false);
        } else {
            console.warn("❌ No canvas found!");
        }
    };

    const handleOpenSettings = () => {
        // Open settings panel in new window (communicates via BroadcastChannel)
        window.open("/settings", "_blank", "width=400,height=600");
    };

    const handleOpenReadme = () => {
        window.open("/README", "_blank", "width=800,height=600");
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDER: UI Layer + VisualCanvas
    // ═══════════════════════════════════════════════════════════════
return (
    <div className="relative w-screen h-screen overflow-hidden">
        <>
            {/* Visual engine - handles Three.js and Hydra rendering */}
            <VisualCanvas
                selectedEngine={useThree ? "three" : "hydra"}
                selectedPreset={
                    useThree
                        ? selectedThreeId  // Three.js preset ID
                        : selectedHydraId  // Hydra preset ID
                }
            />

            {/* Settings panel launcher (top-right) */}
            <button
                onClick={handleOpenSettings}
                className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm backdrop-blur transition"
            >
                Settings
            </button>

            {/* Welcome screen overlay (shown on initial load) */}
            {showUI && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="bg-black/50 backdrop-blur-md p-8 rounded-2xl text-white text-center max-w-lg">
                        <h1 className="text-4xl font-bold mb-4">🎛️ Animus VJ Tool</h1>
                        <p className="text-md text-gray-300 mb-6">
                            Create reactive visuals using sound and code. Welcome to the new era of browser-based VJing.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleStart}
                                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition"
                            >
                                Start Show
                            </button>
                            <button
                                onClick={handleOpenReadme}
                                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition"
                            >
                                README
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    </div>
);
}
