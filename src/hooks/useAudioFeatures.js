import { useEffect, useRef } from "react";

export function useAudioFeatures(sensitivity = 1.5) {
    const channelRef = useRef(null);

    useEffect(() => {
        let audioContext;
        let analyser;
        let dataArray;
        const smoothingFactor = 0.1;
        let smoothed = 0;

        channelRef.current = new BroadcastChannel("animus-control");

        async function initMic() {
            try {
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
                analyser.fftSize = 512;
                dataArray = new Uint8Array(analyser.frequencyBinCount);
                source.connect(analyser);

                function update() {
                    analyser.getByteFrequencyData(dataArray);

                    const rawBass = getBandEnergy(dataArray, 20, 140);
                    const rawMid = getBandEnergy(dataArray, 140, 400);
                    const rawTreble = getBandEnergy(dataArray, 400, 2000);

                    const avg = (rawBass + rawMid + rawTreble) / 3;
                    smoothed += smoothingFactor * (avg - smoothed);

                    // 🎚 Adjust sensitivity curve: remap UI 5 => effective 1.5–1.8
                    const effectiveSensitivity = Math.pow(sensitivity / 10, 1.5) * 1.8;

                    const boosted = (val) => Math.min(1, val * effectiveSensitivity);

                    try {
                        channelRef.current?.postMessage({
                            type: "audioFeatures",
                            value: {
                                amplitude: boosted(smoothed),
                                bass: boosted(rawBass),
                                mid: boosted(rawMid),
                                treble: boosted(rawTreble),
                            },
                        });
                    } catch (err) {
                        console.warn("⚠️ BroadcastChannel postMessage failed:", err);
                    }

                    requestAnimationFrame(update);
                }

                update();
            } catch (err) {
                console.error("🎤 Mic access error:", err);
            }
        }

        initMic();

        return () => {
            if (channelRef.current) {
                channelRef.current.close();
            }
            if (audioContext && audioContext.state !== "closed") {
                audioContext.close().catch(() => {});
            }
        };
    }, [sensitivity]);

    function getBandEnergy(data, lowHz, highHz) {
        const lowIndex = Math.floor((lowHz / 22050) * data.length);
        const highIndex = Math.ceil((highHz / 22050) * data.length);
        let sum = 0;
        for (let i = lowIndex; i < highIndex; i++) {
            sum += data[i];
        }
        return sum / (highIndex - lowIndex) / 255;
    }
}
