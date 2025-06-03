import React from "react";

interface ImageStyleSelectorProps {
    imageStyle: 'official' | 'home' | 'sprite';
    setImageStyle: (style: 'official' | 'home' | 'sprite') => void;
}

const ImageStyleSelector: React.FC<ImageStyleSelectorProps> = ({ imageStyle, setImageStyle }) => (
    <div className="flex justify-end gap-2 mb-4">
        {(['home', 'official', 'sprite'] as const).map(style => (
            <button
                key={style}
                onClick={() => setImageStyle(style)}
                className={`
          p-1 rounded
          bg-transparent
          ${imageStyle === style ? 'ring-2 ring-indigo-500' : ''}
          transition
          hover:ring-2 hover:ring-indigo-300
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
                    className="w-8 h-8 object-contain"
                    draggable={false}
                    style={{ background: "transparent" }}
                />
            </button>
        ))}
    </div>
);

export default ImageStyleSelector;