import { presets } from "@hydra_presets/presets";

export default function PresetGrid({ onSelect, thumbnailSize = "normal", presets: filteredPresets = [] }) {
    const previewClass =
        thumbnailSize === "small"
            ? "h-[80px] object-cover mb-2 rounded-md"
            : "aspect-video object-cover mb-2 rounded-lg";

    return (
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 p-2">
            {filteredPresets.map((preset) => (
                <button
                    key={preset.id}
                    onClick={() => onSelect(preset)}
                    className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl backdrop-blur border border-white/10 transition flex flex-col"
                >
                    {preset.preview ? (
                        <img
                            src={preset.preview}
                            alt={preset.name}
                            className={previewClass}
                        />
                    ) : (
                        <div className={`bg-gray-700 text-center ${previewClass} flex items-center justify-center`}>
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
