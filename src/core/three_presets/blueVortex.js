import * as THREE from 'three'
import { bassRef, midRef, trebleRef } from '@core/audioRefs'
import fragmentShader from '../../shaders/blueVortex.frag?raw'
import {
    useRenderer,
    useScene,
    useRenderSize,
    useTick
} from '@core/engine/init.js'

export function blueVortex() {
    const renderer = useRenderer()
    const scene = useScene()
    const { width, height } = useRenderSize()

    if (!scene || !renderer) {
        console.warn('[blueVortex] Renderer or scene not initialized')
        return () => {}
    }

    // 🧹 Clear previous state
    scene.clear()
    scene.background = null
    scene.fog = null

    // 🎥 Centered orthographic camera
    // const aspect = width / height
    const camera = new THREE.OrthographicCamera(0, 0, 1, -1000, 0.1, 10)
    camera.position.z = 1
    scene.add(camera)

    // 🎛️ Shader uniforms
    const uniforms = {
        iResolution: { value: new THREE.Vector2(width, height) },
        iTime: { value: 0 },
        uBass: { value: 0 },
        uMid: { value: 0 },
        uTreble: { value: 0 },
    }

    const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader,
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const clock = new THREE.Clock()

    const cleanupTick = useTick(() => {
        uniforms.iTime.value = clock.getElapsedTime()
        uniforms.uBass.value = bassRef.current
        uniforms.uMid.value = midRef.current
        uniforms.uTreble.value = trebleRef.current

        renderer.render(scene, camera)
    })

    return () => {
        cleanupTick()
        scene.remove(mesh)
        scene.remove(camera)
        geometry.dispose()
        material.dispose()
    }
}
