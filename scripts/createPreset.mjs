#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const [,, id, name, engine = "hydra", author = "You 🔊", mood = ""] = process.argv;

if (!id || !name) {
    console.error("❌ Usage: npx createPreset <id> <name> [engine] [author] [mood]");
    process.exit(1);
}

const presetsFile = path.resolve("./src/core/presets.js");
const presetsRaw = fs.readFileSync(presetsFile, "utf-8");

// ✅ Import line only needed for Hydra presets
const importLine = engine === "hydra"
    ? `import { ${id} } from "@hydra_presets/${id}";\n`
    : "";

const updatedImports = presetsRaw.replace(/(import .*?;\n)(?!import )/s, match => match + importLine);

// ✅ FN block differs based on engine
const fnBlock =
    engine === "threejs"
        ? `() => {
    const channel = new BroadcastChannel("animus-control");
    channel.postMessage({ type: "selectThree", id: "${id}" });
  }`
        : `() => ${id}(
    () => bassRef.current,
    () => midRef.current,
    () => trebleRef.current
  )`;

// ✅ Preset object
const newPreset = `
{
  id: "${id}",
  engine: "${engine}",
  name: "${name}",
  author: "${author}",
  mood: "${mood}",
  fn: ${fnBlock},
  preview: new URL("../../public/assets/textures/${id}.png", import.meta.url).href
},
`;

const updatedPresets = updatedImports.replace(/\n\];\s*$/, `${newPreset}\n];`);
fs.writeFileSync(presetsFile, updatedPresets);
console.log(`✅ Added "${name}" to presets.js`);

// ✅ Hydra preset scaffold
if (engine === "hydra") {
    const presetPath = path.resolve(`./src/core/hydra_presets/${id}.js`);
    if (!fs.existsSync(presetPath)) {
        fs.writeFileSync(
            presetPath,
            `export function ${id}(bassRef, midRef, trebleRef) {\n  // TODO: Add your Hydra code here\n}\n`
        );
        console.log(`📁 Created scaffold: hydra_presets/${id}.js`);
    }
}

// ✅ Three.js preset scaffold
if (engine === "threejs") {
    const threePath = path.resolve(`./src/core/three_presets/${id}.js`);
    if (!fs.existsSync(threePath)) {
        const template = `import * as THREE from 'three';

export function ${id}(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Sample object
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  camera.position.z = 5;

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    cube.rotation.x = elapsed * 0.2;
    cube.rotation.y = elapsed * 0.3;
    renderer.render(scene, camera);
  }
  animate();

  return () => {
    renderer.dispose();
    container.removeChild(renderer.domElement);
  };
}
`;
        fs.writeFileSync(threePath, template);
        console.log(`📁 Created scaffold: three_presets/${id}.js`);
    }
}

// 📸 Reminder
console.log("📸 Don't forget to take a screenshot and save it to:");
console.log(`   public/assets/textures/${id}.png`);
