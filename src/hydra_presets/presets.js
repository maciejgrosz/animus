import { ritchse } from "@hydra_presets/ritchse";
import { oliviaJack, oliviaJack2 } from "@hydra_presets/oliviaJack";
import { florDeFuego } from "@hydra_presets/florDeFuego";

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
        fn: oliviaJack2,
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
];
