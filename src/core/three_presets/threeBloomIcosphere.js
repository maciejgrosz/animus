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
    for (let i = 0; i < geometry.attributes.position.count; i++) {
        colors.push(1, 1, 1); // domyślnie jasny kolor (biały)
        randomOffsets.push(Math.random() * Math.PI * 2);
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
    const particleMat = new THREE.PointsMaterial({
        color: 0x88ccff,
        size: 0.03,
        transparent: true,
        opacity: 0.6,
        depthWrite: false
    });

    const particleSystem = new THREE.Points(particles, particleMat);
    scene.add(particleSystem);

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
        const mat = new THREE.PointsMaterial({
            color: 0xff66cc,
            size: 0.035,
            transparent: true,
            opacity: 0.65,
            depthWrite: false
        });

        const system = new THREE.Points(geom, mat);
        system.userData = { basePositions: positions.slice(), xOffset, geom };
        scene.add(system);
        return system;
    }

    function createTubeParticles(baseColumn, radius = 0.15, segments = 8) {
        const basePos = baseColumn.geometry.attributes.position;
        const count = basePos.count;
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array(count * segments * 3);

        for (let i = 0; i < count; i++) {
            const baseY = basePos.getY(i);
            const baseX = baseColumn.userData.xOffset;
            const baseZ = basePos.getZ(i);

            for (let j = 0; j < segments; j++) {
                const angle = (j / segments) * Math.PI * 2;
                const x = baseX + Math.cos(angle) * radius;
                const z = baseZ + Math.sin(angle) * radius;
                const idx = (i * segments + j) * 3;
                positions.set([x, baseY, z], idx);
            }
        }

        geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.015,
            transparent: true,
            opacity: 0.5,
            depthWrite: false
        });

        const system = new THREE.Points(geom, mat);
        system.userData = { baseColumn, geom, segments };
        scene.add(system);
        return system;
    }

    const leftColumn = createFixedSpringColumn(-6);
    const rightColumn = createFixedSpringColumn(6);
    const leftTube = createTubeParticles(leftColumn);
    const rightTube = createTubeParticles(rightColumn);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 2, 5);
    scene.add(directionalLight);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new OutputPass());

    const clock = new THREE.Clock();
    let frameId;
    let lastTreble = 0;
    let pulseActive = false;
    let pulseTimer = 0;

    function deformSphere(time) {
        for (let i = 0; i < position.count; i++) {
            const ix = i * 3;
            const iy = ix + 1;
            const iz = ix + 2;
            const offset = randomOffsets[i];
            const wave = Math.sin(time * 2.5 + offset * 4.0);
            const factor = 1.0 + wave * 0.1 * (0.5 + bassRef.current);
            position.array[ix] = initialPositions[ix] * factor;
            position.array[iy] = initialPositions[iy] * factor;
            position.array[iz] = initialPositions[iz] * factor;
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
            let r = 0.7, g = 0.8, b = 1.0;
            if (pulseActive && time - pulseTimer < 0.5) {
                r = 0.5 + 0.5 * Math.sin(i + time * 10);
                g = 0.5 + 0.5 * Math.sin(i + time * 10 + 2);
                b = 0.5 + 0.5 * Math.sin(i + time * 10 + 4);
            }
            colorAttr.setXYZ(i, r, g, b);
        }
        colorAttr.needsUpdate = true;

        mesh.rotation.y += 0.002;
        mesh.rotation.x += 0.001;
        particleSystem.rotation.y += 0.002;

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

        [leftTube, rightTube].forEach((tube) => {
            const baseCol = tube.userData.baseColumn.geometry.attributes.position;
            const pos = tube.geometry.attributes.position;
            const segments = tube.userData.segments;

            for (let i = 0; i < baseCol.count; i++) {
                const baseY = baseCol.getY(i);
                const baseX = baseCol.getX(i);
                const baseZ = baseCol.getZ(i);
                for (let j = 0; j < segments; j++) {
                    const angle = (j / segments) * Math.PI * 2;
                    const x = baseX + Math.cos(angle) * 0.15;
                    const z = baseZ + Math.sin(angle) * 0.15;
                    const idx = (i * segments + j) * 3;
                    pos.setXYZ(idx / 3, x, baseY, z);
                }
            }
            pos.needsUpdate = true;
        });

        const hueShift = Math.abs(Math.sin(time * 0.5 + bassRef.current));
        leftColumn.material.color.setHSL(hueShift, 0.8, 0.5);
        rightColumn.material.color.setHSL(1 - hueShift, 0.8, 0.5);

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
