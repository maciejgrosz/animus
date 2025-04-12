// modules/sphereLogic.js
import * as THREE from "three";

export function setupSphereGeometry() {
    const geometry = new THREE.IcosahedronGeometry(2.2, 1);
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

    const position = geometry.attributes.position;
    const colorAttr = geometry.attributes.color;
    const initialPositions = position.array.slice();

    return {
        geometry,
        mesh,
        position,
        colorAttr,
        initialPositions,
        randomOffsets,
        scatterDirections,
    };
}

export function deformSphere({
                                 time,
                                 bass,
                                 treble,
                                 position,
                                 colorAttr,
                                 initialPositions,
                                 randomOffsets,
                                 scatterDirections,
                                 pulseActive,
                                 pulseTimer,
                             }) {
    const normalizedBass = Math.pow(Math.max(0, (bass - 0.2) / 0.8), 1.5);
    const bassBoost = normalizedBass * 3.5;

    for (let i = 0; i < position.count; i++) {
        const ix = i * 3;
        const iy = ix + 1;
        const iz = ix + 2;
        const offset = randomOffsets[i];

        let dynamicPulse = 1.0 + Math.sin(time * 10 + offset) * 0.4 * bassBoost;

        if (bass > 0.75) {
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
}
