import { ritchse } from "@hydra_presets/ritchse";
import { oliviaJack, oliviaJack2 } from "@hydra_presets/oliviaJack";
import { florDeFuego } from "@hydra_presets/florDeFuego";
import { paintingReactive } from "@hydra_presets/paintingReactive"
import { amplitudeRef, bassRef, midRef, trebleRef } from "@core/audioRefs";
import { waveforms } from "@hydra_presets/waveforms"
import { zachKrall } from "@hydra_presets/zachKrall";
import { khoparzi, khoparziAquatic } from "@hydra_presets/khoparzi";
import { alexandreRangel, alexandreRangelBright } from "@hydra_presets/alexandreRangel"
import {nesso, nessoRandom} from "@hydra_presets/nesso"
import { ameba } from "@hydra_presets/ameba"
import { velvetPool } from "@hydra_presets/velvetPool"
import {AFALFL} from "@hydra_presets/AFALFL";

export const presets = [
    {
        id: "test",
        engine: "threejs",
        name: "test",
        description: "test",
        fn: () => {
            const channel = new BroadcastChannel("animus-control");
            channel.postMessage({ type: "selectThree", id: "test" });
        },
        preview: new URL("../../public/assets/textures/ambientSphere.png", import.meta.url).href, // Update if you have a thumbnail
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
        preview: new URL("../../public/assets/textures/ambientSphere.png", import.meta.url).href, // Update if you have a thumbnail
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
        preview: new URL("../../public/assets/textures/threejsBloom.png", import.meta.url).href,
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
        preview: new URL("../../public/assets/textures/threejs.png", import.meta.url).href,
    },
    {
        id: 'AFALFL',
        engine: "hydra",
        name: 'AFALFL',
        description: 'A net-like oscilloscope grid modulated by bass, mid, and treble',
        fn: () =>
            AFALFL(
                () => bassRef.current,
                () => midRef.current,
                () => trebleRef.current
            ),
        thumbnail: 'thumbnails/oscilloscopeNet.png',
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
        id: "velvetPool",
        engine: "hydra",
        name: "Velvet Pool",
        author: "Mahalia H-R",
        mood: "velvety, fluid, layered",
        fn: () => velvetPool(
            () => bassRef.current,
            () => midRef.current,
            () => trebleRef.current
        ),
        preview: new URL("../../public/assets/textures/guide.png", import.meta.url).href,
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
        preview: new URL("../assets/previews/ritchse.png", import.meta.url).href,
    },
    {
        id: "waveforms",
        engine: "hydra",
        name: "Waveform Zones",
        author: "You 🔊",
        mood: "responsive",
        fn: () =>
            waveforms(
                () => bassRef.current,
                () => midRef.current,
                () => trebleRef.current
            ),
        preview: new URL("../../public/assets/textures/guide.png", import.meta.url).href,
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
        preview: new URL("../assets/previews/blendPrototype.png", import.meta.url).href,
    },
];
