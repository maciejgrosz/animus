import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
    useScene,
    useCamera,
    useRenderer,
    useComposer,
    useRenderSize,
    addPass,
    useTick
} from '@core/engine/init.js'

import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { bassRef, trebleRef, midRef } from '@core/audioRefs'

export function skull() {
    const scene = useScene()
    const camera = useCamera()
    const renderer = useRenderer()
    const composer = useComposer()
    const { width, height } = useRenderSize()

    scene.clear()
    scene.fog = new THREE.Fog(0x000000, 8, 16)

    // Reset camera
    camera.position.set(0, 1.5, 6)
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    // Set background
    const loaderBG = new THREE.TextureLoader()
    loaderBG.load('/assets/textures/56.43.png', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        texture.colorSpace = THREE.SRGBColorSpace
        scene.background = texture
    })

    // Lights
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(2, 2, 2)
    scene.add(light)

    const ambient = new THREE.AmbientLight(0x404040)
    scene.add(ambient)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enableZoom = false
    controls.enablePan = false

    // GLTF
    let model = null
    const orbitSkulls = []
    const shockwaveRings = []

    const loader = new GLTFLoader()
    loader.load('/assets/textures/zielona_czacha.glb', (gltf) => {
        model = gltf.scene
        model.traverse((child) => {
            if (child.isMesh) {
                child.geometry = child.geometry.toNonIndexed().clone()
                const isEye = child.name.toLowerCase().includes('eye') || child.position.y > 1.2

                child.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(0, 1, 0.55),
                    emissive: new THREE.Color().setHSL(0, 0.5, 0.25),
                    roughness: 0.4,
                    metalness: 0.2,
                    wireframe: !isEye,
                })
            }
        })
        model.scale.set(0.8, 0.8, 0.8)
        scene.add(model)
    })

    // Postprocessing
    addPass(new RenderPass(scene, camera))
    addPass(new OutputPass())

    const electronLayers = []
    const electronMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.02,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
    })

    const axes = ['x', 'y', 'z']
    for (let i = 1; i <= 3; i++) {
        axes.forEach((axis, layerIndex) => {
            const radius = 1.5 * i
            const points = []
            const count = 60
            for (let j = 0; j < count; j++) {
                const angle = (j / count) * Math.PI * 2
                const noise = (Math.random() - 0.5) * 0.1
                const x = Math.cos(angle) * (radius + noise)
                const y = 0
                const z = Math.sin(angle) * (radius + noise)
                points.push(new THREE.Vector3(x, y, z))
            }
            const buffer = new THREE.BufferGeometry().setFromPoints(points)
            const orbit = new THREE.Points(buffer, electronMaterial)

            if (axis === 'x') orbit.rotation.z = Math.PI / 2
            if (axis === 'z') orbit.rotation.x = Math.PI / 2

            electronLayers.push(orbit)
            scene.add(orbit)

            const skullGroup = new THREE.Object3D()
            skullGroup.userData = { axis, radius, angleOffset: layerIndex * 0.5 + i }
            orbitSkulls.push(skullGroup)
        })
    }

    let currentHue = 0
    let cameraAngle = 0
    let cameraRadius = 6
    let lastBassTrigger = 0

    function createShockwaveRing() {
        const geometry = new THREE.RingGeometry(1.5, 0.82, 64)
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(currentHue, 1, 0.6),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })
        const ring = new THREE.Mesh(geometry, material)
        ring.rotation.x = -Math.PI / 2
        ring.position.y = 0
        scene.add(ring)
        shockwaveRings.push({ ring, scale: 5 })
    }

    const cleanupTick = useTick(() => {
        controls.update()
        const time = performance.now() / 1000
        const bass = bassRef.current
        const mid = midRef.current
        const treble = trebleRef.current

        const targetHue = (time * 0.05 + treble * 1.5) % 1.0
        currentHue += (targetHue - currentHue) * 0.05

        cameraAngle += 0.01 + treble * 0.0005
        cameraRadius = 7

        const camX = Math.sin(cameraAngle) * cameraRadius
        const camZ = Math.cos(cameraAngle) * cameraRadius
        const camY = 1.5 + Math.sin(time * 0.6) * 0.4 * mid
        camera.position.set(camX, camY, camZ)
        camera.lookAt(new THREE.Vector3(0, 1, 0))

        if (bass > 0.6 && time - lastBassTrigger > 0.5) {
            createShockwaveRing()
            lastBassTrigger = time
        }

        shockwaveRings.forEach((entry, index) => {
            entry.scale += 0.02
            entry.ring.scale.set(entry.scale, entry.scale, entry.scale)
            entry.ring.material.opacity *= 0.96
            entry.ring.material.color.setHSL(currentHue, 1, 0.6)
            if (entry.ring.material.opacity < 0.01) {
                scene.remove(entry.ring)
                shockwaveRings.splice(index, 1)
            }
        })

        electronLayers.forEach((orbit, index) => {
            orbit.rotation.y = time * (0.2 + index * 0.05)
        })

        // model visual feedback
        if (model) {
            model.traverse((child) => {
                if (child.isMesh && child.material && child.material.color) {
                    child.material.color.setHSL(currentHue, 0.8, 0.55)
                    child.material.emissive.setHSL(currentHue, 0.5, 0.25)
                }
            })
        }

        renderer.render(scene, camera)
    })

    return () => {
        cleanupTick()
        scene.clear()
        // 🧼 Explicitly clear background and fog
        scene.background = null
        scene.fog = null
    }
}
