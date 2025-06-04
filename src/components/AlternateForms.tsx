import React from "react";
import { regionalForms } from "@/app/types/RegionalForms";
import { megaEvolutions } from "@/app/types/MegaEvolutions";
import { Pokemon } from "@/app/types/Pokemon";

interface AlternateFormsProps {
    pokemon: Pokemon;
    megaActive: { [pokemonId: number]: boolean };
    setMegaActive: React.Dispatch<React.SetStateAction<{ [pokemonId: number]: boolean }>>;
    megaFormActive: { [pokemonId: number]: string | null };
    setMegaFormActive: React.Dispatch<React.SetStateAction<{ [pokemonId: number]: string | null }>>;
    regionalFormActive: { [pokemonId: number]: string | null };
    setRegionalFormActive: React.Dispatch<React.SetStateAction<{ [pokemonId: number]: string | null }>>;
}

const AlternateForms: React.FC<AlternateFormsProps> = ({
    pokemon,
    megaActive,
    setMegaActive,
    megaFormActive,
    setMegaFormActive,
    regionalFormActive,
    setRegionalFormActive,
}) => {
    const basePokemon = pokemon;
    const hasRegionalForm = regionalForms.hasOwnProperty(basePokemon.rawName);
    const regionalFormData = regionalForms[basePokemon.rawName as keyof typeof regionalForms];

    // Charizard & Mewtwo: multi-mega
    if (basePokemon.rawName === "charizard") {
        return (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
                {/* Mega X */}
                <button
                    className={`group w-6 h-6 ${megaFormActive[basePokemon.id] === "x" ? "" : "grayscale opacity-60"}`}
                    title="Toggle Mega Charizard X"
                    aria-label="Toggle Mega Charizard X"
                    type="button"
                    onClick={() => setMegaFormActive(prev => ({
                        ...prev,
                        [basePokemon.id]: prev[basePokemon.id] === "x" ? null : "x"
                    }))}
                >
                    <img
                        src="/symbols/mega-symbol.png"
                        alt="Mega Charizard X"
                        className="w-4 h-4 object-contain transition duration-200 group-hover:scale-110"
                        draggable={false}
                    />
                </button>
                {/* Mega Y */}
                <button
                    className={`group w-6 h-6 ${megaFormActive[basePokemon.id] === "y" ? "" : "grayscale opacity-60"}`}
                    title="Toggle Mega Charizard Y"
                    aria-label="Toggle Mega Charizard Y"
                    type="button"
                    onClick={() => setMegaFormActive(prev => ({
                        ...prev,
                        [basePokemon.id]: prev[basePokemon.id] === "y" ? null : "y"
                    }))}
                >
                    <img
                        src="/symbols/mega-symbol.png"
                        alt="Mega Charizard Y"
                        className="w-4 h-4 object-contain transition duration-200 group-hover:scale-110"
                        draggable={false}
                    />
                </button>
            </div>
        );
    }

    if (basePokemon.rawName === "mewtwo") {
        return (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
                {/* Mega X */}
                <button
                    className={`group w-6 h-6 ${megaFormActive[basePokemon.id] === "x" ? "" : "grayscale opacity-60"}`}
                    title="Toggle Mega Mewtwo X"
                    aria-label="Toggle Mega Mewtwo X"
                    type="button"
                    onClick={() => setMegaFormActive(prev => ({
                        ...prev,
                        [basePokemon.id]: prev[basePokemon.id] === "x" ? null : "x"
                    }))}
                >
                    <img
                        src="/symbols/mega-symbol.png"
                        alt="Mega Mewtwo X"
                        className="w-4 h-4 object-contain transition duration-200 group-hover:scale-110"
                        draggable={false}
                    />
                </button>
                {/* Mega Y */}
                <button
                    className={`group w-6 h-6 ${megaFormActive[basePokemon.id] === "y" ? "" : "grayscale opacity-60"}`}
                    title="Toggle Mega Mewtwo Y"
                    aria-label="Toggle Mega Mewtwo Y"
                    type="button"
                    onClick={() => setMegaFormActive(prev => ({
                        ...prev,
                        [basePokemon.id]: prev[basePokemon.id] === "y" ? null : "y"
                    }))}
                >
                    <img
                        src="/symbols/mega-symbol.png"
                        alt="Mega Mewtwo Y"
                        className="w-4 h-4 object-contain transition duration-200 group-hover:scale-110"
                        draggable={false}
                    />
                </button>
            </div>
        );
    }

    if (basePokemon.rawName === "slowbro") {
        return (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
                {/* Galarian */}
                <button
                    className="group w-6 h-6"
                    title="Toggle Galarian Slowbro"
                    aria-label="Toggle Galarian Slowbro"
                    type="button"
                    onClick={() => {
                        setRegionalFormActive(prev => ({
                            ...prev,
                            [basePokemon.id]: prev[basePokemon.id] === "galar" ? null : "galar"
                        }));
                        setMegaActive(prev => ({
                            ...prev,
                            [basePokemon.id]: false
                        }));
                    }}
                >
                    <img
                        src="/symbols/galar-symbol.png"
                        alt="Galarian Form"
                        className={`w-4 h-4 object-contain transition duration-200
              ${regionalFormActive[basePokemon.id] === "galar"
                                ? "filter invert sepia saturate-[5000%] hue-rotate-[180deg] opacity-90"
                                : ""}
              group-hover:filter group-hover:invert group-hover:sepia group-hover:saturate-[5000%] group-hover:hue-rotate-[180deg] group-hover:opacity-90`}
                        draggable={false}
                    />
                </button>
                {/* Mega */}
                <button
                    className={`group w-6 h-6 ${megaActive[basePokemon.id] ? "" : "grayscale opacity-60"}`}
                    title="Toggle Mega Slowbro"
                    aria-label="Toggle Mega Slowbro"
                    type="button"
                    onClick={() => {
                        setMegaActive(prev => ({
                            ...prev,
                            [basePokemon.id]: !prev[basePokemon.id]
                        }));
                        setRegionalFormActive(prev => ({
                            ...prev,
                            [basePokemon.id]: null
                        }));
                    }}
                >
                    <img
                        src="/symbols/mega-symbol.png"
                        alt="Mega Slowbro"
                        className="w-4 h-4 object-contain transition duration-200 group-hover:scale-110"
                        draggable={false}
                    />
                </button>
            </div>
        );
    }

    if (basePokemon.rawName === "meowth") {
        return (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
                {/* Alolan Meowth */}
                <button
                    className="group w-6 h-6"
                    title="Toggle Alolan Meowth"
                    aria-label="Toggle Alolan Meowth"
                    type="button"
                    onClick={() =>
                        setRegionalFormActive(prev => ({
                            ...prev,
                            [basePokemon.id]: prev[basePokemon.id] === "alola" ? null : "alola"
                        }))
                    }
                >
                    <img
                        src="/symbols/alola-symbol.png"
                        alt="Alolan Form"
                        className={`w-4 h-4 object-contain transition duration-200
                            ${regionalFormActive[basePokemon.id] === "alola"
                                ? "filter invert sepia saturate-[5000%] hue-rotate-[45deg] opacity-90"
                                : ""}
                            group-hover:filter group-hover:invert group-hover:sepia group-hover:saturate-[5000%] group-hover:hue-rotate-[45deg] group-hover:opacity-90`}
                        draggable={false}
                    />
                </button>
                {/* Galarian Meowth */}
                <button
                    className="group w-6 h-6"
                    title="Toggle Galarian Meowth"
                    aria-label="Toggle Galarian Meowth"
                    type="button"
                    onClick={() =>
                        setRegionalFormActive(prev => ({
                            ...prev,
                            [basePokemon.id]: prev[basePokemon.id] === "galar" ? null : "galar"
                        }))
                    }
                >
                    <img
                        src="/symbols/galar-symbol.png"
                        alt="Galarian Form"
                        className={`w-4 h-4 object-contain transition duration-200
                            ${regionalFormActive[basePokemon.id] === "galar"
                                ? "filter invert sepia saturate-[5000%] hue-rotate-[45deg] opacity-90"
                                : ""}
                            group-hover:filter group-hover:invert group-hover:sepia group-hover:saturate-[5000%] group-hover:hue-rotate-[45deg] group-hover:opacity-90`}
                        draggable={false}
                    />
                </button>
            </div>
        );
    }

    // Default single mega button for other Pokémon
    if (megaEvolutions[basePokemon.rawName]) {
        return (
            <button
                className="group absolute top-2 right-2 w-6 h-6"
                title="Toggle Mega Evolution"
                aria-label={`Toggle Mega Evolution for ${basePokemon.name}`}
                type="button"
                onClick={() => setMegaActive(prev => ({
                    ...prev,
                    [basePokemon.id]: !prev[basePokemon.id]
                }))}
            >
                <img
                    src="/symbols/mega-symbol.png"
                    alt="Mega Evolution"
                    className={`w-4 h-4 object-contain transition duration-200
            ${!megaActive[basePokemon.id] ? "grayscale opacity-60" : ""}
            group-hover:scale-110
          `}
                    draggable={false}
                />
            </button>
        );
    }

    // Regional form toggle button
    if (hasRegionalForm && regionalFormData && basePokemon.rawName !== "slowbro") {
        return (
            <button
                className="group absolute top-2 right-2 w-6 h-6"
                title="Toggle Regional Form"
                aria-label={`Toggle regional form for ${basePokemon.name}`}
                type="button"
                onClick={() => {
                    setRegionalFormActive(prev => ({
                        ...prev,
                        [basePokemon.id]: prev[basePokemon.id] ? null : "active"
                    }));
                }}
            >
                <img
                    src={
                        regionalFormData.formName?.toLowerCase().includes("alola")
                            ? "/symbols/alola-symbol.png"
                            : regionalFormData.formName?.toLowerCase().includes("galar")
                                ? "/symbols/galar-symbol.png"
                                : regionalFormData.formName?.toLowerCase().includes("hisui")
                                    ? "/symbols/hisui-symbol.png"
                                    : regionalFormData.formName?.toLowerCase().includes("paldea")
                                        ? "/symbols/paldea-symbol.png"
                                        : ""
                    }
                    alt={`${regionalFormData.formName} Form`}
                    className={`w-4 h-4 object-contain transition duration-200
            ${regionalFormActive[basePokemon.id]
                            ? "filter invert sepia saturate-[5000%] hue-rotate-[180deg] opacity-90"
                            : ""}
            group-hover:filter group-hover:invert group-hover:sepia group-hover:saturate-[5000%] group-hover:hue-rotate-[180deg] group-hover:opacity-90`}
                    draggable={false}
                />
            </button>
        );
    }

    return null;
};

export default AlternateForms;