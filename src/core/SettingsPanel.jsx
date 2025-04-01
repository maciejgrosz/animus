// src/core/SettingsPanel.jsx
import { useEffect, useState } from "react";

export default function SettingsPanel() {
    const [sensitivity, setSensitivity] = useState(5);
    const channel = new BroadcastChannel("animus-control");

    useEffect(() => {
        channel.postMessage({ type: "sensitivity", value: sensitivity });
    }, [sensitivity]);

    return (
        <div className="p-4 text-white bg-black h-screen w-full">
            <h1 className="text-2xl font-bold mb-6">🎛️ Animus Settings</h1>

            <label className="block mb-2 text-sm">Mic Sensitivity: {sensitivity.toFixed(1)}</label>
            <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={sensitivity}
                onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                className="w-full mb-4"
            />
        </div>
    );
}
