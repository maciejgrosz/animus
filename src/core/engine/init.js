import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import TickManager from './tick-manager.js'
import { bassRef, midRef, trebleRef } from '../audioRefs.js'

let scene, camera, renderer, composer, controls
let renderWidth, renderHeight, renderAspectRatio

const renderTickManager = new TickManager()

// 🚀 Engine init
export const initEngine = async (container = document.body) => {
    scene = new THREE.Scene()

    container.style.position = 'relative'

    const bounds = container.getBoundingClientRect()
    renderWidth = bounds.width
    renderHeight = bounds.height
    renderAspectRatio = renderWidth / renderHeight

    camera = new THREE.PerspectiveCamera(75, renderAspectRatio, 0.1, 100)
    camera.position.z = 5

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(renderWidth, renderHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    // Style for canvas visibility
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

    // 📦 Post-processing
    composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // 🎮 Optional camera controls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // 📀 Responsive resizing
    window.addEventListener('resize', () => {
        const bounds = container.getBoundingClientRect()
        renderWidth = bounds.width
        renderHeight = bounds.height
        renderAspectRatio = renderWidth / renderHeight

        renderer.setSize(renderWidth, renderHeight)
        composer.setSize(renderWidth, renderHeight)

        camera.aspect = renderAspectRatio
        camera.updateProjectionMatrix()
    })

    renderTickManager.startLoop()
}

// 🧪 Hooks
export const useRenderer = () => renderer
export const useRenderSize = () => ({ width: renderWidth, height: renderHeight })
export const useScene = () => scene
export const useCamera = () => camera
export const useControls = () => controls
export const useComposer = () => composer

// 🧹 Add postprocessing passes
export const addPass = (pass) => composer?.addPass(pass)

// 🌀 Hook into animation loop
export const useTick = (fn) => {
    if (renderTickManager) {
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
    }
}
