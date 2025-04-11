// threeSphereBassReactive.js
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import vertexShader from "../../shaders/basic.vert?raw";
import fragmentShader from "../../shaders/net.frag?raw";
import { bassRef, midRef, trebleRef } from "../audioRefs";

export function createThreeBloomIcosphere(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);

    const uniforms = {
        u_time: { value: 0.0 },
        u_bass: { value: 0.0 },
        u_mid: { value: 0.0 },
        u_treble: { value: 0.0 },
        u_red: { value: 0.5 },
        u_green: { value: 0.6 },
        u_blue: { value: 0.9 },
    };

    const geometry = new THREE.IcosahedronGeometry(2.2, 6);
    const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        wireframe: true,
        transparent: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.5, 0.5, 0.5);
    scene.add(mesh);

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

    const leftColumn = createFixedSpringColumn(-6);
    const rightColumn = createFixedSpringColumn(6);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new OutputPass());

    const clock = new THREE.Clock();
    let frameId;

    function animate() {
        const time = clock.getElapsedTime();
        uniforms.u_time.value = time;
        uniforms.u_bass.value = bassRef.current;
        uniforms.u_mid.value = midRef.current;
        uniforms.u_treble.value = trebleRef.current;

        mesh.rotation.y += 0.002;
        mesh.rotation.x += 0.001;
        particleSystem.rotation.y += 0.002;

        const waveFrequency = 2.0 + bassRef.current * 6.0; // 🎚️ Zmienna częstotliwość

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
