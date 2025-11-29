import * as THREE from 'three'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'

import {
    useRenderer,
    useScene,
    useCamera,
    useComposer,
    useTick,
    useRenderSize,
} from '@core/engine/init.js'

import { bassRef, midRef, trebleRef } from '@core/audioRefs'
import { createParticleHalo } from './modules/particleHalo'
import { setupSphereGeometry, deformSphere } from './modules/sphereLogic'

export function createThreeBloomIcosphere() {
    const renderer = useRenderer()
    const scene = useScene()
    const camera = useCamera()
    const composer = useComposer()
    const { width, height } = useRenderSize()

    scene.clear()
    camera.position.set(0, 0, 10)
    scene.fog = new THREE.Fog(0x000000, 8, 16)

    const {
        geometry,
        mesh,
        position,
        colorAttr,
        initialPositions,
        randomOffsets,
        scatterDirections,
    } = setupSphereGeometry()
    scene.add(mesh)

    const particleSystem = createParticleHalo()
    const particlePositions = particleSystem.geometry.attributes.position.array
    const baseParticlePositions = particlePositions.slice()
    scene.add(particleSystem)

    const ambientLight = new THREE.AmbientLight(0x555555)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1.2)
    pointLight.position.set(0, 0, 10)
    scene.add(pointLight)

    composer.passes.length = 0 // Clear previous passes
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(new OutputPass())

    const clock = new THREE.Clock()
    let lastTreble = 0
    let pulseActive = false
    let pulseTimer = 0
    let currentHue = 0

    const cleanupTick = useTick(() => {
        const time = clock.getElapsedTime()

        if (bassRef.current > 0.7 && trebleRef.current - lastTreble > 0.05) {
            pulseActive = true
            pulseTimer = time
        }
        lastTreble = trebleRef.current

        deformSphere({
            time,
            bass: bassRef.current,
            position,
            colorAttr,
            initialPositions,
            randomOffsets,
            scatterDirections,
            pulseActive,
            pulseTimer,
            treble: trebleRef.current,
        })

        const targetHue = (time * 0.05 + bassRef.current * 1.5 + trebleRef.current * 2) % 1.0
        currentHue += (targetHue - currentHue) * 0.05
        mesh.material.color.setHSL(currentHue, 1, 0.6)

        const bass = bassRef.current
        const positions = particleSystem.geometry.attributes.position.array
        for (let i = 0; i < positions.length; i += 3) {
            const bx = baseParticlePositions[i]
            const by = baseParticlePositions[i + 1]
            const bz = baseParticlePositions[i + 2]
            const boost = 1 + Math.sin(time * 10 + i) * 0.05 * bass * 10
            positions[i] = bx * boost
            positions[i + 1] = by * boost
            positions[i + 2] = bz * boost
        }
        particleSystem.geometry.attributes.position.needsUpdate = true

        mesh.rotation.y += 0.0002 + midRef.current * 0.001
        mesh.rotation.x += 0.0001 + midRef.current * 0.005

        particleSystem.rotation.y += 0.001 - 0.0001 * bassRef.current

        camera.lookAt(scene.position)
        composer.render()
    })

    return () => {
        cleanupTick()

        // Dispose geometries and materials
        geometry.dispose()
        mesh.material.dispose()
        scene.remove(mesh)

        particleSystem.geometry.dispose()
        particleSystem.material.dispose()
        scene.remove(particleSystem)

        scene.remove(ambientLight)
        scene.remove(pointLight)

        // Dispose post-processing passes
        composer.passes.forEach(pass => {
            if (pass.dispose) pass.dispose()
        })
        composer.passes.length = 0
    }
}
