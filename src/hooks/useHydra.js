import { useRef } from "react";
import Hydra from "hydra-synth";

export function useHydra() {
    const hydraRef = useRef(null);

    const initHydra = (canvas) => {
        if (!canvas) {
            console.warn("⚠️ Hydra canvas not found");
            return;
        }

        canvas.classList.remove("hidden");

        if (!hydraRef.current) {
            hydraRef.current = new Hydra({
                canvas,
                detectAudio: false,
                makeGlobal: true // ✅ This exposes osc, shape, noise, etc. globally
            });

            hydraRef.current.setResolution(window.innerWidth, window.innerHeight);
        }
    };

    const applyPreset = (presetFn) => {

        if (typeof presetFn === "function") {
            try {
                presetFn();
                console.log("🎨 Preset applied successfully.");
            } catch (e) {
                console.error("❌ Failed to run preset:", e);
            }
        } else {
            console.warn("⚠️ applyPreset expects a function.");
        }
    };

    return { initHydra, applyPreset };
}
