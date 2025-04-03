import { useEffect, useRef } from "react";

export function useAudioFeatures({
                                     amplitudeGain = 1.5,
                                     bassGain = 1.5,
                                     midGain = 1.5,
                                     trebleGain = 1.5,
                                 }) {
    const channelRef = useRef(null);

    useEffect(() => {
        let audioContext;
        let analyser;
        let dataArray;
        const smoothingFactor = 0.1;
        let smoothed = 0;
        let running = true;

        const channel = new BroadcastChannel("animus-control");
        channelRef.current = channel;

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

                function update() {
                    if (!running) return;

                    analyser.getByteFrequencyData(dataArray);

                    const bass = getBandEnergy(dataArray, 20, 140);
                    const mid = getBandEnergy(dataArray, 140, 400);
                    const treble = getBandEnergy(dataArray, 400, 2000);
                    const avg = (bass + mid + treble) / 3;

                    smoothed += smoothingFactor * (avg - smoothed);

                    const safePost = () => {
                        try {
                            if (channelRef.current) {
                                channelRef.current.postMessage({
                                    type: "audioFeatures",
                                    value: {
                                        amplitude: Math.min(1, smoothed * amplitudeGain),
                                        bass: Math.min(1, bass * bassGain),
                                        mid: Math.min(1, mid * midGain),
                                        treble: Math.min(1, treble * trebleGain),
                                    },
                                });
                            }
                        } catch (err) {
                            console.warn("⚠️ BroadcastChannel postMessage failed:", err);
                        }
                    };

                    safePost();
                    requestAnimationFrame(update);
                }

                update();
            } catch (err) {
                console.error("🎤 Mic access error:", err);
            }
        }

        initMic();

        return () => {
            running = false;
            if (channelRef.current) {
                try {
                    channelRef.current.close();
                } catch {}
                channelRef.current = null;
            }
            if (audioContext && audioContext.state !== "closed") {
                audioContext.close().catch(() => {});
            }
        };
    }, [amplitudeGain, bassGain, midGain, trebleGain]);

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
