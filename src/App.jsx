import { useState } from "react";
import HydraCanvas from "@core/HydraCanvas";

export default function App() {
    const [showUI, setShowUI] = useState(true);

    const handleStart = () => {
        setShowUI(false);
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            {/* 🔮 Hydra Visuals Background */}

            <HydraCanvas/>

            {/* 🌟 Overlay UI */}

            {showUI && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div
                        className="bg-black/60 backdrop-blur-md p-8 rounded-2xl text-white text-center max-w-lg pointer-events-auto">
                        <h1 className="text-4xl font-bold mb-4">🎛️ Animus VJ Tool</h1>
                        <p className="text-md text-gray-300 mb-6">
                            Create reactive visuals using sound and code. Welcome to the new era of browser-based VJing.
                        </p>
                        <button
                            onClick={handleStart}
                            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition pointer-events-auto"
                        >
                            Start Show
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
