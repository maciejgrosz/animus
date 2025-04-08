export function liquidAcid(getBass, getMid, getTreble) {
    const bass = () => getBass?.() ?? 0;
    const mid = () => getMid?.() ?? 0;
    const treble = () => getTreble?.() ?? 0;

    // ⏳ Optional: fade logic for later enhancements
    if (!window._liquidFadeStartTime) {
        window._liquidFadeStartTime = performance.now();
    }
    const elapsed = (performance.now() - window._liquidFadeStartTime) / 1000;
    const fade = Math.min(elapsed / 3, 1); // for future fade-in if needed

    if (!window._liquidVideoInitialized) {
        const vid = document.createElement('video');
        vid.src = '/assets/video/liquidacid.mp4';
        vid.crossOrigin = 'anonymous';
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.autoplay = true;

        // 🧼 Hide the DOM video so only Hydra visuals show
        vid.style.position = 'absolute';
        vid.style.top = '0';
        vid.style.left = '0';
        vid.style.opacity = '0';            // ✅ Invisible but active
        vid.style.pointerEvents = 'none';   // ✅ Doesn't block canvas
        vid.style.zIndex = '-1';            // ✅ Stays behind everything

        document.body.appendChild(vid);

        vid.addEventListener('loadeddata', () => {
            console.log('[Hydra] Video loaded – calling initVideo');
            s0.initVideo(vid);
            window._liquidVideo = vid;
            window._liquidVideoInitialized = true;
        });

        vid.play().then(() => {
            console.log('[Hydra] Video is playing');
        }).catch((err) => {
            console.warn('[Hydra] Video play blocked:', err);
        });
    }

    // 🎨 Apply Hydra effects to video
    src(s0)
        .scale(1)
        .modulate(noise(10, 0.2), 0.3)
        .colorama(0.5)
        .contrast(1.1 + bass() * 0.3)
        .out();
}
