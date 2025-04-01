import { useEffect, useRef, useState } from "react";

export function useMicInput(sensitivity = 5) {
    const micRef = useRef(null);
    const [amplitude, setAmplitude] = useState(0);
    const channel = useRef(null);
    const lastBroadcast = useRef(0);

    useEffect(() => {
        let audioContext;
        let analyser;
        let dataArray;
        let smoothed = 0;
        const smoothingFactor = 0.1;
        const BROADCAST_INTERVAL = 100; // ms

        channel.current = new BroadcastChannel("animus-control");

        async function initMic() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: true,
                    },
                });

                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioContext.createMediaStreamSource(stream);

                analyser = audioContext.createAnalyser();
                analyser.fftSize = 512;
                dataArray = new Uint8Array(analyser.fftSize);

                source.connect(analyser);

                function update() {
                    analyser.getByteTimeDomainData(dataArray);

                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        const val = (dataArray[i] - 128) / 128;
                        sum += val * val;
                    }

                    const raw = Math.sqrt(sum / dataArray.length);
                    smoothed += smoothingFactor * (raw - smoothed);
                    const amplified = Math.min(1, smoothed * sensitivity);

                    setAmplitude(amplified);

                    const now = performance.now();
                    if (now - lastBroadcast.current > BROADCAST_INTERVAL) {
                        channel.current.postMessage({ type: "amplitude", value: amplified });
                        lastBroadcast.current = now;
                    }

                    requestAnimationFrame(update);
                }

                update();
                micRef.current = stream;
            } catch (err) {
                console.error("🎤 Mic access error:", err);
            }
        }

        const initTimeout = setTimeout(initMic, 150);

        return () => {
            clearTimeout(initTimeout);
            if (micRef.current) {
                micRef.current.getTracks().forEach((track) => track.stop());
            }
            if (audioContext && audioContext.state !== "closed") {
                audioContext.close().catch(() => {});
            }
            channel.current?.close();
        };
    }, [sensitivity]);

    return amplitude;
}
