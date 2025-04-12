// src/components/LiveAudioChart.jsx
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(BarElement, CategoryScale, LinearScale, ChartDataLabels);

export default function LiveAudioChart() {
    const [features, setFeatures] = useState({
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

    const clipThreshold = 0.95;

    const data = {
        labels: ["Bass", "Mid", "Treble"],
        datasets: [
            {
                label: "🔊 Live Frequency Levels",
                data: [
                    features.bass,
                    features.mid,
                    features.treble,
                ],
                backgroundColor: [
                    features.bass >= clipThreshold ? "#dc2626" : "#f97316",
                    features.mid >= clipThreshold ? "#ca8a04" : "#facc15",
                    features.treble >= clipThreshold ? "#2563eb" : "#4ade80",
                ],
            },
        ],
    };

    const options = {
        indexAxis: "y",
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                min: 0,
                max: 1,
            },
        },
        plugins: {
            datalabels: {
                display: false,
            },
            legend: { display: false },
        },
    };

    return (
        <div className="mt-4 h-28">
            <Bar data={data} options={options} />
        </div>
    );
}
