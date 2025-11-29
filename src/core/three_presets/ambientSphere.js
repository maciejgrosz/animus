import * as THREE from 'three'
import {
    initEngine,
    useRenderer,
    useScene,
    useCamera,
    useComposer,
    useTick,
    useRenderSize,
} from '@core/engine/init.js'
import { bassRef, midRef, trebleRef } from '@core/audioRefs'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'

export async function ambientSphere(container) {
    await initEngine(container)

    const renderer = useRenderer()
    const scene = useScene()
    const camera = useCamera()
    const composer = useComposer()
    const { width, height } = useRenderSize()

    scene.fog = new THREE.Fog(0x000000, 10, 20)
    camera.position.set(0, 0, 10)

    const geometry = new THREE.IcosahedronGeometry(2.2, 5)
    const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color('hsl(180, 60%, 65%)'),
        shininess: 100,
        side: THREE.DoubleSide,
        emissive: new THREE.Color('#222222'),
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.95,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    scene.add(mesh)

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshPhongMaterial({ color: 0x222222, shininess: 100 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -3
    ground.receiveShadow = true
    scene.add(ground)

    const initialPositions = geometry.attributes.position.array.slice()
    const position = geometry.attributes.position

    const particles = new THREE.BufferGeometry()
    const particleCount = 3000
    const pos = []
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const radius = 3.2 + Math.random() * 0.8
        const phi = Math.acos(2 * Math.random() - 1)
        pos.push(
            Math.sin(phi) * Math.cos(angle) * radius,
            Math.sin(phi) * Math.sin(angle) * radius,
            Math.cos(phi) * radius
        )
    }
    particles.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    const particleMat = new THREE.PointsMaterial({
        color: 0x99ccff,
        size: 0.025,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
    })
    const particleSystem = new THREE.Points(particles, particleMat)
    scene.add(particleSystem)

    scene.add(new THREE.AmbientLight(0x333333))

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.shadow.camera.near = 1
    directionalLight.shadow.camera.far = 20
    scene.add(directionalLight)

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.8, 0.6, 0.1)
    composer.addPass(bloomPass)
    composer.addPass(new OutputPass())

    const clock = new THREE.Clock()

    // ✅ Capture the tick cleanup function
    const cleanupTick = useTick(() => {
        const time = clock.getElapsedTime()

        const smoothBass = Math.pow(bassRef.current, 1.3)
        const wave = Math.sin(time * 0.3) * 0.15

        for (let i = 0; i < position.count; i++) {
            const ix = i * 3
            const iy = ix + 1
            const iz = ix + 2
            const offset = 1 + wave + smoothBass * 0.15 * Math.sin(time + i * 0.01)
            position.array[ix] = initialPositions[ix] * offset
            position.array[iy] = initialPositions[iy] * offset
            position.array[iz] = initialPositions[iz] * offset
        }
        position.needsUpdate = true

        const hue = (time * 0.015 + bassRef.current * 0.05 + midRef.current * 0.02) % 1
        material.color.setHSL(hue, 0.5, 0.6)
        material.emissive.setHSL(hue, 0.6, 0.3)

        mesh.rotation.y += 0.00012 + midRef.current * 0.0003
        mesh.rotation.x += 0.00008 + trebleRef.current * 0.0002

        particleSystem.rotation.y += 0.0001

        composer.render()
    })

    const resizeHandler = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        composer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', resizeHandler)

    // ✅ Call cleanupTick on cleanup
    return () => {
        cleanupTick()
        window.removeEventListener('resize', resizeHandler)
        
        // Dispose main mesh
        geometry.dispose()
        material.dispose()
        scene.remove(mesh)
        
        // Dispose ground
        ground.geometry.dispose()
        ground.material.dispose()
        scene.remove(ground)
        
        // Dispose particle system
        particleSystem.geometry.dispose()
        particleSystem.material.dispose()
        scene.remove(particleSystem)
        
        // Remove lights
        scene.remove(scene.children.find(child => child.type === 'AmbientLight'))
        scene.remove(directionalLight)
        
        // Dispose post-processing passes
        composer.passes.forEach(pass => {
            if (pass.dispose) pass.dispose()
        })
        composer.passes.length = 0
    }
}
