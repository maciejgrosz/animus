import { useEffect, useRef, useState } from "react";
import { useMicInput } from "@hooks/useMicInput"; // if you're using it here

export default function SettingsPanel() {
    const [sensitivity, setSensitivity] = useState(5);
    const amplitude = useMicInput(sensitivity);
    const channel = useRef(new BroadcastChannel("animus-control"));

    // send sensitivity changes
    useEffect(() => {
        channel.current.postMessage({ type: "sensitivity", value: sensitivity });
    }, [sensitivity]);

    // send amplitude continuously
    useEffect(() => {
        channel.current.postMessage({ type: "amplitude", value: amplitude });
    }, [amplitude]);

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
            {process.env.NODE_ENV === "development" && (
                <div className="mt-4 text-sm text-gray-400">
                    Live Amplitude: {amplitude.toFixed(4)}
                </div>
            )}
        </div>
    );
}
