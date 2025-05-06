import { useEffect, useRef, useState } from "react";
import { useAudioFeatures } from "@hooks/useAudioFeatures";
import LiveAudioChart from "@components/LiveAudioChart";
import PresetGrid from "@core/PresetGrid";
import { presets as allPresets } from "@hydra_presets/presets";
import useMIDI from "@hooks/useMIDI.js";

export default function SettingsPanel() {
    const [bassSensitivity, setBassSensitivity] = useState(5);
    const [midSensitivity, setMidSensitivity] = useState(5);
    const [trebleSensitivity, setTrebleSensitivity] = useState(5);
    const [autoSwitchEnabled, setAutoSwitchEnabled] = useState(true);
    const [selectedEngine, setSelectedEngine] = useState("all");
    const [features, setFeatures] = useState({ bass: 0, mid: 0, treble: 0, bpm: 0 });

    const channelRef = useRef(null);

    useAudioFeatures({
        bassGain: bassSensitivity,
        midGain: midSensitivity,
        trebleGain: trebleSensitivity,
    });
    useMIDI((message) => {
        const [status, data1, data2] = message.data;

        if (status === 144 && data2 > 0) {
            // pad pressed
            console.log(`Pad pressed: ${data1}`);

            // Example: Map pad numbers to preset IDs
            const padToPreset = {
                36: "waveform",     // Pad 1
                37: "kaleidoscope", // Pad 2
                38: "ambient",      // Pad 3
            };

            const presetId = padToPreset[data1];
            if (presetId) {
                channelRef.current?.postMessage({ type: "selectPreset", id: presetId });
            }
        }

        if (status === 176) {
            // knob turned
            console.log(`Knob moved: ${data1}, value: ${data2}`);

            // Example: Map knob to blend amount
            if (data1 === 1) {
                const blend = data2 / 127; // Normalize to 0-1
                channelRef.current?.postMessage({ type: "blendAmount", value: blend });
            }
        }
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

    const handlePresetSelect = (preset) => {
        if (preset?.id) {
            channelRef.current?.postMessage({ type: "selectPreset", id: preset.id });
        }
    };

    const handleToggleAutoSwitch = () => {
        const newValue = !autoSwitchEnabled;
        setAutoSwitchEnabled(newValue);
        channelRef.current?.postMessage({
            type: "autoSwitchEnabled",
            value: newValue,
        });
    };

    const handleRandomize = () => {
        window.__RANDOMIZE?.();
        channelRef.current?.postMessage({ type: "randomizePreset" });
    };

    const filteredPresets = allPresets.filter(p => selectedEngine === "all" || p.engine === selectedEngine);

    return (
        <div className="p-4 text-white bg-black h-screen w-full overflow-y-auto text-sm space-y-5">

            {/* Controls Panel */}
            <div className="bg-white/5 p-4 rounded-xl space-y-4 border border-white/10">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold mb-1">🕒 BPM</h2>
                        <div className="text-xl font-mono text-green-400">
                            {features.bpm ? `${features.bpm} BPM` : "Detecting..."}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleToggleAutoSwitch}
                            className={`px-4 py-1.5 rounded text-xs transition ${
                                autoSwitchEnabled ? "bg-green-600" : "bg-gray-600"
                            }`}
                        >
                            {autoSwitchEnabled ? "Auto-Switch ON" : "Auto-Switch OFF"}
                        </button>
                        <button
                            onClick={handleRandomize}
                            className="bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded text-xs"
                        >
                            🎲 Random
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium">🎛 Engine Filter</label>
                    <select
                        value={selectedEngine}
                        onChange={(e) => setSelectedEngine(e.target.value)}
                        className="w-full bg-black border border-gray-500 text-white py-1 px-3 rounded"
                    >
                        <option value="all">All Engines</option>
                        <option value="threejs">Three.js</option>
                        <option value="hydra">Hydra</option>
                    </select>
                </div>
            </div>

            {/* Sensitivity Sliders */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                <h2 className="text-lg font-semibold mb-1">🎚️ Sensitivity</h2>

                {[
                    ["Bass", bassSensitivity, setBassSensitivity],
                    ["Mid", midSensitivity, setMidSensitivity],
                    ["Treble", trebleSensitivity, setTrebleSensitivity],
                ].map(([label, value, setValue]) => (
                    <div key={label}>
                        <label className="block text-sm mb-1">{label}: {value.toFixed(1)}</label>
                        <input
                            type="range"
                            min="0.1" max="10" step="0.1"
                            value={value}
                            onChange={(e) => setValue(parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                ))}
            </div>

            {/* Visual Presets */}
            <div>
                <h2 className="text-lg font-bold mb-2">🎨 Visual Presets</h2>
                <div className="max-h-[36vh] overflow-y-auto">
                    <PresetGrid
                        onSelect={handlePresetSelect}
                        thumbnailSize="small"
                        presets={filteredPresets}
                    />
                </div>
            </div>

            {/* Frequency Response */}
            <div>
                <h2 className="text-lg font-bold mb-2">📊 Frequency Response</h2>
                <div className="scale-[0.75] origin-top-left">
                    <LiveAudioChart />
                </div>
            </div>
        </div>
    );
}
