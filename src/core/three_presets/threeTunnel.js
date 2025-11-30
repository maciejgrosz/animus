import * as THREE from 'three'
import fragmentShader from '../../shaders/tunnel.frag?raw'
import {
    useRenderer,
    useScene,
    useRenderSize,
    useTick
} from '@core/engine/init.js'
import { bassRef, midRef, trebleRef } from '@core/audioRefs'

export function createTunnel() {
    const renderer = useRenderer()
    const scene = useScene()
    const { width, height } = useRenderSize()

    // 🧹 Clean scene before use
    scene.clear()
    scene.background = null
    scene.fog = null

    // 🧭 Orthographic camera to keep shader centered
    const aspect = width / height
    const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10)
    camera.position.z = 1
    scene.add(camera)

    // 🎛️ Shader uniforms
    const uniforms = {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(width, height) },
        u_bass: { value: 0 },
        u_mid: { value: 0 },
        u_treble: { value: 0 },
    }

    const material = new THREE.ShaderMaterial({
        uniforms,
        fragmentShader,
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const clock = new THREE.Clock()

    const cleanupTick = useTick(() => {
        uniforms.u_time.value = clock.getElapsedTime()
        uniforms.u_bass.value = bassRef.current
        uniforms.u_mid.value = midRef.current
        uniforms.u_treble.value = trebleRef.current

        renderer.render(scene, camera)
    })

    return () => {
        cleanupTick()
        geometry.dispose()
        material.dispose()
        scene.remove(mesh)
        scene.remove(camera)
    }
}
