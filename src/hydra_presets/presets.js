import { ritchse } from "@hydra_presets/ritchse";
import { oliviaJack, oliviaJack2 } from "@hydra_presets/oliviaJack";
import { florDeFuego } from "@hydra_presets/florDeFuego";
import { paintingReactive } from "@hydra_presets/paintingReactive"
import { amplitudeRef, bassRef, midRef, trebleRef } from "@core/audioRefs";
import { waveforms } from "@hydra_presets/waveforms"
import { zachKrall } from "@hydra_presets/zachKrall";
import { liquidAcid} from "@hydra_presets/liquidAcid";
import { alexandreRangel, alexandreRangelBright } from "@hydra_presets/alexandreRangel"
import { nesso } from "@hydra_presets/nesso"
import { ameba } from "@hydra_presets/ameba"
export const presets = [
    {
        id: "ameba",
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
        id: "liquidAcid",
        name: "Liquid Acid",
        author: "You 🔊",
        mood: "fluid, responsive",
        fn: () =>
            liquidAcid(
                () => bassRef.current,
                () => midRef.current,
                () => trebleRef.current
            ),
        preview: new URL("../../public/assets/textures/video.png", import.meta.url).href,
    },
    {
        id: "nesso",
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
        id: "oliviaJack",
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
        name: "Psychedelic Paint Pour",
        author: "Alexander Grey",
        mood: "trippy, colorful",
        fn: () => paintingReactive(() => amplitudeRef.current),
        preview: new URL("../../public/assets/textures/bazant.jpg", import.meta.url).href,
    },
    {
        id: "ritchse",
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