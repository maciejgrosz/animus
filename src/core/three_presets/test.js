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

    scene.background = new THREE.Color(0xf0f0f0)

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(0, 0, 0)
    scene.add(cube)

    // 💡 Add grid for sanity
    const grid = new THREE.GridHelper(10, 10)
    scene.add(grid)

    // ✅ Camera should be in front of cube, looking at it
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)

    // 👁 Sanity check label
    const label = document.createElement('div')
    label.innerText = '👁'
    label.style.position = 'absolute'
    label.style.top = '10px'
    label.style.left = '10px'
    label.style.color = 'lime'
    label.style.zIndex = 9999
    container.appendChild(label)

    // 📐 Debug render size
    console.log('📐 Canvas size:', renderer.domElement.width, renderer.domElement.height)

    const animate = () => {
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
    }

    animate()
}
