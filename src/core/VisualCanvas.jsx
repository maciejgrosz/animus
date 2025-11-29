import { useEffect, useRef, useState } from "react"
import { initEngine, disposeEngine } from "@core/engine/init.js"
import { useHydra } from "@hooks/useHydra"
import { createTunnel } from "./three_presets/threeTunnel"
import { createThreeBloomIcosphere } from "./three_presets/threeBloomIcosphere"
import { ambientSphere } from "./three_presets/ambientSphere"
import { blueVortex } from "./three_presets/blueVortex.js"
import { skull } from "./three_presets/skull"
import { zippyZaps } from "./three_presets/zippyZaps.js"
import { maja } from "./three_presets/maja"
import { test997420 } from "./three_presets/test997420"

export default function VisualCanvas({ selectedEngine = "three", selectedPreset = "threeTunnel" }) {
    const containerRef = useRef(null)
    const hydraCanvasRef = useRef(null)
    const cleanupRef = useRef(() => {})
    const [engineReady, setEngineReady] = useState(false)

    const { initHydra, applyPreset, disposeHydra } = useHydra()

    // 🔄 Re-initialize when engine changes
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        setEngineReady(false)

        if (selectedEngine === "three") {
            initEngine(container).then(() => setEngineReady(true))
        } else {
            // Hydra engine doesn't need init here
            setEngineReady(true)
        }

        return () => {
            disposeEngine()
            disposeHydra()
        }
    }, [selectedEngine])

    useEffect(() => {
        if (!engineReady) return

        let cleanup = () => {}

        if (selectedEngine === "three") {
            switch (selectedPreset) {
                case "threeTunnel":
                    cleanup = createTunnel()
                    break
                case "threeBloomIcosphere":
                    cleanup = createThreeBloomIcosphere()
                    break
                case "ambientSphere":
                    cleanup = ambientSphere()
                    break
                case "blueVortex":
                    cleanup = blueVortex()
                    break
                case "skull":
                    cleanup = skull()
                    break
                case "zippyZaps":
                    cleanup = zippyZaps()
                    break
                case "maja":
                    cleanup = maja()
                    break
                case "test997420":
                    cleanup = test997420()
                    break
                default:
                    break
            }
        } else if (selectedEngine === "hydra") {
            const canvas = hydraCanvasRef.current
            console.log("[Hydra] Canvas reference:", canvas)
            console.log("[Hydra] Engine ready:", engineReady, "Selected Engine:", selectedEngine, "Preset:", selectedPreset)
            if (canvas) {
                initHydra(canvas)
                applyPreset(selectedPreset)
            } else {
                console.warn("[Hydra] Canvas not found. Hydra will not initialize.")
            }
        }

        cleanupRef.current = cleanup

        return () => {
            if (typeof cleanupRef.current === "function") {
                cleanupRef.current()
            }
            if (selectedEngine === "hydra") {
                disposeHydra()
            }
        }
    }, [engineReady, selectedEngine, selectedPreset])

    return (
        <>
            <div
                ref={containerRef}
                id="three-container"
                style={{
                    position: selectedEngine === "three" ? "absolute" : "hidden",
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                    display: selectedEngine === "three" ? "block" : "none",
                }}
            />
            <canvas
                id="hydra-canvas"
                ref={hydraCanvasRef}
                style={{
                    position: selectedEngine === "hydra" ? "absolute" : "hidden",
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                    display: selectedEngine === "hydra" ? "block" : "none",
                }}
            />
        </>
    )
}
