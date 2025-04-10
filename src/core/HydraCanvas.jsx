import { useEffect } from "react";
import { useHydra } from "@hooks/useHydra";

export default function HydraCanvas({ presetFn }) {
    const { initHydra, applyPreset } = useHydra();

    useEffect(() => {
        const canvas = document.getElementById("hydra-canvas");
        if (canvas) {
            initHydra(canvas);
            applyPreset(presetFn);
        }
    }, [presetFn]);

    return (
        <canvas
            id="hydra-canvas"
            className="fixed top-0 left-0 w-full h-full z-0"
        />
    );
}
