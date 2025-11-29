import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import TickManager from './tick-manager.js'
import { bassRef, midRef, trebleRef } from '../audioRefs.js'

let scene, camera, renderer, composer, controls, baseRenderPass
let renderWidth, renderHeight, renderAspectRatio
let initialized = false

const renderTickManager = new TickManager()

// 🚀 Engine init (called only once)
export const initEngine = async (container = document.body) => {
    if (initialized) return
    initialized = true

    scene = new THREE.Scene()

    container.style.position = 'relative'

    const bounds = container.getBoundingClientRect()
    renderWidth = bounds.width
    renderHeight = bounds.height
    renderAspectRatio = renderWidth / renderHeight

    camera = new THREE.PerspectiveCamera(75, renderAspectRatio, 0.1, 100)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(renderWidth, renderHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    Object.assign(renderer.domElement.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        display: 'block',
        background: '#000',
        zIndex: '0',
    })

    container.appendChild(renderer.domElement)

    composer = new EffectComposer(renderer)
    baseRenderPass = new RenderPass(scene, camera)
    composer.addPass(baseRenderPass)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    window.addEventListener('resize', handleResize)

    renderTickManager.startLoop()
}

const handleResize = () => {
    const bounds = renderer.domElement.parentNode?.getBoundingClientRect()
    if (!bounds) return

    renderWidth = bounds.width
    renderHeight = bounds.height
    renderAspectRatio = renderWidth / renderHeight

    renderer.setSize(renderWidth, renderHeight)
    composer.setSize(renderWidth, renderHeight)

    camera.aspect = renderAspectRatio
    camera.updateProjectionMatrix()
}

export const useRenderer = () => renderer
export const useRenderSize = () => ({ width: renderWidth, height: renderHeight })
export const useScene = () => scene
export const useCamera = () => camera
export const useControls = () => controls
export const useComposer = () => composer
export const addPass = (pass) => composer?.addPass(pass)

export const resetThreeState = () => {
    if (scene) {
        scene.traverse((obj) => {
            if (!obj.isMesh && !obj.isPoints && !obj.isLine) return

            if (obj.geometry) {
                obj.geometry.dispose()
            }

            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach((mat) => mat?.dispose?.())
                } else {
                    obj.material.dispose?.()
                }
            }
        })

        while (scene.children.length > 0) {
            scene.remove(scene.children[0])
        }
    }

    if (composer) {
        composer.passes.forEach((pass, index) => {
            if (index === 0) return
            pass.dispose?.()
        })

        composer.passes.length = Math.min(composer.passes.length, 1)
    }
}

export const useTick = (fn) => {
    if (!renderTickManager) return () => {}

    const _tick = (e) => {
        const { timestamp, timeDiff, frame } = e.data
        const time = performance.now() / 1000

        fn({
            bass: bassRef.current,
            mid: midRef.current,
            treble: trebleRef.current,
            time,
            timestamp,
            timeDiff,
            frame,
        })
    }

    renderTickManager.addEventListener('tick', _tick)

    return () => {
        renderTickManager.removeEventListener('tick', _tick)
    }
}

export const disposeEngine = () => {
    if (renderer) {
        if (renderer.domElement?.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement)
        }
        renderer.dispose()
    }

    if (composer) {
        composer.passes.forEach(pass => pass.dispose?.())
        composer.passes.length = 0
    }

    window.removeEventListener('resize', handleResize)

    scene = null
    camera = null
    renderer = null
    composer = null
    controls = null
    baseRenderPass = null
    renderWidth = null
    renderHeight = null
    renderAspectRatio = null
    initialized = false

    console.log('[Engine] Disposed engine and cleaned up WebGL context.')
}
