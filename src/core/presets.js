import { ritchse } from "@hydra_presets/ritchse.js";
import { oliviaJack, oliviaJack2 } from "@hydra_presets/oliviaJack.js";
import { florDeFuego } from "@hydra_presets/florDeFuego.js";
import { paintingReactive } from "@hydra_presets/paintingReactive.js"
import { amplitudeRef, bassRef, midRef, trebleRef } from "@core/audioRefs.js";
import { zachKrall } from "@hydra_presets/zachKrall.js";
import { khoparzi, khoparziAquatic } from "@hydra_presets/khoparzi.js";
import { alexandreRangel, alexandreRangelBright } from "@hydra_presets/alexandreRangel.js"
import {nesso, nessoRandom} from "@hydra_presets/nesso.js"
import { ameba } from "@hydra_presets/ameba.js"
import {velvetPool} from "@hydra_presets/velvetPool.js";

export const presets = [
    {
        id: "blueVortex",
        engine: "threejs",
        name: "blueVortex",
        description: "blueVortex",
        fn: () => {
            const channel = new BroadcastChannel("animus-control");
            channel.postMessage({ type: "selectThree", id: "blueVortex" });
        },
        preview: new URL("../../public/assets/textures/blueVortex.png", import.meta.url).href, // Update if you have a thumbnail
    },
    {
        id: "threeTunnel",
        engine: "threejs",
        name: "Three.js Tunnel",
        description: "A GLSL-based tunnel with audio reactivity",
        fn: () => {
            const channel = new BroadcastChannel("animus-control");
            channel.postMessage({ type: "selectThree", id: "threeTunnel" });
        },
        preview: new URL("../../public/assets/textures/tunnel.png", import.meta.url).href,
    },
    {
        id: "skull",
        engine: "threejs",
        name: "skull",
        description: "skull",
        fn: () => {
            const channel = new BroadcastChannel("animus-control");
            channel.postMessage({ type: "selectThree", id: "skull" });
        },
        preview: new URL("../../public/assets/textures/skull.png", import.meta.url).href, // Update if you have a thumbnail
    },
    {
        id: "ambientSphere",
        engine: "threejs",
        name: "Ambient Sphere",
        description: "Gentle ambient-style 3D sphere with soft color shifts and fluid motion",
        fn: () => {
            const channel = new BroadcastChannel("animus-control");
            channel.postMessage({ type: "selectThree", id: "ambientSphere" });
        },
        preview: new URL("../../public/assets/textures/ambientSphere.png", import.meta.url).href, // Update if you have a thumbnail
    },
    {
        id: "threeBloomIcosphere",
        engine: "threejs",
        name: "Bloom Icosphere",
        description: "Wireframe bloom + audio-reactive icosphere",
        fn: () => {
            const channel = new BroadcastChannel("animus-control");
            channel.postMessage({ type: "selectThree", id: "threeBloomIcosphere" });
        },
        preview: new URL("../../public/assets/textures/bloomIcosphere.png", import.meta.url).href,
    },
    {
        id: 'velvetPool',
        engine: "hydra",
        name: 'Velvet Pool',
        description: 'A net-like oscilloscope grid modulated by bass, mid, and treble',
        fn: () => velvetPool(),
        preview: new URL("../../public/assets/textures/velvetPool.png", import.meta.url).href,
    },
    {
        id: "khoparzi",
        engine: "hydra",
        name: "khoparzi",
        author: "You 🔊",
        mood: "glitchy, techno",
        fn: () =>
            khoparzi(
                () => bassRef.current,
                () => midRef.current,
                () => trebleRef.current
            ),
        preview: new URL("../../public/assets/textures/khoparzi.png", import.meta.url).href,
    },
    {
        id: "khoparziAquatic",
        engine: "hydra",
        name: "khoparziAquatic",
        author: "You 🔊",
        mood: "glitchy, techno",
        fn: () =>
            khoparziAquatic(
                () => bassRef.current,
                () => midRef.current,
                () => trebleRef.current
            ),
        preview: new URL("../../public/assets/textures/khoparzi.png", import.meta.url).href,
    },
    {
        id: "nesso",
        engine: "hydra",
        name: "Nesso",
        author: "You 🔊",
        mood: "glitchy, techno",
        fn: () =>
            nesso(
                () => bassRef.current,
                () => midRef.current,
                () => trebleRef.current
            ),
        preview: new URL("../../public/assets/textures/nesso.png", import.meta.url).href,
    },
    {
        id: "ameba",
        engine: "hydra",
        name: "Ameba",
        author: "Alexandre Rangel",
        mood: "dreamy, biological, trippy",
        fn: () =>
            ameba(
                () => bassRef.current,
                () => midRef.current,
                () => trebleRef.current
            ),
        preview: new URL("../../public/assets/textures/ameba.png", import.meta.url).href,
    },
    {
        id: "alexandreRangel",
        engine: "hydra",
        name: "Alexandre Rangel",
        author: "Alexandre Rangel",
        mood: "dreamy, biological, trippy",
        fn: () =>
            alexandreRangel(
                () => bassRef.current,
                () => midRef.current,
                () => trebleRef.current
            ),
        preview: new URL("../../public/assets/textures/alexandreRangel.png", import.meta.url).href,
    },
    {
        id: "alexandreRangelBright",
        engine: "hydra",
        name: "Alexandre Rangel Bright",
        author: "Alexandre Rangel",
        mood: "dreamy, vibrant",
        fn: () =>
            alexandreRangelBright(
                () => bassRef.current,
                () => midRef.current,
                () => trebleRef.current
            ),
        preview: new URL("../../public/assets/textures/alexandreRangelB.png", import.meta.url).href,
    },
    {
        id: "florDeFuego",
        engine: "hydra",
        name: "Flor de Fuego",
        author: "Unknown",
        mood: "dreamy",
        fn: () =>
            florDeFuego(
                () => bassRef.current,
                () => midRef.current,
                () => trebleRef.current
            ),
        preview: new URL("../../public/assets/textures/florDeFuego.png", import.meta.url).href,
    },
    {
        id: "nessoRandom",
        engine: "hydra",
        name: "Nesso Random",
        author: "You 🔊",
        mood: "glitchy, techno",
        fn: () =>
            nessoRandom(
                () => bassRef.current,
                () => midRef.current,
                () => trebleRef.current
            ),
        preview: new URL("../../public/assets/textures/nesso.png", import.meta.url).href,
    },
    {
        id: "oliviaJack",
        engine: "hydra",
        name: "Olivia Jack 1",
        author: "Olivia Jack",
        mood: "psychedelic",
        fn: () =>
            oliviaJack(
                () => bassRef.current,
                () => midRef.current,
                () => trebleRef.current
            ),
        preview: new URL("../../public/assets/textures/oliviaJack1.png", import.meta.url).href,
    },
    {
        id: "oliviaJack2",
        engine: "hydra",
        name: "Olivia Jack 2",
        author: "Olivia Jack",
        mood: "glitchy",
        fn: () =>
            oliviaJack2(
                () => bassRef.current,
                () => midRef.current,
                () => trebleRef.current
            ),
        preview: new URL("../../public/assets/textures/oliviaJack2.png", import.meta.url).href,
    },
    {
        id: "paintingReactive",
        engine: "hydra",
        name: "Psychedelic Paint Pour",
        author: "Alexander Grey",
        mood: "trippy, colorful",
        fn: () => paintingReactive(() => amplitudeRef.current),
        preview: new URL("../../public/assets/textures/bazant.jpg", import.meta.url).href,
    },
    {
        id: "ritchse",
        engine: "hydra",
        name: "Ritchse",
        author: "Ritchse",
        mood: "sci-fi, alien",
        fn: () =>
            ritchse(
                () => bassRef.current,
                () => midRef.current,
                () => trebleRef.current
            ),
        preview: new URL("../../public/assets/textures/ritchse.png", import.meta.url).href,
    },
    {
        id: "zachKrall",
        engine: "hydra",
        name: "Zach Krall",
        author: "Zach Krall",
        mood: "audio-reactive, waveform",
        fn: () =>
            zachKrall(
                () => bassRef.current,
                () => midRef.current,
                () => trebleRef.current
            ),
        preview: new URL("../../public/assets/textures/zachKrall.png", import.meta.url).href,
    },

{
  id: "zippyZaps",
  engine: "threejs",
  name: "Zippy Zaps",
  author: "SnoopethDuckDuck",
  mood: "",
  fn: () => {
    const channel = new BroadcastChannel("animus-control");
    channel.postMessage({ type: "selectThree", id: "zippyZaps" });
  },
  preview: new URL("../../public/assets/textures/tunnelClouds.png", import.meta.url).href
},


{
  id: "test997420",
  engine: "threejs",
  name: "test997420 ",
  author: "You 🔊",
  mood: "chaotic",
  fn: () => {
    const channel = new BroadcastChannel("animus-control");
    channel.postMessage({ type: "selectThree", id: "test997420" });
  },
  preview: new URL("../../public/assets/textures/test997420.png", import.meta.url).href
},

];