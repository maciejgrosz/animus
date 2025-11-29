import { useEffect, useRef, useState } from "react"
import { initEngine, disposeEngine, resetThreeState } from "@core/engine/init.js"
import { useHydra } from "@hooks/useHydra"
import { presets } from "@core/presets.js"
import { createTunnel } from "./three_presets/threeTunnel"
import { createThreeBloomIcosphere } from "./three_presets/threeBloomIcosphere"
import { ambientSphere } from "./three_presets/ambientSphere"
import { blueVortex } from "./three_presets/blueVortex.js"
import { skull } from "./three_presets/skull"
import { zippyZaps } from "./three_presets/zippyZaps.js"
import { maja } from "./three_presets/maja"
import { test997420 } from "./three_presets/test997420"

/**
 * VisualCanvas - Engine orchestrator for Three.js and Hydra
 * 
 * Manages lifecycle of visual engines and presets:
 * - Engine switching (Three.js ↔ Hydra)
 * - Preset loading/unloading
 * - Cleanup between switches
 * 
 * See: docs/ARCHITECTURE.md for detailed flow
 */
export default function VisualCanvas({ selectedEngine = "three", selectedPreset = "threeTunnel" }) {
    // Refs for DOM elements (persist between renders, don't cause re-renders)
    const containerRef = useRef(null)        // Three.js renderer attaches here
    const hydraCanvasRef = useRef(null)      // Hydra draws on this canvas
    const cleanupRef = useRef(() => {})      // Stores current preset's cleanup function
    
    // Engine initialization state (async for Three.js)
    const [engineReady, setEngineReady] = useState(false)

    const { initHydra, applyPreset, disposeHydra } = useHydra()

    // ═══════════════════════════════════════════════════════════════
    // EFFECT #1: Engine Lifecycle
    // ═══════════════════════════════════════════════════════════════
    // Runs when: selectedEngine changes (three ↔ hydra)
    // Purpose: Initialize/dispose entire engine
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        // Block preset loading until engine ready
        setEngineReady(false)

        if (selectedEngine === "three") {
            // Three.js needs async initialization (creates WebGL context)
            initEngine(container).then(() => setEngineReady(true))
        } else {
            // Hydra initializes synchronously
            setEngineReady(true)
        }

        // Cleanup: Dispose entire engine when switching or unmounting
        return () => {
            disposeEngine()    // Destroys Three.js renderer, scene, tick manager
            disposeHydra()     // Destroys Hydra instance
        }
    }, [selectedEngine])  // Only runs when engine type changes

    // ═══════════════════════════════════════════════════════════════
    // EFFECT #2: Preset Lifecycle
    // ═══════════════════════════════════════════════════════════════
    // Runs when: engineReady, selectedEngine, or selectedPreset changes
    // Purpose: Load/unload individual presets

    useEffect(() => {
        // Wait for engine to finish initializing
        if (!engineReady) return

        let cleanup = () => {}  // Will hold preset's cleanup function

        if (selectedEngine === "three") {
            // Safety: Clear scene and dispose any leftover objects
            resetThreeState()

            // Load selected Three.js preset
            // Each preset returns a cleanup function that:
            // - Unsubscribes from tick manager
            // - Disposes geometries/materials
            // - Removes objects from scene
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
            // Load Hydra preset from presets array
            const canvas = hydraCanvasRef.current
            const hydraPreset = presets.find((preset) => preset.id === selectedPreset)

            if (!canvas) {
                console.warn("[Hydra] Canvas not found. Hydra will not initialize.")
                return () => {}
            }

            initHydra(canvas)

            if (typeof hydraPreset?.fn === "function") {
                applyPreset(hydraPreset.fn)
            } else {
                console.warn("[Hydra] Preset not found or invalid:", selectedPreset)
            }
        }

        // Store cleanup function for React to call on next render
        // (bridges the gap between renders - remembers old cleanup)
        cleanupRef.current = cleanup

        // React cleanup: Called before next effect run or on unmount
        return () => {
            if (typeof cleanupRef.current === "function") {
                cleanupRef.current()  // Call previous preset's cleanup
            }
        }
    }, [engineReady, selectedEngine, selectedPreset])  // Runs when any of these change

    return (
        <>
            {/* Three.js container - full viewport, visible only when selectedEngine === "three" */}
            <div
                ref={containerRef}
                id="three-container"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                    display: selectedEngine === "three" ? "block" : "none",
                }}
            />
            
            {/* Hydra canvas - full viewport, visible only when selectedEngine === "hydra" */}
            <canvas
                id="hydra-canvas"
                ref={hydraCanvasRef}
                style={{
                    position: "absolute",
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
