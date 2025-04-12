// particleHalo.js
import * as THREE from "three";

export function createParticleHalo() {
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
        depthWrite: false,
    });

    const particleSystem = new THREE.Points(particles, particleMat);
    return particleSystem;
}
