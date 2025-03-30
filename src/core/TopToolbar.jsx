import { Shuffle } from "lucide-react";

export default function TopToolbar({ onRandomize }) {
    return (
        <div className="absolute top-4 left-4 z-50 flex space-x-4">
            <button
                onClick={onRandomize}
                className="bg-black/40 text-white p-2 rounded-full hover:bg-white/20 transition"
            >
                <Shuffle className="w-5 h-5" />
            </button>
        </div>
    );
}
