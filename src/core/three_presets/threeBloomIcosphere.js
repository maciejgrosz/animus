// createThreeBloomIcosphere.js
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { bassRef, midRef, trebleRef } from "../audioRefs";
import { createParticleHalo } from "./modules/particleHalo";
import { setupSphereGeometry, deformSphere } from "./modules/sphereLogic";

export function createThreeBloomIcosphere(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 8, 16);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);

    const { geometry, mesh, position, colorAttr, initialPositions, randomOffsets, scatterDirections } = setupSphereGeometry();
    scene.add(mesh);

    const particleSystem = createParticleHalo();
    const particlePositions = particleSystem.geometry.attributes.position.array;
    const baseParticlePositions = particlePositions.slice();
    scene.add(particleSystem);

    // Add ambient light and point light for better visibility
    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new OutputPass());

    const clock = new THREE.Clock();
    let frameId;
    let lastTreble = 0;
    let pulseActive = false;
    let pulseTimer = 0;

    let currentHue = 0;

    function animate() {
        const time = clock.getElapsedTime();

        if (bassRef.current > 0.7 && trebleRef.current - lastTreble > 0.05) {
            pulseActive = true;
            pulseTimer = time;
        }
        lastTreble = trebleRef.current;

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
        });

        // 🌈 Gentle neon shifting color effect based on mic input
        const targetHue = (time * 0.05 + bassRef.current * 1.5 + trebleRef.current * 2) % 1.0;
        currentHue += (targetHue - currentHue) * 0.05; // Smooth transition
        mesh.material.color.setHSL(currentHue, 1, 0.6);

        // Animate particles if bass is high
        const bass = bassRef.current;
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const bx = baseParticlePositions[i];
            const by = baseParticlePositions[i + 1];
            const bz = baseParticlePositions[i + 2];
            const boost = 1 + Math.sin(time * 10 + i) * 0.05 * bass * 10;
            positions[i] = bx * boost;
            positions[i + 1] = by * boost;
            positions[i + 2] = bz * boost;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;

        mesh.rotation.y += 0.0002 + midRef.current * 0.001;
        mesh.rotation.x += 0.0001 + midRef.current * 0.005;

        particleSystem.rotation.y += 0.001 - 0.0001 * bassRef.current;

        camera.lookAt(scene.position);
        composer.render();
        frameId = requestAnimationFrame(animate);
    }
    animate();

    const resizeHandler = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", resizeHandler);

    return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", resizeHandler);
        geometry.dispose();
        mesh.material.dispose();
        particleSystem.geometry.dispose();
        particleSystem.material.dispose();
        renderer.dispose();
    };
}
