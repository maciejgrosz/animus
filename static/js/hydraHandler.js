let hydra = null;

export function setupHydraModeToggle() {
    const modeSelector = document.getElementById("mode-selector");
    const hydraCanvas = document.getElementById("hydra-canvas");

    function initHydra() {
        if (!hydraCanvas) {
            console.warn("🚫 Hydra canvas not found.");
            return;
        }

        const ctx = hydraCanvas.getContext("webgl") || hydraCanvas.getContext("2d");
        if (!ctx) {
            console.warn("🚫 No rendering context available on Hydra canvas.");
            hydraCanvas.classList.remove("hidden");
            hydraCanvas.style.background = "black";
            return;
        }

        hydraCanvas.classList.remove("hidden");
        hydraCanvas.width = window.innerWidth;
        hydraCanvas.height = window.innerHeight;

        if (!hydra) {
            console.log("🌀 Initializing Hydra...");
            try {
                hydra = new Hydra({ canvas: hydraCanvas });
                hydra.setResolution(hydraCanvas.width, hydraCanvas.height);

                // 🧪 Test pattern
                osc(10, 0.1, 1.2)
                    .rotate(0.2)
                    .color(1, 0.3, 0.8)
                    .modulate(osc(5).kaleid(3), 0.4)
                    .out();

                console.log("✅ Hydra initialized successfully.");
            } catch (e) {
                console.error("❌ Hydra initialization failed:", e);
                hydraCanvas.style.background = "black";
            }
        } else {
            hydra.setResolution(hydraCanvas.width, hydraCanvas.height);
        }
    }

    function disableHydra() {
        if (hydra) {
            console.log("🛑 Disabling Hydra...");
            solid(0, 0, 0, 0).out();
        }
        if (hydraCanvas) {
            hydraCanvas.classList.add("hidden");
        }
    }

    if (modeSelector && hydraCanvas) {
        modeSelector.addEventListener("change", (e) => {
            const mode = e.target.value;
            if (mode === "hydra") {
                initHydra();
            } else {
                disableHydra();
            }
        });
    }

    // Expose initHydra for manual triggering if needed
    window.__initHydra = initHydra;
}

export function selectHydraBackground() {
    const hydraCanvas = document.getElementById("hydra-canvas");
    if (hydraCanvas) {
        console.log("🌌 Enabling Hydra background...");
        hydraCanvas.classList.remove("hidden");
    }

    document.body.style.backgroundImage = "none";

    document.querySelectorAll('.border-white').forEach(el => {
        el.classList.remove('border-white');
    });

    const hydraBox = document.getElementById("bg-hydra");
    if (hydraBox) {
        hydraBox.classList.add('border-white');
    }

    // ✅ Explicitly initialize Hydra background
    if (typeof window.__initHydra === "function") {
        window.__initHydra();
    }
}
