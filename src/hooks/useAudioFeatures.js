import { useEffect, useRef } from "react";

export function useAudioFeatures({
                                     amplitudeGain = 5,
                                     bassGain = 5,
                                     midGain = 5,
                                     trebleGain = 5,
                                 } = {}) {
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
                    },
                });

                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioContext.createMediaStreamSource(stream);

                analyser = audioContext.createAnalyser();
                analyser.fftSize = 512;
                dataArray = new Uint8Array(analyser.frequencyBinCount);
                source.connect(analyser);

                function getBandEnergy(data, lowHz, highHz) {
                    const lowIndex = Math.floor((lowHz / 22050) * data.length);
                    const highIndex = Math.ceil((highHz / 22050) * data.length);
                    let sum = 0;
                    for (let i = lowIndex; i < highIndex; i++) {
                        sum += data[i];
                    }
                    return sum / (highIndex - lowIndex) / 255;
                }

                function boosted(val, gain, base = 0.2) {
                    return Math.min(1, val * gain * base);
                }

                function update() {
                    analyser.getByteFrequencyData(dataArray);

                    const rawBass = getBandEnergy(dataArray, 20, 140);
                    const rawMid = getBandEnergy(dataArray, 140, 400);
                    const rawTreble = getBandEnergy(dataArray, 400, 2000);
                    const avg = (rawBass + rawMid + rawTreble) / 3;

                    smoothed += smoothingFactor * (avg - smoothed);
                    const amplitude = boosted(smoothed, amplitudeGain, 0.1);

                    try {
                        channelRef.current?.postMessage({
                            type: "audioFeatures",
                            value: {
                                amplitude,
                                bass: boosted(rawBass, bassGain),
                                mid: boosted(rawMid, midGain),
                                treble: boosted(rawTreble, trebleGain),
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
    }, [amplitudeGain, bassGain, midGain, trebleGain]);
}