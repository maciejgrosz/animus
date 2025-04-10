// src/core/ThreeCanvas.jsx
import { useRef, useEffect } from "react";
import * as THREE from "three";
import fragmentShader from "../shaders/tunnel.frag?raw";
import { bassRef, midRef, trebleRef } from "./audioRefs";

export default function ThreeCanvas() {
    const canvasRef = useRef();

    useEffect(() => {
        let isActive = true; // ✅ Add this flag

        const canvas = canvasRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.Camera();
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const uniforms = {
            u_time: { value: 0 },
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            u_bass: { value: 0 },
            u_mid: { value: 0 },
            u_treble: { value: 0 },
        };

        const material = new THREE.ShaderMaterial({
            uniforms,
            fragmentShader,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const clock = new THREE.Clock();

        function animate() {
            if (!isActive) return; // 🛑 stop loop when unmounted
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
            isActive = false; // ✅ Stop render loop
            window.removeEventListener("resize", handleResize);
            renderer.dispose(); // ✅ Clean up renderer
        };
    }, []);
    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
}
