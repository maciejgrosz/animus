import {
    initEngine,
    useScene,
    useCamera,
    useRenderer
} from '@core/engine/init.js'

import * as THREE from 'three'

export async function test(container) {
    console.log('🧪 Final sanity test (for real)')

    await initEngine(container)

    const scene = useScene()
    const camera = useCamera()
    const renderer = useRenderer()

    scene.background = new THREE.Color(0x000000)

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: false
    })

    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(0, 0, 0)
    cube.scale.set(3, 3, 3)
    scene.add(cube)

    // ✅ Camera should be in front of cube, looking at it
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)


    const animate = () => {
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
    }

    animate()
}
