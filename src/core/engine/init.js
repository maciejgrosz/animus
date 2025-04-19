import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import TickManager from './tick-manager.js'

let scene,
    camera,
    renderer,
    composer,
    controls,
    stats,
    renderWidth,
    renderHeight,
    renderAspectRatio

const renderTickManager = new TickManager()

// Store live audio values
let audioFeatures = {
    bass: 0,
    mid: 0,
    treble: 0,
    time: 0,
}

// Listen for audio updates via BroadcastChannel
const channel = new BroadcastChannel('audio-features')
channel.onmessage = (e) => {
    const { bass, mid, treble } = e.data
    audioFeatures.bass = bass
    audioFeatures.mid = mid
    audioFeatures.treble = treble
}

export const initEngine = async (container = document.body) => {
    scene = new THREE.Scene()

    renderWidth = window.innerWidth
    renderHeight = window.innerHeight
    renderAspectRatio = renderWidth / renderHeight

    camera = new THREE.PerspectiveCamera(75, renderAspectRatio, 0.1, 100)
    camera.position.z = 2

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(renderWidth, renderHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setPixelRatio(window.devicePixelRatio * 1.5)

    container.appendChild(renderer.domElement)

    const target = new THREE.WebGLRenderTarget(renderWidth, renderHeight, {
        samples: 8,
    })
    composer = new EffectComposer(renderer, target)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    stats = Stats()
    container.appendChild(stats.dom)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    window.addEventListener('resize', () => {
        renderWidth = window.innerWidth
        renderHeight = window.innerHeight
        renderAspectRatio = renderWidth / renderHeight

        renderer.setPixelRatio(window.devicePixelRatio * 1.5)
        camera.aspect = renderAspectRatio
        camera.updateProjectionMatrix()
        renderer.setSize(renderWidth, renderHeight)
        composer.setSize(renderWidth, renderHeight)
    })

    renderTickManager.startLoop()
}

export const useRenderer = () => renderer
export const useRenderSize = () => ({ width: renderWidth, height: renderHeight })
export const useScene = () => scene
export const useCamera = () => camera
export const useControls = () => controls
export const useStats = () => stats
export const useComposer = () => composer

export const addPass = (pass) => {
    composer.addPass(pass)
}

export const useTick = (fn) => {
    if (renderTickManager) {
        const _tick = (e) => {
            const time = performance.now() / 1000
            audioFeatures.time = time
            fn({ ...audioFeatures })
        }
        renderTickManager.addEventListener('tick', _tick)
    }
}
