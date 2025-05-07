import * as THREE from 'three'
import fragmentShader from '../../shaders/zippyZaps.frag?raw'
import { bassRef } from '@core/audioRefs'

export function zippyZaps(container) {
  const scene = new THREE.Scene()

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
  camera.position.z = 1

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  const uniforms = {
    iResolution: {
      value: new THREE.Vector3(container.clientWidth, container.clientHeight, 1)
    },
    iTime: { value: 0 },
    bass: { value: 0 },
    smoothedBass: { value: 0 }
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader,
  })

  const geometry = new THREE.PlaneGeometry(2, 2)
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  const clock = new THREE.Clock()

  function animate() {
    requestAnimationFrame(animate)

    const time = clock.getElapsedTime()
    uniforms.iTime.value = time
    uniforms.iResolution.value.set(container.clientWidth, container.clientHeight, 1)

    // Audio
    const currentBass = bassRef.current
    uniforms.bass.value = currentBass

    const smoothingFactor = 0.05
    uniforms.smoothedBass.value += (currentBass - uniforms.smoothedBass.value) * smoothingFactor

    renderer.render(scene, camera)
  }
  animate()

  return () => {
    renderer.dispose()
    container.removeChild(renderer.domElement)
  }
}
