import React from "react";

interface ImageStyleSelectorProps {
    imageStyle: 'official' | 'home' | 'sprite';
    setImageStyle: (style: 'official' | 'home' | 'sprite') => void;
    darkMode?: boolean;
}

const ImageStyleSelector: React.FC<ImageStyleSelectorProps> = ({
    imageStyle,
    setImageStyle,
    darkMode = false,
}) => (
    <div className="flex justify-end gap-2 mb-4">
        {(['home', 'official', 'sprite'] as const).map(style => {
            const borderClass = darkMode ? "border-white" : "border-black";
            const ringClass =
                imageStyle === style
                    ? darkMode
                        ? "ring-2 ring-white"
                        : "ring-1 ring-black"
                    : "";
            const hoverRingClass = darkMode
                ? "hover:ring-2 hover:ring-white"
                : "hover:ring-2 hover:ring-black";
            return (
                <button
                    key={style}
                    onClick={() => setImageStyle(style)}
                    className={`
                        p-1 rounded
                        border ${borderClass}
                        transition
                        ${hoverRingClass}
                        ${ringClass}
                    `}
                    title={
                        style === 'official'
                            ? "Official Artwork"
                            : style === 'home'
                                ? "Home Artwork"
                                : "Sprite Artwork"
                    }
                    type="button"
                >
                    <img
                        src={`/artwork/${style}-artwork.png`}
                        alt={`${style} artwork`}
                        className={`w-8 h-8 object-contain ${darkMode ? "filter brightness-0 invert" : ""}`}
                        draggable={false}
                        style={{ background: "transparent" }}
                    />
                </button>
            );
        })}
    </div>
);

export default ImageStyleSelector;