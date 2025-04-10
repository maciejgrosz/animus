import { useEffect, useRef, useState } from "react";
import HydraCanvas from "@core/HydraCanvas";
import { useHydra } from "@hooks/useHydra";
import { presets } from "@hydra_presets/presets";
import {
    bassRef,
    midRef,
    trebleRef,
} from "@core/audioRefs";
import ThreeCanvas from "@core/ThreeCanvas";

export default function App() {
    const [showUI, setShowUI] = useState(true);
    const [useThree, setUseThree] = useState(false);
    const [selectedThreeId, setSelectedThreeId] = useState("threeTunnel");
    const canvasRef = useRef(null);
    const hydraInitialized = useRef(false);
    const currentPresetIndex = useRef(0);
    const lastSwitchTime = useRef(0);
    const switchCooldown = 2000;
    const autoSwitchEnabled = useRef(true);
    const { initHydra, applyPreset } = useHydra();

    const triggerNextPreset = () => {
        const now = Date.now();
        if (now - lastSwitchTime.current < switchCooldown) return;
        lastSwitchTime.current = now;

        const nextIndex = (currentPresetIndex.current + 1) % presets.length;
        const nextPreset = presets[nextIndex];

        if (nextPreset) {
            if (nextPreset.id === "threeTunnel") {
                setUseThree(true);
                setSelectedThreeId("threeTunnel");
            } else {
                setUseThree(false);
                applyPreset(nextPreset.fn);
            }
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
                    if (match.id === "threeTunnel") {
                        setUseThree(true);
                        setSelectedThreeId("threeTunnel");
                    } else {
                        setUseThree(false);
                        applyPreset(match.fn);
                    }
                    currentPresetIndex.current = presets.findIndex((p) => p.id === id);
                    console.log("🎛️ Switched to preset:", match.name);
                } else {
                    console.warn("❌ Preset ID not found:", id);
                }
            } else if (type === "selectThree") {
                setUseThree(true);
                if (id) setSelectedThreeId(id);
                currentPresetIndex.current = -1;
                console.log("🎥 Switched to Three.js shader:", id);
            } else if (type === "autoSwitchEnabled") {
                autoSwitchEnabled.current = !!value;
                console.log("🔁 Auto-switch now", autoSwitchEnabled.current ? "enabled" : "disabled");
            } else if (type === "beatDetected") {
                if (autoSwitchEnabled.current) {
                    triggerNextPreset();
                }
            } else if (type === "randomizePreset") {
                if (typeof window.__RANDOMIZE === "function") {
                    window.__RANDOMIZE();
                    console.log("🎲 Randomized preset parameters");
                } else {
                    console.warn("⚠️ This preset doesn't support randomization");
                }
            }
        };

        return () => channel.close();
    }, []);

    useEffect(() => {
        if (!useThree) {
            const canvas = document.getElementById("hydra-canvas");

            if (canvas && !hydraInitialized.current) {
                initHydra(canvas);
                hydraInitialized.current = true;
            }

            const currentPreset = presets[currentPresetIndex.current];
            if (currentPreset && currentPreset.fn) {
                // 🕐 Delay re-applying preset slightly to ensure Hydra has taken control of canvas
                setTimeout(() => {
                    console.log("🔁 Re-applying Hydra preset:", currentPreset.name);
                    applyPreset(currentPreset.fn);
                }, 50); // 50ms is usually enough
            }
        }
    }, [useThree]);

    const handleStart = () => {
        const canvas = document.getElementById("hydra-canvas");
        if (canvas || useThree) {
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
            {useThree ? (
                <ThreeCanvas selectedPreset={selectedThreeId} />
            ) : (
                <HydraCanvas
                    key={`hydra-${currentPresetIndex.current}`}
                    presetFn={presets[currentPresetIndex.current]?.fn}
                />
            )}

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
