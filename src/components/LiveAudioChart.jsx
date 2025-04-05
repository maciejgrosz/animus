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

// Gradient coloring based on value (0 → green, 0.5 → yellow, 1 → red)
const getColor = (value) => {
    const v = Math.max(0, Math.min(1, value)); // Clamp
    if (v < 0.5) {
        const r = Math.round(v * 2 * 255);
        return `rgb(${r}, 255, 0)`; // Green to Yellow
    } else {
        const g = Math.round((1 - (v - 0.5) * 2) * 255);
        return `rgb(255, ${g}, 0)`; // Yellow to Red
    }
};

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
                    getColor(features.bass),
                    getColor(features.mid),
                    getColor(features.treble),
                ],
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
                ticks: {
                    stepSize: 0.2,
                },
            },
        },
        plugins: {
            datalabels: {
                display: false, // 👈 Hide all data labels
            },
            legend: { display: false },
        },
    };

    return (
        <div className="mt-6">
            <Bar data={data} options={options} />
        </div>
    );
}
