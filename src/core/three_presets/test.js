import * as THREE from 'three'
import { bassRef, midRef, trebleRef } from '@core/audioRefs'
import fragmentShader from '../../shaders/alienCore.frag?raw'

export function test(container) {
    const scene = new THREE.Scene()

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    const uniforms = {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        uBass: { value: 0 },
        uMid: { value: 0 },
        uTreble: { value: 0 }
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
        fragmentShader
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const clock = new THREE.Clock()

    function animate() {
        requestAnimationFrame(animate)

        uniforms.uTime.value = clock.getElapsedTime()
        uniforms.uBass.value = bassRef.current
        uniforms.uMid.value = midRef.current
        uniforms.uTreble.value = trebleRef.current

        renderer.render(scene, camera)
    }
    animate()

    return () => {
        renderer.dispose()
        container.removeChild(renderer.domElement)
    }
}
