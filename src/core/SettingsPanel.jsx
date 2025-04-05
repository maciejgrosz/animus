import { useEffect, useRef, useState } from "react";
import { useAudioFeatures } from "@hooks/useAudioFeatures";
import LiveAudioChart from "@components/LiveAudioChart";

export default function SettingsPanel() {
    const [masterSensitivity, setMasterSensitivity] = useState(5);
    const [bassSensitivity, setBassSensitivity] = useState(5);
    const [midSensitivity, setMidSensitivity] = useState(5);
    const [trebleSensitivity, setTrebleSensitivity] = useState(5);
    const [features, setFeatures] = useState({
        amplitude: 0,
        bass: 0,
        mid: 0,
        treble: 0,
    });

    const channelRef = useRef(null);

    useAudioFeatures({
        amplitudeGain: masterSensitivity,
        bassGain: bassSensitivity,
        midGain: midSensitivity,
        trebleGain: trebleSensitivity,
    });

    useEffect(() => {
        const ch = new BroadcastChannel("animus-control");
        channelRef.current = ch;

        ch.onmessage = (event) => {
            if (event.data.type === "audioFeatures") {
                setFeatures(event.data.value);
            }
        };

        return () => {
            ch.close();
        };
    }, []);

    return (
        <div className="p-4 text-white bg-black h-screen w-full overflow-y-auto">
            <h1 className="text-2xl font-bold mb-6">🎛️ Animus Settings</h1>

            {/* Master Sensitivity */}
            <label className="block mb-2 text-sm">Master Sensitivity: {masterSensitivity.toFixed(1)}</label>
            <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={masterSensitivity}
                onChange={(e) => setMasterSensitivity(parseFloat(e.target.value))}
                className="w-full mb-4"
            />

            {/* Frequency Bands */}
            <label className="block mb-2 text-sm">Bass Sensitivity: {bassSensitivity.toFixed(1)}</label>
            <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={bassSensitivity}
                onChange={(e) => setBassSensitivity(parseFloat(e.target.value))}
                className="w-full mb-4"
            />

            <label className="block mb-2 text-sm">Mid Sensitivity: {midSensitivity.toFixed(1)}</label>
            <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={midSensitivity}
                onChange={(e) => setMidSensitivity(parseFloat(e.target.value))}
                className="w-full mb-4"
            />

            <label className="block mb-2 text-sm">Treble Sensitivity: {trebleSensitivity.toFixed(1)}</label>
            <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={trebleSensitivity}
                onChange={(e) => setTrebleSensitivity(parseFloat(e.target.value))}
                className="w-full mb-4"
            />
            <LiveAudioChart />
        </div>
    );
}
