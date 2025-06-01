import React, { useEffect, useRef, useState } from "react";
import { FastAverageColor } from "fast-average-color";

interface PokemonCardProps {
    imageUrl: string;
    displayName: string;
    children?: React.ReactNode;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
    imageUrl,
    displayName,
    children,
}) => {
    const [bgColor, setBgColor] = useState<string>("#fff");
    const imgRef = useRef<HTMLImageElement>(null);

    const extractColor = () => {
        const fac = new FastAverageColor();
        const img = imgRef.current;
        if (img) {
            fac.getColorAsync(img)
                .then(color => setBgColor(color.hex))
                .catch(() => setBgColor("#fff"));
        }
    };

    useEffect(() => {
        const img = imgRef.current;
        if (img && img.complete && img.naturalWidth !== 0) {
            extractColor();
        }
    }, [imageUrl]);

    return (
        <li
            className="rounded-lg shadow p-3 flex flex-col items-center justify-between aspect-square text-sm relative"
            style={{
                background: `linear-gradient(0deg, rgba(255,255,255,0.10), rgba(${parseInt(bgColor.slice(1, 3), 16)},${parseInt(bgColor.slice(3, 5), 16)},${parseInt(bgColor.slice(5, 7), 16)},0.9))`,
                transition: "background 0.5s",
            }}
        >
            <img
                ref={imgRef}
                src={imageUrl}
                alt={displayName}
                className="w-35 h-35 object-contain mb-2"
                loading="lazy"
                crossOrigin="anonymous"
                onLoad={extractColor}
            />
            {children}
        </li>
    );
};

export default PokemonCard;