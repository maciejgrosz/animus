import { ritchse } from "@hydra_presets/ritchse";
import { oliviaJack, oliviaJack2 } from "@hydra_presets/oliviaJack";
import { florDeFuego } from "@hydra_presets/florDeFuego";
import { paintingReactive } from "@hydra_presets/paintingReactive"
import { amplitudeRef } from "@core/amplitudeRef";

export const presets = [
    {
        id: "oliviaJack",
        name: "Olivia Jack 1",
        author: "Olivia Jack",
        mood: "psychedelic",
        fn: oliviaJack,
        preview: new URL('../assets/previews/oliviaJack1.png', import.meta.url).href,
    },
    {
        id: "oliviaJack2",
        name: "Olivia Jack 2",
        author: "Olivia Jack",
        mood: "glitchy",
        fn: () => oliviaJack2(() => amplitudeRef.current),
        preview: new URL('../assets/previews/oliviaJack2.png', import.meta.url).href,
    },
    {
        id: "florDeFuego",
        name: "Flor de Fuego",
        author: "Unknown",
        mood: "dreamy",
        fn: florDeFuego,
        preview: new URL('../assets/previews/florDeFuego.png', import.meta.url).href,

    },
    {
        id: "ritchse",
        name: "Ritchse",
        author: "Ritchse",
        mood: "sci-fi",
        fn: ritchse,
        preview: new URL('../assets/previews/ritchse.png', import.meta.url).href,
    },
    {
        id: "paintingReactive",
        name: "Psychedelic Paint Pour",
        author: "Alexander Grey",
        mood: "trippy",
        fn: () => paintingReactive(() => amplitudeRef.current),
        preview: new URL("../../public/assets/textures/bazant.jpg", import.meta.url).href,
    }
];
