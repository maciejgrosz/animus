// threeSphereBassReactive.js
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import vertexShader from "../../shaders/basic.vert?raw";
import fragmentShader from "../../shaders/net.frag?raw";
import { bassRef } from "../audioRefs";

export function createThreeBloomIcosphere(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, -2, 10);

    const uniforms = {
        u_time: { value: 0.0 },
        u_bass: { value: 0.0 },
        u_red: { value: 0.9 },
        u_green: { value: 0.9 },
        u_blue: { value: 0.9 },
    };

    const geometry = new THREE.IcosahedronGeometry(4, 50); // ✅ Less complex sphere
    const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        wireframe: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new OutputPass());

    const clock = new THREE.Clock();
    let frameId;

    function animate() {
        uniforms.u_time.value = clock.getElapsedTime();
        uniforms.u_bass.value = bassRef.current;

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
        renderer.dispose();
    };
}
