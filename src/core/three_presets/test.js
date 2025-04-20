import {
    initEngine,
    useScene,
    useCamera,
    useComposer,
    useTick,
} from '@core/engine/init.js'

import * as THREE from 'three'
import vertexShader from '../../shaders/vision.vert?raw'
import fragmentShader from '../../shaders/vision.frag?raw'

export async function test(container) {
    console.log('🧪 Shader-based test with audio reactivity')

    await initEngine(container)

    const scene = useScene()
    const camera = useCamera()
    const composer = useComposer()

    // 🎯 Background + lighting
    scene.background = new THREE.Color(0x000000)

    const ambientLight = new THREE.AmbientLight(0x333333)
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(10, 10, 10)
    scene.add(ambientLight, pointLight)

    // 🔺 Geometry
    const geometry = new THREE.IcosahedronGeometry(1, 5)

    const uniforms = {
        uTime: { value: 0 },
    }

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        wireframe: false,
    })

    const cube = new THREE.Mesh(geometry, material)
    cube.scale.set(3, 3, 3)
    scene.add(cube)

    // 🎥 Camera
    camera.position.set(0, 0, 5)
    camera.lookAt(cube.position)

    // 🎵 Tick-based animation
    useTick(({ time, bass, mid, treble }) => {
        uniforms.uTime.value = time

        // cube.rotation.x += 0.01 + mid * 0.05
        // cube.rotation.y += 0.01 + treble * 0.02

        // Optional: scale cube for dramatic bass pulse
        const scale = 2 + bass
        cube.scale.set(scale, scale, scale)

        composer.render()
    })
}
