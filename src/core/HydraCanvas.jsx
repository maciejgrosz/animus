import { useRef, useEffect } from "react";
import { oliviaJack } from "@hydra_presets/oliviaJack"; // ✅ Import preset

export default function HydraCanvas() {
    const canvasRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !window.Hydra) return;

        const hydra = new window.Hydra({ canvas });
        hydra.setResolution(window.innerWidth, window.innerHeight);
        oliviaJack(); // 🔥 Start the default visual


        const handleResize = () => {
            hydra.setResolution(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            try {
                solid(0, 0, 0, 0).out(); // Clean up the visual
            } catch {}
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="hydra-canvas"
            className="fixed top-0 left-0 w-full h-full z-0"
        />
    );
}
