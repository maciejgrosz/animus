import { useEffect, useState } from "react";
import HydraCanvas from "@core/HydraCanvas";
import TopToolbar from "@core/TopToolbar";
import { useHydra } from "@hooks/useHydra";
import { ritchse } from "@hydra_presets/ritchse";
import { oliviaJack, oliviaJack2 } from "@hydra_presets/oliviaJack.js";
import { florDeFuego } from "@hydra_presets/florDeFuego"
export default function App() {
    const [showUI, setShowUI] = useState(true);
    const { initHydra, applyPreset } = useHydra();

    const handleStart = () => {
        const canvas = document.getElementById("hydra-canvas");
        setShowUI(false);
    };

    const handleRandomize = () => {
        const presets = [ritchse, oliviaJack, oliviaJack2, florDeFuego];
        const random = presets[Math.floor(Math.random() * presets.length)];
        applyPreset(random);
        console.log(random);
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <HydraCanvas />
            {!showUI && <TopToolbar onRandomize={handleRandomize} />}
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
