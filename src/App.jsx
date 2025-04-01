import { useEffect, useRef, useState } from "react";
import HydraCanvas from "@core/HydraCanvas";
import TopToolbar from "@core/TopToolbar";
import { useHydra } from "@hooks/useHydra";
import { presets } from "@hydra_presets/presets";
import PresetGrid from "@core/PresetGrid";
import { useMicInput } from "@hooks/useMicInput";
import { micReactive } from "@hydra_presets/micReactive";

export default function App() {
    const [showUI, setShowUI] = useState(true);
    const [showPresets, setShowPresets] = useState(false);
    const [currentSensitivity, setCurrentSensitivity] = useState(5);
    const canvasRef = useRef(null);
    const { initHydra, applyPreset } = useHydra();
    const amplitude = useMicInput(currentSensitivity);

    // 📡 Listen for messages from the settings window
    useEffect(() => {
        const channel = new BroadcastChannel("animus-control");
        channel.onmessage = (event) => {
            if (event.data.type === "sensitivity") {
                setCurrentSensitivity(event.data.value);
            }
        };
        return () => channel.close();
    }, []);

    // 🎬 Init hydra & re-apply preset whenever amplitude changes
    useEffect(() => {
        const canvas = document.getElementById("hydra-canvas");
        if (canvas) {
            initHydra(canvas);
            applyPreset(() => micReactive(() => amplitude));
        }
    }, [amplitude]); // 🔁 re-apply every time amplitude changes (brute-force but works)


    // 🎲 Random preset button
    const handleRandomize = () => {
        const random = presets[Math.floor(Math.random() * presets.length)];
        applyPreset(random.fn);
        console.log("🎲 Rerolled preset:", random.name);
    };

    // ⚙️ Open settings window on second screen
    const handleOpenSettings = () => {
        window.open("/settings", "_blank", "width=400,height=600");
    };

    // 🎬 Start show button
    const handleStart = () => {
        const canvas = document.getElementById("hydra-canvas");
        if (canvas) {
            setShowUI(false);
        } else {
            console.warn("❌ Canvas not found!");
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            {/* Dev-only Amplitude Meter */}
            {process.env.NODE_ENV === "development" && (
                <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg z-50">
                    Amplitude: {amplitude.toFixed(4)}
                </div>
            )}

            {/* Hydra canvas */}
            <canvas
                ref={canvasRef}
                id="hydra-canvas"
                className="fixed top-0 left-0 w-full h-full z-0"
            />

            {/* Top toolbar and preset grid */}
            {!showUI && (
                <>
                    <TopToolbar
                        onRandomize={handleRandomize}
                        onTogglePresets={() => setShowPresets(!showPresets)}
                        onOpenSettings={handleOpenSettings} // ✅ passed in
                    />

                    {showPresets && (
                        <div className="absolute bottom-0 w-full max-h-[50vh] overflow-y-auto bg-black/30 backdrop-blur p-4 z-10">
                            <PresetGrid
                                onSelect={(fn) => {
                                    applyPreset(fn);
                                    setShowPresets(false);
                                }}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Launch screen UI */}
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
