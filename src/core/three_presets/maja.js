import * as THREE from 'three';
import {
    useRenderer,
    useScene,
    useCamera,
    useTick
} from '@core/engine/init.js';

export function maja() {
    const renderer = useRenderer();
    const scene = useScene();
    const camera = useCamera();

    // Clean scene
    scene.clear();
    scene.background = null;

    // Setup camera
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    // Sample object
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const clock = new THREE.Clock();

    const cleanupTick = useTick(() => {
        const elapsed = clock.getElapsedTime();
        cube.rotation.x = elapsed * 0.2;
        cube.rotation.y = elapsed * 0.3;
        renderer.render(scene, camera);
    });

    return () => {
        cleanupTick();
        geometry.dispose();
        material.dispose();
        scene.remove(cube);
    };
}
