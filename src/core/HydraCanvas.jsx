import { useEffect, useRef } from "react";
import { useHydra } from "@hooks/useHydra"; // ✅ import the custom hook
import { runDefaultHydraVisual } from "@hydra_presets/default";

export default function HydraCanvas() {
    const canvasRef = useRef();
    const { startHydra } = useHydra(runDefaultHydraVisual); // ✅ use the hook inside the component

    useEffect(() => {
        startHydra(); // ✅ start hydra when the canvas is mounted

        const handleResize = () => {
            const canvas = canvasRef.current;
            if (canvas && window.Hydra) {
                const hydra = new window.Hydra({ canvas });
                hydra.setResolution(window.innerWidth, window.innerHeight);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="hydra-canvas"
            className="fixed top-0 left-0 w-full h-full z-0"
        />
    );
}
