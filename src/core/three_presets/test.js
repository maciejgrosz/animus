import {
    initEngine,
    useScene,
    useCamera,
    useTick,
    useComposer,
} from '@core/engine/init.js'

import * as THREE from 'three'

export async function test(container) {
    console.log('🧪 Final sanity test with audio reactivity')

    await initEngine(container)

    const scene = useScene()
    const camera = useCamera()
    const composer = useComposer()

    scene.background = new THREE.Color(0x000000)

    // 🔺 Create cube
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x00ffcc),
        emissive: new THREE.Color(0x001111),
        metalness: 0.5,
        roughness: 0.3,
    })

    const cube = new THREE.Mesh(geometry, material)
    cube.scale.set(3, 3, 3)
    scene.add(cube)

    // 🎯 Camera setup
    camera.position.set(0, 0, 5)
    camera.lookAt(cube.position)

    // 💡 Light for StandardMaterial
    const light = new THREE.PointLight(0xffffff, 1)
    light.position.set(10, 10, 10)
    scene.add(light)

    const ambient = new THREE.AmbientLight(0x333333)
    scene.add(ambient)

    // 🎵 Audio-reactive tick
    useTick(({ bass, mid, treble, time }) => {
        const scale = 2 + bass
        cube.scale.set(scale, scale, scale)

        cube.rotation.x += 0.01 + mid * 0.05
        cube.rotation.y += 0.01 + treble * 0.02
        // Color shift based on time + treble
        const hue = (time * 0.1 + treble * 0.5) % 1
        material.color.setHSL(hue, 0.7, 0.5)

        composer.render()
    })
}
