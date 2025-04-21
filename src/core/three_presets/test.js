import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { bassRef, trebleRef, midRef } from '@core/audioRefs'

export function test(container) {
    const scene = new THREE.Scene()

    // 🌌 Add textured background
    const loaderBG = new THREE.TextureLoader()
    loaderBG.load('/assets/textures/56.43.png', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        texture.colorSpace = THREE.SRGBColorSpace
        scene.background = texture
    })

    scene.fog = new THREE.Fog(0x000000, 8, 16)

    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    )
    camera.position.set(0, 1.5, 6)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)

    Object.assign(renderer.domElement.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        display: 'block',
        background: '#000',
        zIndex: '0',
    })

    container.appendChild(renderer.domElement)

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(new OutputPass())

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(2, 2, 2)
    scene.add(light)

    const ambient = new THREE.AmbientLight(0x404040)
    scene.add(ambient)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    let model = null
    const orbitSkulls = []

    const loader = new GLTFLoader()
    loader.load(
        '/assets/textures/zielona_czacha.glb',
        (gltf) => {
            model = gltf.scene
            model.traverse((child) => {
                if (child.isMesh) {
                    child.geometry = child.geometry.toNonIndexed().clone()
                    child.geometry = child.geometry.clone().toNonIndexed()

                    const isEye = child.name.toLowerCase().includes('eye') || child.position.y > 1.2

                    child.material = new THREE.MeshStandardMaterial({
                        color: isEye ? new THREE.Color(0x111111) : new THREE.Color(0x00ffff),
                        emissive: isEye ? new THREE.Color(0x000000) : new THREE.Color(0x111144),
                        roughness: 0.4,
                        metalness: 0.2,
                        wireframe: !isEye,
                    })
                }
            })
            model.scale.set(0.8, 0.8, 0.8)
            scene.add(model)

            orbitSkulls.forEach((skull, index) => {
                const clone = model.clone(true)
                clone.scale.set(0.1, 0.1, 0.1)
                skull.add(clone)
                skull.userData.mesh = clone
                scene.add(skull)
            })
        },
        undefined,
        (err) => {
            console.error('Error loading GLB model:', err)
        }
    )

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

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(container.clientWidth, container.clientHeight)
        composer.setSize(container.clientWidth, container.clientHeight)
    })

    function animate() {
        requestAnimationFrame(animate)
        controls.update()

        const time = performance.now() / 1000

        electronLayers.forEach((orbit, index) => {
            orbit.rotation.y = time * (0.2 + index * 0.05)
        })

        orbitSkulls.forEach((skull, i) => {
            const t = time * 0.5 + skull.userData.angleOffset
            const r = skull.userData.radius

            let x = Math.cos(t) * r
            let y = 0
            let z = Math.sin(t) * r

            if (skull.userData.axis === 'x') {
                ;[y, z] = [z, y]
            } else if (skull.userData.axis === 'z') {
                ;[x, y] = [y, x]
            }

            skull.position.set(x, y, z)
            skull.rotation.y = t

            const hue = (time * 0.1 + i * 0.05) % 1
            skull.traverse((child) => {
                if (child.isMesh && child.material) {
                    const color = new THREE.Color().setHSL(hue, 1, 0.55)
                    const emissive = new THREE.Color().setHSL(hue, 0.8, 0.3)
                    child.material.color.copy(color)
                    child.material.emissive.copy(emissive)
                }
            })
        })

        if (model) {
            const bass = bassRef.current
            const mid = midRef.current
            const treble = trebleRef.current

            model.traverse((child) => {
                if (child.isMesh && child.material && child.material.color && !child.material.wireframe) {
                    const wave = Math.sin(time * 0.5 + child.position.x * 2.5) * 0.5 + 0.5
                    const hue = (treble * 0.8 + wave * 0.2 + time * 0.05) % 1
                    const color = new THREE.Color().setHSL(hue, 0.8, 0.55)
                    const emissive = new THREE.Color().setHSL(hue, 0.5, 0.25)
                    child.material.color.copy(color)
                    child.material.emissive.copy(emissive)
                }

                if (child.isMesh && child.geometry.attributes.position) {
                    const pos = child.geometry.attributes.position
                    const base = child.geometry.userData?.basePositions

                    if (!base) {
                        const cloned = pos.array.slice()
                        child.geometry.userData.basePositions = cloned
                    }

                    const baseArray = child.geometry.userData.basePositions

                    for (let i = 0; i < pos.count; i++) {
                        const ix = i * 3
                        const iy = ix + 1
                        const iz = ix + 2

                        const direction = new THREE.Vector3(
                            pos.array[ix],
                            pos.array[iy],
                            pos.array[iz]
                        ).normalize()

                        const bassPulse = Math.sin(time * 0.3 + i * 0.15) * 1.5 * bass
                        const midDisplace = Math.sin(time * 0.7 + i * 0.1) * 0.4 * mid

                        pos.array[ix] = baseArray[ix] + direction.x * (bassPulse + midDisplace)
                        pos.array[iy] = baseArray[iy] + direction.y * (bassPulse + midDisplace)
                        pos.array[iz] = baseArray[iz] + direction.z * (bassPulse + midDisplace)
                    }

                    pos.needsUpdate = true
                }
            })
        }

        composer.render()
    }
    animate()

    return () => {
        renderer.dispose()
        container.removeChild(renderer.domElement)
    }
}
