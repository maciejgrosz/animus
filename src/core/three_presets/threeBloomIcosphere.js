// createThreeBloomIcosphere.js
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { bassRef, midRef, trebleRef } from "../audioRefs";
import { createFixedSpringColumn } from "./modules/springColumns";
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
    scene.add(particleSystem);

    const leftColumn = createFixedSpringColumn(-6, scene);
    const rightColumn = createFixedSpringColumn(6, scene);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new OutputPass());

    const clock = new THREE.Clock();
    let frameId;
    let lastTreble = 0;
    let pulseActive = false;
    let pulseTimer = 0;

    function animate() {
        const time = clock.getElapsedTime();

        if (trebleRef.current > 0.8 && trebleRef.current - lastTreble > 0.05) {
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

        mesh.rotation.y += 0.002 + midRef.current * 0.01;
        mesh.rotation.x += 0.001 + midRef.current * 0.005;

        const waveFrequency = 2.0 + bassRef.current * 6.0;
        [leftColumn, rightColumn].forEach((col) => {
            const pos = col.geometry.attributes.position;
            for (let j = 0; j < pos.count; j++) {
                const y = col.userData.basePositions[j * 3 + 1];
                const angle = y * waveFrequency + time * 2.0;
                const z = Math.sin(angle) * 0.3;
                pos.setXYZ(j, col.userData.xOffset, y, z);
            }
            pos.needsUpdate = true;
        });

        particleSystem.rotation.y += 0.001;

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
