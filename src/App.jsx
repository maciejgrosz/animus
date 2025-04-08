import { useEffect, useRef, useState } from "react";
import HydraCanvas from "@core/HydraCanvas";
import { useHydra } from "@hooks/useHydra";
import { presets } from "@hydra_presets/presets";
import {
    bassRef,
    midRef,
    trebleRef,
} from "@core/audioRefs";

export default function App() {
    const [showUI, setShowUI] = useState(true);
    const canvasRef = useRef(null);
    const currentPresetIndex = useRef(0);
    const lastSwitchTime = useRef(0);
    const switchCooldown = 2000; // 2 seconds
    const autoSwitchEnabled = useRef(true); // ✅ Toggle state from Settings
    const { initHydra, applyPreset } = useHydra();

    const triggerNextPreset = () => {
        const now = Date.now();
        if (now - lastSwitchTime.current < switchCooldown) return;
        lastSwitchTime.current = now;

        const nextIndex = (currentPresetIndex.current + 1) % presets.length;
        const nextPreset = presets[nextIndex];
        if (nextPreset) {
            applyPreset(nextPreset.fn);
            currentPresetIndex.current = nextIndex;
            console.log("🎚️ Auto-switched to preset:", nextPreset.name);
        }
    };

    useEffect(() => {
        const channel = new BroadcastChannel("animus-control");

        channel.onmessage = (event) => {
            const { type, value, id } = event.data;

            if (type === "audioFeatures") {
                bassRef.current = value.bass;
                midRef.current = value.mid;
                trebleRef.current = value.treble;
            } else if (type === "selectPreset" && id) {
                const match = presets.find((p) => p.id === id);
                if (match) {
                    applyPreset(match.fn);
                    currentPresetIndex.current = presets.findIndex((p) => p.id === id);
                    console.log("🎛️ Switched to preset:", match.name);
                } else {
                    console.warn("❌ Preset ID not found:", id);
                }
            } else if (type === "autoSwitchEnabled") {
                autoSwitchEnabled.current = !!value;
                console.log("🔁 Auto-switch now", autoSwitchEnabled.current ? "enabled" : "disabled");
            } else if (type === "beatDetected") {
                if (autoSwitchEnabled.current) {
                    triggerNextPreset();
                }
            }
        };

        return () => channel.close();
    }, []);

    useEffect(() => {
        const canvas = document.getElementById("hydra-canvas");
        if (canvas) {
            initHydra(canvas);
            applyPreset(presets[0].fn); // Initial preset
        }
    }, []);

    const handleStart = () => {
        const canvas = document.getElementById("hydra-canvas");
        if (canvas) {
            setShowUI(false);
        } else {
            console.warn("❌ Canvas not found!");
        }
    };

    const handleOpenSettings = () => {
        window.open("/settings", "_blank", "width=400,height=600");
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <canvas
                ref={canvasRef}
                id="hydra-canvas"
                className="fixed top-0 left-0 w-full h-full z-0"
            />

            <button
                onClick={handleOpenSettings}
                className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm backdrop-blur transition"
            >
                Settings
            </button>

            {showUI && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="bg-black/50 backdrop-blur-md p-8 rounded-2xl text-white text-center max-w-lg">
                        <h1 className="text-4xl font-bold mb-4">🎛️ Animus VJ Tool</h1>
                        <p className="text-md text-gray-300 mb-6">
                            Create reactive visuals using sound and code. Welcome to the new era of browser-based VJing.
                        </p>
                        <button
                            onClick={handleStart}
                            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition"
                        >
                            Start Show
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
