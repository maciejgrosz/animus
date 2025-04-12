// modules/springColumns.js
import * as THREE from "three";

export function createFixedSpringColumn(xOffset, scene) {
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
        depthWrite: false,
    });

    const system = new THREE.Points(geom, mat);
    system.userData = { basePositions: positions.slice(), xOffset, geom };
    scene.add(system);
    return system;
}
