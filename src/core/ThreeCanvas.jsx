    import { useRef, useEffect, useState } from "react"
    import { initEngine } from "@core/engine/init.js"
    import { createTunnel } from "./three_presets/threeTunnel"
    import { createThreeBloomIcosphere } from "./three_presets/threeBloomIcosphere"
    import { ambientSphere } from "./three_presets/ambientSphere"
    import { blueVortex } from "./three_presets/blueVortex.js"
    import { skull } from "./three_presets/skull"
    import { zippyZaps } from "./three_presets/zippyZaps.js"
    import { maja } from "./three_presets/maja"
    import { test997420 } from "./three_presets/test997420"

    export default function ThreeCanvas({ selectedPreset = "threeTunnel" }) {
        const containerRef = useRef(null)
        const [engineReady, setEngineReady] = useState(false)

        // 🧠 Init engine once on mount
        useEffect(() => {
            const container = containerRef.current
            if (!container) return

            initEngine(container).then(() => setEngineReady(true))
        }, [])

        // 🎛️ Switch presets when ready
        useEffect(() => {
            if (!engineReady) return
            let cleanup = () => {}

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
            }

            return () => {
                if (typeof cleanup === "function") cleanup()
            }
        }, [selectedPreset, engineReady])

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
