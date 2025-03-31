import { useEffect, useRef, useState } from "react";

export function useMicInput(sensitivity = 3) { // 👈 You can pass this from the component
    const micRef = useRef(null);
    const [amplitude, setAmplitude] = useState(0);

    useEffect(() => {
        let audioContext;
        let analyser;
        let dataArray;
        let smoothed = 0;
        const smoothingFactor = 0.04; // 🧽 lower = smoother, higher = snappier

        async function initMic() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioContext.createMediaStreamSource(stream);

                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;

                source.connect(analyser);
                dataArray = new Uint8Array(analyser.frequencyBinCount);

                function update() {
                    analyser.getByteTimeDomainData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        let val = (dataArray[i] - 128) / 128;
                        sum += val * val;
                    }
                    const raw = Math.sqrt(sum / dataArray.length);

                    // 🌀 Smooth and amplify the result
                    smoothed += smoothingFactor * (raw - smoothed);

                    // 🔊 Apply sensitivity multiplier
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
