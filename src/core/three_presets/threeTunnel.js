// threeTunnel.js
import * as THREE from "three";
import fragmentShader from "../../shaders/tunnel.frag?raw";
import { bassRef, midRef, trebleRef } from "../audioRefs";

export function createTunnel(canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight);

    const uniforms = {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_bass: { value: 0 },
        u_mid: { value: 0 },
        u_treble: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({ uniforms, fragmentShader });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    let isActive = true;

    function animate() {
        if (!isActive) return;
        uniforms.u_time.value = clock.getElapsedTime();
        uniforms.u_bass.value = bassRef.current;
        uniforms.u_mid.value = midRef.current;
        uniforms.u_treble.value = trebleRef.current;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
        isActive = false;
        window.removeEventListener("resize", handleResize);
        renderer.dispose();
    };
}
