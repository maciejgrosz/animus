// import { useRef, useEffect } from "react";
// import { createTunnel } from "./three_presets/threeTunnel";
// import { createThreeBloomIcosphere } from "./three_presets/threeBloomIcosphere";
// import { createAmbientSphere } from "./three_presets/createAmbientSphere"; // ✅ Import the new preset
// import { test } from "./three_presets/test";
// export default function ThreeCanvas({ selectedPreset = "threeTunnel" }) {
//     const canvasRef = useRef();
//
//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;
//
//         let cleanup = () => {};
//
//         if (selectedPreset === "threeTunnel") {
//             cleanup = createTunnel(canvas);
//         } else if (selectedPreset === "threeBloomIcosphere") {
//             cleanup = createThreeBloomIcosphere(canvas);
//         } else if (selectedPreset === "ambientSphere") {
//             cleanup = createAmbientSphere(canvas); // ✅ Handle new preset
//         } else if (selectedPreset === "test") {
//             cleanup = test(canvas);
//         }
//
//         return () => {
//             if (typeof cleanup === "function") cleanup();
//         };
//     }, [selectedPreset]);
//
//     return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
//
// }
import { useRef, useEffect } from "react"
import { createTunnel } from "./three_presets/threeTunnel"
import { createThreeBloomIcosphere } from "./three_presets/threeBloomIcosphere"
import { createAmbientSphere } from "./three_presets/createAmbientSphere"
import { test } from "./three_presets/test"

export default function ThreeCanvas({ selectedPreset = "threeTunnel" }) {
    const containerRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        let cleanup = () => {}

        if (selectedPreset === "threeTunnel") {
            cleanup = createTunnel(container)
        } else if (selectedPreset === "threeBloomIcosphere") {
            cleanup = createThreeBloomIcosphere(container)
        } else if (selectedPreset === "ambientSphere") {
            cleanup = createAmbientSphere(container)
        } else if (selectedPreset === "test") {
            cleanup = test(container)
        }

        return () => {
            if (typeof cleanup === "function") cleanup()
        }
    }, [selectedPreset])

    return (
        <div
            ref={containerRef}
            id="three-container"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                overflow: 'hidden',
                background: 'white', // LIGHT ON PURPOSE
                border: '2px dashed red'
            }}
        />
    )
}
