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
            presetFn();
        }
    };
    return { initHydra, applyPreset };
}
