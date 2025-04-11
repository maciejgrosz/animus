// threeSphereBassReactive.js
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { bassRef, midRef, trebleRef } from "../audioRefs";

export function createThreeBloomIcosphere(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);

    const geometry = new THREE.IcosahedronGeometry(2.2, 5);
    const colors = [];
    const randomOffsets = [];
    const scatterDirections = [];

    for (let i = 0; i < geometry.attributes.position.count; i++) {
        colors.push(1, 1, 1);
        randomOffsets.push(Math.random() * Math.PI * 2);
        const dir = new THREE.Vector3((Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)).normalize();
        scatterDirections.push(dir);
    }

    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.MeshBasicMaterial({
        vertexColors: true,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.5, 0.5, 0.5);
    scene.add(mesh);

    const position = geometry.attributes.position;
    const colorAttr = geometry.attributes.color;
    const initialPositions = position.array.slice();

    // Particle halo
    const particleCount = 3000;
    const particles = new THREE.BufferGeometry();
    const pos = [];
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 3.2 + Math.random() * 0.3;
        const y = (Math.random() - 0.5) * 2.5;
        pos.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    }
    particles.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x88ccff, size: 0.03, transparent: true, opacity: 0.6, depthWrite: false });
    const particleSystem = new THREE.Points(particles, particleMat);
    scene.add(particleSystem);

    // Sinusoidal columns
    function createFixedSpringColumn(xOffset) {
        const count = 1500;
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const y = (i / count - 0.5) * 10;
            const angle = y * 2;
            const x = xOffset;
            const z = Math.sin(angle) * 0.3;
            positions.set([x, y, z], i * 3);
        }

        geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({ color: 0xff66cc, size: 0.035, transparent: true, opacity: 0.65, depthWrite: false });

        const system = new THREE.Points(geom, mat);
        system.userData = { basePositions: positions.slice(), xOffset, geom };
        scene.add(system);
        return system;
    }

    const leftColumn = createFixedSpringColumn(-6);
    const rightColumn = createFixedSpringColumn(6);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new OutputPass());

    const clock = new THREE.Clock();
    let frameId;
    let lastTreble = 0;
    let pulseActive = false;
    let pulseTimer = 0;

    function deformSphere(time) {
        const bass = bassRef.current;
        const normalizedBass = Math.pow(Math.max(0, (bass - 0.2) / 0.8), 1.5);
        const bassBoost = normalizedBass * 3.5;

        for (let i = 0; i < position.count; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = ix + 2;
            const offset = randomOffsets[i];

            let dynamicPulse = 1.0 + Math.sin(time * 10 + offset) * 0.4 * bassBoost;

            if (bass > 0.85) {
                const scatter = bass * 2.0;
                const dir = scatterDirections[i];
                position.array[ix] = initialPositions[ix] * dynamicPulse + dir.x * scatter;
                position.array[iy] = initialPositions[iy] * dynamicPulse + dir.y * scatter;
                position.array[iz] = initialPositions[iz] * dynamicPulse + dir.z * scatter;
            } else {
                position.array[ix] = initialPositions[ix] * dynamicPulse;
                position.array[iy] = initialPositions[iy] * dynamicPulse;
                position.array[iz] = initialPositions[iz] * dynamicPulse;
            }
        }
        position.needsUpdate = true;
    }

    function animate() {
        const time = clock.getElapsedTime();

        if (trebleRef.current > 0.8 && trebleRef.current - lastTreble > 0.05) {
            pulseActive = true;
            pulseTimer = time;
        }
        lastTreble = trebleRef.current;

        deformSphere(time);

        for (let i = 0; i < colorAttr.count; i++) {
            let r = 0.7, g = 0.7, b = 0.7;
            if (pulseActive && time - pulseTimer < 0.5) {
                r = 0.5 + 0.5 * Math.sin(i + time * 10);
                g = 0.5 + 0.5 * Math.sin(i + time * 10 + 2);
                b = 0.5 + 0.5 * Math.sin(i + time * 10 + 4);
            }
            colorAttr.setXYZ(i, r, g, b);
        }
        colorAttr.needsUpdate = true;

        mesh.rotation.y += 0.002 + midRef.current * 0.01;
        mesh.rotation.x += 0.001 + midRef.current * 0.005;

        // Update left and right columns
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
        material.dispose();
        particles.dispose();
        renderer.dispose();
    };
}