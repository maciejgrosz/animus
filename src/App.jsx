import { useEffect, useRef, useState } from "react";
import HydraCanvas from "@core/HydraCanvas";
import TopToolbar from "@core/TopToolbar";
import { useHydra } from "@hooks/useHydra";
import { presets } from "@hydra_presets/presets";
import PresetGrid from "@core/PresetGrid";
import { micReactive } from "@hydra_presets/micReactive";
import { paintingReactive } from "@hydra_presets/paintingReactive"; // 👈 ADD THIS at the top
import {
    amplitudeRef,
    bassRef,
    midRef,
    trebleRef,
} from "@core/audioRefs"; // or whatever file name you choose


export default function App() {
    const [showUI, setShowUI] = useState(true);
    const [showPresets, setShowPresets] = useState(false);
    const [currentSensitivity, setCurrentSensitivity] = useState(5);
    const canvasRef = useRef(null);
    const { initHydra, applyPreset } = useHydra();

    useEffect(() => {
        const channel = new BroadcastChannel("animus-control");
        channel.onmessage = (event) => {
            const { type, value } = event.data;
            if (type === "audioFeatures") {
                amplitudeRef.current = value.amplitude;
                bassRef.current = value.bass;
                midRef.current = value.mid;
                trebleRef.current = value.treble;
            } else if (type === "sensitivity") {
                setCurrentSensitivity(value);
            }
        };
        return () => channel.close();
    }, []);

    // 🎬 Initialize Hydra once with micReactive as the first preset
    useEffect(() => {
        const canvas = document.getElementById("hydra-canvas");
        if (canvas) {
            initHydra(canvas);
            applyPreset(() => micReactive(() => amplitudeRef.current));
        }
    }, []); // ✅ Only once, not on every amplitude change


    // 🎲 Random preset trigger
    const handleRandomize = () => {
        const random = presets[Math.floor(Math.random() * presets.length)];
        applyPreset(random.fn);
        console.log("🎲 Rerolled preset:", random.name);
    };

    // ⚙️ Settings panel on second screen
    const handleOpenSettings = () => {
        window.open("/settings", "_blank", "width=400,height=600");
    };

    // 🎬 Launch main app
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
            <canvas
                ref={canvasRef}
                id="hydra-canvas"
                className="fixed top-0 left-0 w-full h-full z-0"
            />

            {!showUI && (
                <>
                    <TopToolbar
                        onRandomize={handleRandomize}
                        onTogglePresets={() => setShowPresets(!showPresets)}
                        onOpenSettings={handleOpenSettings}
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
