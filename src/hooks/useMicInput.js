import { useEffect, useRef, useState } from "react";

export function useMicInput(sensitivity = 5) {
    const micRef = useRef(null);
    const [amplitude, setAmplitude] = useState(0);

    useEffect(() => {
        let audioContext;
        let analyser;
        let dataArray;
        let smoothed = 0;
        const smoothingFactor = 0.1; // faster response, still smooth

        async function initMic() {
            try {
                // const stream = await navigator.mediaDevices.getUserMedia({
                //     audio: true // 👈 use default audio settings again
                // });
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: true,
                    }
                });

                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioContext.createMediaStreamSource(stream);

                analyser = audioContext.createAnalyser();
                analyser.fftSize = 512; // slightly higher resolution
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

                    // 🌀 Smooth the signal
                    smoothed += smoothingFactor * (raw - smoothed);

                    // 🔊 Boost with sensitivity
                    const amplified = Math.min(1, smoothed * sensitivity);

                    setAmplitude(amplified);
                    requestAnimationFrame(update);
                }

                update();
                micRef.current = stream;
            } catch (err) {
                console.error("Mic access denied or error:", err);
            }
        }

        initMic();

        return () => {
            if (micRef.current) {
                micRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, [sensitivity]);

    return amplitude;
}
