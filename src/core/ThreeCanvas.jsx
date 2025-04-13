import { useRef, useEffect } from "react";
import { createTunnel } from "./three_presets/threeTunnel";
import { createThreeBloomIcosphere } from "./three_presets/threeBloomIcosphere";
import { createAmbientSphere } from "./three_presets/createAmbientSphere"; // ✅ Import the new preset

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
        } else if (selectedPreset === "ambientSphere") {
            cleanup = createAmbientSphere(canvas); // ✅ Handle new preset
        }

        return () => {
            if (typeof cleanup === "function") cleanup();
        };
    }, [selectedPreset]);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
}
