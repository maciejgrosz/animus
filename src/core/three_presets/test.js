import {
    initEngine,
    useScene,
    useCamera,
    useRenderer,
} from '@core/engine/init.js'

import * as THREE from 'three'

export async function test(canvas) {
    await initEngine(canvas)

    const scene = useScene()
    const camera = useCamera()
    const renderer = useRenderer()

    scene.background = new THREE.Color(0x111111)
    camera.position.z = 3

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    function animate() {
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
    }

    animate()
}
