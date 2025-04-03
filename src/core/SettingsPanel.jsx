import { useEffect, useState } from "react";
import { useAudioFeatures } from "@hooks/useAudioFeatures";

export default function SettingsPanel() {
    const [sensitivity, setSensitivity] = useState(5);
    const [features, setFeatures] = useState({
        amplitude: 0,
        bass: 0,
        mid: 0,
        treble: 0,
    });

    // 🎧 Start capturing mic and broadcasting features
    useAudioFeatures(sensitivity);

    // ✅ Broadcast sensitivity change
    useEffect(() => {
        const channel = new BroadcastChannel("animus-control");
        channel.postMessage({ type: "sensitivity", value: sensitivity });
        return () => channel.close();
    }, [sensitivity]);

    // ✅ Listen for feedback to display live values (safe channel)
    useEffect(() => {
        const channel = new BroadcastChannel("animus-control");
        channel.onmessage = (e) => {
            if (e.data.type === "audioFeatures") {
                setFeatures(e.data.value);
            }
        };
        return () => channel.close();
    }, []);

    return (
        <div className="p-4 text-white bg-black h-screen w-full overflow-y-auto">
            <h1 className="text-2xl font-bold mb-6">🎛️ Animus Settings</h1>

            <label className="block mb-2 text-sm">Mic Sensitivity: {sensitivity.toFixed(1)}</label>
            <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={sensitivity}
                onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                className="w-full mb-6"
            />

            <h2 className="text-lg font-semibold mt-6 mb-2">🔊 Live Audio Values</h2>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                <div>Amplitude:</div><div>{features.amplitude.toFixed(3)}</div>
                <div>Bass:</div><div>{features.bass.toFixed(3)}</div>
                <div>Mid:</div><div>{features.mid.toFixed(3)}</div>
                <div>Treble:</div><div>{features.treble.toFixed(3)}</div>
            </div>
        </div>
    );
}
