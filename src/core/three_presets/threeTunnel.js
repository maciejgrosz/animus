import * as THREE from 'three'
import fragmentShader from '../../shaders/tunnel.frag?raw'
import {
    initEngine,
    useRenderer,
    useScene,
    useTick,
    useRenderSize,
} from '@core/engine/init.js'

import { bassRef, midRef, trebleRef } from '@core/audioRefs'

export async function createTunnel(container) {
    await initEngine(container)

    const renderer = useRenderer()
    const scene = useScene()
    const { width, height } = useRenderSize()

    // 📷 Use orthographic camera for full-screen quad
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    scene.clear()
    scene.add(camera)

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

    // 🕒 Time & audio-reactive updates
    const clock = new THREE.Clock()

    useTick(() => {
        uniforms.u_time.value = clock.getElapsedTime()
        uniforms.u_bass.value = bassRef.current
        uniforms.u_mid.value = midRef.current
        uniforms.u_treble.value = trebleRef.current

        renderer.render(scene, camera)
    })

    // 📐 Handle responsive resize
    const onResize = () => {
        const { width, height } = useRenderSize()
        uniforms.u_resolution.value.set(width, height)
        renderer.setSize(width, height)
    }
    window.addEventListener('resize', onResize)

    // 🔁 Return cleanup
    return () => {
        window.removeEventListener('resize', onResize)
        geometry.dispose()
        material.dispose()
        renderer.dispose()
    }
}
