import { useEffect, useRef } from "react";

export function useAudioFeatures({
                                     bassGain = 5,
                                     midGain = 5,
                                     trebleGain = 5,
                                 } = {}) {
    const channelRef = useRef(null);

    useEffect(() => {
        let audioContext;
        let analyser;
        let dataArray;

        // 🥁 Beat/BPM detection
        let lastBeatTime = 0;
        let bpm = 0;
        let bpmBuffer = [];

        const minInterval = 300;

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

                    const bass = boosted(rawBass, bassGain);
                    const mid = boosted(rawMid, midGain);
                    const treble = boosted(rawTreble, trebleGain);

                    const now = performance.now();
                    const beatThreshold = 0.3 + 0.05 * (1 / bassGain);

                    if (bass > beatThreshold && now - lastBeatTime > minInterval) {
                        const interval = now - lastBeatTime;
                        lastBeatTime = now;

                        // Send beat trigger
                        try {
                            channelRef.current?.postMessage({ type: "beatDetected" });
                        } catch (err) {
                            console.warn("⚠️ Beat postMessage failed:", err);
                        }

                        // Estimate BPM
                        const currentBPM = 60000 / interval;
                        bpmBuffer.push(currentBPM);
                        if (bpmBuffer.length > 5) bpmBuffer.shift();

                        bpm = Math.round(bpmBuffer.reduce((sum, val) => sum + val, 0) / bpmBuffer.length);
                    }

                    try {
                        channelRef.current?.postMessage({
                            type: "audioFeatures",
                            value: {
                                bass,
                                mid,
                                treble,
                                bpm,
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
    }, [bassGain, midGain, trebleGain]);
}
