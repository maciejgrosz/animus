import { useRef } from "react";

export function useHydra(presetFn) {
    const hydraRef = useRef(null);

    const startHydra = () => {
        const canvas = document.getElementById("hydra-canvas");
        if (!canvas) {
            console.warn("Hydra canvas not found");
            return;
        }

        canvas.classList.remove("hidden");

        if (!hydraRef.current) {
            console.log("✨ Starting Hydra...");
            try {
                hydraRef.current = new window.Hydra({ canvas });
                hydraRef.current.setResolution(window.innerWidth, window.innerHeight);
                if (typeof presetFn === "function") {
                    presetFn(); // ✅ run the dynamic visual
                }
                // nebulaJelly()
                console.log("✅ Hydra visuals started");
            } catch (e) {
                console.error("❌ Failed to start Hydra:", e);
                canvas.style.background = "black";
            }
        }
    };

    return { startHydra };
}
