import * as THREE from 'three'

let scene, camera, renderer

export const initEngine = async (container = document.body) => {
    scene = new THREE.Scene()

    const bounds = container.getBoundingClientRect()
    const width = bounds.width
    const height = bounds.height
    const aspect = width / height

    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100)
    camera.position.z = 5

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'

    container.appendChild(renderer.domElement)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'
    renderer.domElement.style.zIndex = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'

}

export const useScene = () => scene
export const useCamera = () => camera
export const useRenderer = () => renderer




// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// // import Stats from 'three/examples/jsm/libs/stats.module.js'
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
// import TickManager from './tick-manager.js'
//
// let scene,
//     camera,
//     renderer,
//     composer,
//     controls,
//     // stats,
//     renderWidth,
//     renderHeight,
//     renderAspectRatio
//
// const renderTickManager = new TickManager()
//
// // Store live audio values
// let audioFeatures = {
//     bass: 0,
//     mid: 0,
//     treble: 0,
//     time: 0,
// }
//
// // Listen for audio updates via BroadcastChannel
// const channel = new BroadcastChannel('audio-features')
// channel.onmessage = (e) => {
//     const { bass, mid, treble } = e.data
//     audioFeatures.bass = bass
//     audioFeatures.mid = mid
//     audioFeatures.treble = treble
// }
// export const initEngine = async (container = document.body) => {
//     scene = new THREE.Scene()
//
//     container.style.position = 'relative'
//
//     const bounds = container.getBoundingClientRect()
//     renderWidth = bounds.width
//     renderHeight = bounds.height
//     renderAspectRatio = renderWidth / renderHeight
//
//     camera = new THREE.PerspectiveCamera(75, renderAspectRatio, 0.1, 100)
//     camera.position.z = 5
//
//     renderer = new THREE.WebGLRenderer({ antialias: true })
//     renderer.setSize(renderWidth, renderHeight, false)
//     renderer.setPixelRatio(window.devicePixelRatio)
//     renderer.domElement.style.width = '100%'
//     renderer.domElement.style.height = '100%'
//     renderer.domElement.style.display = 'block'
//
//     container.appendChild(renderer.domElement)
//
//     composer = new EffectComposer(renderer)
//     const renderPass = new RenderPass(scene, camera)
//     composer.addPass(renderPass)
//
//     renderTickManager.startLoop()
// }
// // export const initEngine = async (container = document.body) => {
// //     scene = new THREE.Scene()
// //
// //     // ✅ Use container size, not window
// //     renderWidth = container.clientWidth
// //     renderHeight = container.clientHeight
// //     renderAspectRatio = renderWidth / renderHeight
// //
// //     camera = new THREE.PerspectiveCamera(75, renderAspectRatio, 0.1, 100)
// //     camera.position.z = 2
// //
// //     renderer = new THREE.WebGLRenderer({ antialias: true })
// //     renderer.setSize(renderWidth, renderHeight)
// //     renderer.setPixelRatio(window.devicePixelRatio)
// //     renderer.shadowMap.enabled = true
// //     renderer.shadowMap.type = THREE.PCFSoftShadowMap
// //
// //     // Ensure canvas fills container
// //     renderer.domElement.style.width = '100%'
// //     renderer.domElement.style.height = '100%'
// //     renderer.domElement.style.display = 'block'
// //
// //     container.appendChild(renderer.domElement)
// //
// //     const target = new THREE.WebGLRenderTarget(renderWidth, renderHeight, {
// //         samples: 8,
// //     })
// //     composer = new EffectComposer(renderer, target)
// //     const renderPass = new RenderPass(scene, camera)
// //     composer.addPass(renderPass)
// //
// //     // stats = Stats()
// //     // container.appendChild(stats.dom)
// //
// //     controls = new OrbitControls(camera, renderer.domElement)
// //     controls.enableDamping = true
// //
// //     window.addEventListener('resize', () => {
// //         // Recalculate from container, not window
// //         renderWidth = container.clientWidth
// //         renderHeight = container.clientHeight
// //         renderAspectRatio = renderWidth / renderHeight
// //
// //         renderer.setPixelRatio(window.devicePixelRatio)
// //         renderer.setSize(renderWidth, renderHeight)
// //
// //         camera.aspect = renderAspectRatio
// //         camera.updateProjectionMatrix()
// //
// //         composer.setSize(renderWidth, renderHeight)
// //     })
// //
// //     renderTickManager.startLoop()
// // }
//
// export const useRenderer = () => renderer
// export const useRenderSize = () => ({ width: renderWidth, height: renderHeight })
// export const useScene = () => scene
// export const useCamera = () => camera
// export const useControls = () => controls
// // export const useStats = () => stats
// export const useComposer = () => composer
//
// export const addPass = (pass) => {
//     composer.addPass(pass)
// }
//
// export const useTick = (fn) => {
//     if (renderTickManager) {
//         const _tick = (e) => {
//             const { timestamp, timeDiff, frame } = e.data
//
//             const time = performance.now() / 1000
//             fn({
//                 ...audioFeatures,
//                 time,
//                 timestamp,
//                 timeDiff,
//                 frame,
//             })
//         }
//
//         renderTickManager.addEventListener('tick', _tick)
//     }
// }
