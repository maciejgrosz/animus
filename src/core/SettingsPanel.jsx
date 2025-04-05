import { useEffect, useRef, useState } from "react";
import { useAudioFeatures } from "@hooks/useAudioFeatures";
import LiveAudioChart from "@components/LiveAudioChart";
import PresetGrid from "@core/PresetGrid";

export default function SettingsPanel() {
    const [bassSensitivity, setBassSensitivity] = useState(5);
    const [midSensitivity, setMidSensitivity] = useState(5);
    const [trebleSensitivity, setTrebleSensitivity] = useState(5);
    const [features, setFeatures] = useState({ bass: 0, mid: 0, treble: 0 });

    const channelRef = useRef(null);

    useAudioFeatures({
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

        return () => ch.close();
    }, []);

    // ✅ Send preset ID instead of function
    const handlePresetSelect = (preset) => {
        if (preset?.id) {
            channelRef.current?.postMessage({ type: "selectPreset", id: preset.id });
        }
    };

    return (
        <div className="p-4 text-white bg-black h-screen w-full overflow-y-auto text-sm">
            <div className="mb-6">
                <h2 className="text-lg font-bold mb-3">🎚️ Sensitivity</h2>

                <label className="block mb-1">Bass: {bassSensitivity.toFixed(1)}</label>
                <input type="range" min="0.1" max="10" step="0.1" value={bassSensitivity}
                       onChange={(e) => setBassSensitivity(parseFloat(e.target.value))} className="w-full mb-3" />

                <label className="block mb-1">Mid: {midSensitivity.toFixed(1)}</label>
                <input type="range" min="0.1" max="10" step="0.1" value={midSensitivity}
                       onChange={(e) => setMidSensitivity(parseFloat(e.target.value))} className="w-full mb-3" />

                <label className="block mb-1">Treble: {trebleSensitivity.toFixed(1)}</label>
                <input type="range" min="0.1" max="10" step="0.1" value={trebleSensitivity}
                       onChange={(e) => setTrebleSensitivity(parseFloat(e.target.value))} className="w-full mb-3" />
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-bold mb-2">🎨 Visual Presets</h2>
                <div className="max-h-[32vh] overflow-y-auto">
                    <PresetGrid onSelect={handlePresetSelect} thumbnailSize="small" />
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-bold mb-2">📊 Frequency Response</h2>
                <div className="scale-[0.75] origin-top-left">
                    <LiveAudioChart />
                </div>
            </div>
        </div>
    );
}
