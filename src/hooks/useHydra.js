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

        // Force recreation if instance was disposed
        if (!hydraRef.current) {
            console.log("[Hydra] Creating NEW instance");
            
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
            // Ensure resolution is correct when reusing
            hydraRef.current.setResolution(window.innerWidth, window.innerHeight);
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
            
            // Log Hydra state before applying
            console.log("[Hydra] State before preset:", {
                hasO0: typeof globalThis.o0 !== "undefined",
                hasO1: typeof globalThis.o1 !== "undefined", 
                hasO2: typeof globalThis.o2 !== "undefined",
                hasO3: typeof globalThis.o3 !== "undefined",
                hasSrc: typeof globalThis.src === "function",
                hasOsc: typeof globalThis.osc === "function",
                hasNoise: typeof globalThis.noise === "function",
                hasVoronoi: typeof globalThis.voronoi === "function",
                hasSolid: typeof globalThis.solid === "function",
                hasShape: typeof globalThis.shape === "function",
                hasGradient: typeof globalThis.gradient === "function",
                o0Type: typeof globalThis.o0,
                canvasWidth: hydraRef.current?.canvas?.width,
                canvasHeight: hydraRef.current?.canvas?.height,
            });
            
            try {
                presetFn(globalThis);
                console.log("[Hydra] ✅ Preset applied successfully");
                
                // Log state after applying
                console.log("[Hydra] State after preset:", {
                    o0Exists: !!globalThis.o0,
                    outputCount: hydraRef.current?.o?.length || 0,
                });
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
                
                // Clear all output buffers by rendering solid black
                if (typeof globalThis.solid === "function") {
                    console.log("[Hydra] Clearing all output buffers");
                    solid(0, 0, 0, 0).out(o0);
                    solid(0, 0, 0, 0).out(o1);
                    solid(0, 0, 0, 0).out(o2);
                    solid(0, 0, 0, 0).out(o3);
                }
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
