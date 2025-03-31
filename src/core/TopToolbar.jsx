import { Shuffle, Layers } from "lucide-react";

export default function TopToolbar({ onRandomize, onTogglePresets }) {
    return (
        <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
                onClick={onRandomize}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-md flex items-center justify-center"
                title="Randomize"
            >
                <Shuffle className="w-5 h-5" />
            </button>
            <button
                onClick={onTogglePresets}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-md flex items-center justify-center"
                title="Show Presets"
            >
                <Layers className="w-5 h-5" />
            </button>
        </div>
    );
}
