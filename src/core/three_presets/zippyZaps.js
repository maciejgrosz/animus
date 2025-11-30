import * as THREE from 'three'
import fragmentShader from '../../shaders/zippyZaps.frag?raw'
import {
    useRenderer,
    useScene,
    useRenderSize,
    useTick
} from '@core/engine/init.js'
import { bassRef } from '@core/audioRefs'

export function zippyZaps() {
    const renderer = useRenderer()
    const scene = useScene()
    const { width, height } = useRenderSize()

    // Clean scene before use
    scene.clear()
    scene.background = null
    scene.fog = null

    // Orthographic camera
    const aspect = width / height
    const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 10)
    camera.position.z = 1
    scene.add(camera)

    // Shader uniforms
    const uniforms = {
        iResolution: { value: new THREE.Vector3(width, height, 1) },
        iTime: { value: 0 },
        bass: { value: 0 },
        smoothedBass: { value: 0 }
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
    let smoothedBass = 0

    const cleanupTick = useTick(() => {
        const time = clock.getElapsedTime()
        uniforms.iTime.value = time
        uniforms.iResolution.value.set(width, height, 1)

        // Audio
        const currentBass = bassRef.current
        uniforms.bass.value = currentBass

        const smoothingFactor = 0.05
        smoothedBass += (currentBass - smoothedBass) * smoothingFactor
        uniforms.smoothedBass.value = smoothedBass

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
