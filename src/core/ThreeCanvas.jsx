// src/core/ThreeCanvas.jsx
import { useRef, useEffect } from "react";
import { createTunnel } from "./three_presets/threeTunnel";
import { createThreeBloomIcosphere } from "./three_presets/threeBloomIcosphere";

export default function ThreeCanvas({ selectedPreset = "threeTunnel" }) {
    const canvasRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let cleanup = () => {};
        if (selectedPreset === "threeTunnel") {
            cleanup = createTunnel(canvas);
        } else if (selectedPreset === "threeBloomIcosphere") {
            cleanup = createThreeBloomIcosphere(canvas);
        }

        return () => {
            if (typeof cleanup === "function") cleanup();
        };
    }, [selectedPreset]);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
}
