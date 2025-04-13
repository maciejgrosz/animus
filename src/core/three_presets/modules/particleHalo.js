import * as THREE from "three";

export function createParticleHalo() {
    const particleCount = 6000; // denser halo
    const particles = new THREE.BufferGeometry();
    const pos = [];

    const innerRadius = 2.5;
    const outerRadius = 3.2;

    for (let i = 0; i < particleCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();
        const radius = innerRadius + Math.random() * (outerRadius - innerRadius);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        pos.push(x, y, z);
    }

    particles.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));

    const particleMat = new THREE.PointsMaterial({
        color: 0x88ccff,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    return new THREE.Points(particles, particleMat);
}
