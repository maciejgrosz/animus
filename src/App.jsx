import {useEffect, useRef, useState} from "react";
import HydraCanvas from "@core/HydraCanvas";
import TopToolbar from "@core/TopToolbar";
import { useHydra } from "@hooks/useHydra";
import { alexandreRangel } from "@hydra_presets/alexandreRangel"
import { presets } from "@hydra_presets/presets";
import PresetGrid from "@core/PresetGrid";
import { useMicInput } from "@hooks/useMicInput";
import { micReactive } from "@hydra_presets/micReactive"
    export default function App() {
        const [showUI, setShowUI] = useState(true);
        const [showPresets, setShowPresets] = useState(false);
        const canvasRef = useRef(null);
        const { initHydra, applyPreset } = useHydra();
        const amplitude = useMicInput(2);

        // useEffect(() => {
        //     const canvas = document.getElementById("hydra-canvas");
        //     if (canvas) {
        //         initHydra(canvas);
        //         applyPreset(() => micReactive(() => amplitude)); // ✅ mic-reactive startup
        //     }
        // }, [amplitude]); // <-- optional: keep reactive on mount
        useEffect(() => {
            const canvas = document.getElementById("hydra-canvas");
            if (canvas) {
                initHydra(canvas);
                applyPreset(alexandreRangel); // or any other default preset
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

    const handleRandomize = () => {
        const random = presets[Math.floor(Math.random() * presets.length)];
        applyPreset(random.fn);
        console.log("🎲 Rerolled preset:", random.name);
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
                    />

                    {showPresets && (
                        <div className="absolute bottom-0 w-full max-h-[50vh] overflow-y-auto bg-black/30 backdrop-blur p-4 z-10">
                            <PresetGrid
                                onSelect={(fn) => {
                                    applyPreset(fn);
                                    setShowPresets(false); // auto-close grid after selection (optional)
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
