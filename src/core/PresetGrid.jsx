import { presets } from "@hydra_presets/presets";

export default function PresetGrid({ onSelect }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {presets.map((preset) => (
                <button
                    key={preset.id}
                    onClick={() => onSelect(preset.fn)}
                    className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl backdrop-blur border border-white/10 transition flex flex-col"
                >
                    {preset.preview ? (
                        <img
                            src={preset.preview}
                            alt={preset.name}
                            className="rounded-lg mb-2 aspect-video object-cover"
                        />
                    ) : (
                        <div className="bg-gray-700 text-center rounded-lg mb-2 aspect-video flex items-center justify-center">
                            <span className="text-sm text-gray-300">No Preview</span>
                        </div>
                    )}
                    <div className="text-left">
                        <h3 className="text-md font-semibold">{preset.name}</h3>
                        <p className="text-xs text-gray-400">{preset.author}</p>
                        <p className="text-xs text-indigo-400 italic">{preset.mood}</p>
                    </div>
                </button>
            ))}
        </div>
    );
}
