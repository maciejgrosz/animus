// src/components/LiveAudioChart.jsx
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function LiveAudioChart() {
    const [features, setFeatures] = useState({
        amplitude: 0,
        bass: 0,
        mid: 0,
        treble: 0,
    });

    useEffect(() => {
        const channel = new BroadcastChannel("animus-control");
        channel.onmessage = (e) => {
            if (e.data.type === "audioFeatures") {
                setFeatures(e.data.value);
            }
        };
        return () => channel.close();
    }, []);

    const data = {
        labels: ["Amplitude", "Bass", "Mid", "Treble"],
        datasets: [
            {
                label: "🔊 Live Audio Values",
                data: [
                    features.amplitude.toFixed(3),
                    features.bass.toFixed(3),
                    features.mid.toFixed(3),
                    features.treble.toFixed(3),
                ],
                backgroundColor: ["#eab308", "#ef4444", "#22c55e", "#3b82f6"],
            },
        ],
    };

    const options = {
        indexAxis: "y",
        animation: false,
        scales: {
            x: {
                min: 0,
                max: 1,
            },
        },
    };

    return (
        <div className="mt-6">
            <Bar data={data} options={options} />
        </div>
    );
}
