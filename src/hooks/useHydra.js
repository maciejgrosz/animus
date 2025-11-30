import { useRef } from "react";
import Hydra from "hydra-synth";

export function useHydra() {
    const hydraRef = useRef(null);

    const initHydra = (canvas) => {
        console.log("[Hydra] initHydra called", { 
            hasCanvas: !!canvas, 
            hasInstance: !!hydraRef.current,
            hasGlobalHush: typeof globalThis.hush === "function"
        });

        if (!canvas) {
            console.warn("⚠️ Hydra canvas not found");
            return;
        }

        canvas.classList.remove("hidden");

        // Only create instance if it doesn't exist (but don't return early)
        if (!hydraRef.current) {
            console.log("[Hydra] Creating NEW instance");
            
            // Don't call hush() here - it might be from a disposed instance
            // VisualCanvas will call hush() after init if needed

            // Create new Hydra instance
            hydraRef.current = new Hydra({
                canvas,
                detectAudio: false,
                makeGlobal: true,
            });

            hydraRef.current.setResolution(window.innerWidth, window.innerHeight);

            console.log("[Hydra] ✅ New instance created", {
                osc: typeof globalThis.osc,
                noise: typeof globalThis.noise,
                hush: typeof globalThis.hush
            });
        } else {
            console.log("[Hydra] ♻️ Reusing existing instance");
        }
    };

     const applyPreset = (presetFn) => {
        console.log("[Hydra] applyPreset called", { 
            isFunction: typeof presetFn === "function",
            name: presetFn?.name || "anonymous"
        });

        if (typeof presetFn !== "function") {
            console.warn("⚠️ Invalid preset function", presetFn);
            return;
        }

        // Wait for hydra globals like `osc` to become available
        const waitUntilHydraReady = () => {
            if (typeof globalThis.osc !== "function") {
                console.log("[Hydra] ⏳ Waiting for Hydra globals...");
                requestAnimationFrame(waitUntilHydraReady);
                return;
            }

            console.log("[Hydra] ✅ Applying preset:", presetFn.name || "anonymous");
            try {
                presetFn(globalThis);
                console.log("[Hydra] ✅ Preset applied successfully");
            } catch (err) {
                console.error("[Hydra] 💥 Error running preset:", err);
            }
        };

        waitUntilHydraReady();
    };

    const disposeHydra = () => {
        console.log("[Hydra] disposeHydra called", { hasInstance: !!hydraRef.current });

        if (hydraRef.current) {
            console.log("[Hydra] 🗑️ Disposing instance");

            try {
                // Stop all Hydra animations
                if (typeof hydraRef.current.hush === "function") {
                    console.log("[Hydra] Calling hush() on instance");
                    hydraRef.current.hush();
                }
                
                // Clear all output buffers (o0, o1, o2, o3) to prevent fog
                for (let i = 0; i < 4; i++) {
                    if (hydraRef.current.o && hydraRef.current.o[i]) {
                        hydraRef.current.o[i].clear();
                    }
                }
                console.log("[Hydra] Cleared all output buffers");
            } catch (e) {
                console.warn("[Hydra] ⚠️ Error while stopping:", e);
            }

            hydraRef.current = null;
            console.log("[Hydra] ✅ Instance disposed, ref set to null");
        } else {
            console.log("[Hydra] No instance to dispose");
        }
    };

    return { initHydra, applyPreset, disposeHydra };
}
