import { useRef, useEffect } from "react"
import { createTunnel } from "./three_presets/threeTunnel"
import { createThreeBloomIcosphere } from "./three_presets/threeBloomIcosphere"
import { createAmbientSphere } from "./three_presets/createAmbientSphere"
import { test } from "./three_presets/test.js"
import { skull } from "./three_presets/skull"
import { zippyZaps } from "./three_presets/zippyZaps.js";
import {maja} from "./three_presets/maja";
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
        } else if (selectedPreset === "skull") {
            cleanup = skull(container)
        }else if (selectedPreset === "zippyZaps") {
            cleanup = zippyZaps(container);
        }else if (selectedPreset === "maja") {
            cleanup = maja(container);
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
            }}
        />
    )
}
