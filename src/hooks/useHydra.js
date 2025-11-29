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
                makeGlobal: true,
            });

            hydraRef.current.setResolution(window.innerWidth, window.innerHeight);

            console.log("[Hydra] Initialized", {
                osc: globalThis.osc,
                noise: globalThis.noise,
            });
        }
    };

     const applyPreset = (presetFn) => {
        if (typeof presetFn !== "function") {
            console.warn("⚠️ Invalid preset function", presetFn);
            return;
        }

        // Wait for hydra globals like `osc` to become available
        const waitUntilHydraReady = () => {
            if (typeof globalThis.osc !== "function") {
                console.log("[Hydra] Waiting for Hydra globals...");
                requestAnimationFrame(waitUntilHydraReady);
                return;
            }

            console.log("✅ Applying Hydra preset:", presetFn.name || "anonymous");
            try {
                presetFn(globalThis); // Optional, if preset uses globalThis
            } catch (err) {
                console.error("💥 Error running preset:", err);
            }
        };

        waitUntilHydraReady();
    };

    const disposeHydra = () => {
        if (hydraRef.current) {
            console.log("[Hydra] Disposing hydra instance");

            try {
                if (typeof hydraRef.current.stop === "function") {
                    hydraRef.current.stop();
                }
            } catch (e) {
                console.warn("[Hydra] Error while stopping:", e);
            }

            hydraRef.current = null;

            const canvas = document.getElementById("hydra-canvas");
            if (canvas?.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        }
    };

    return { initHydra, applyPreset, disposeHydra };
}
