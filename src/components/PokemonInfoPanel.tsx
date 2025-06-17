import React, { useEffect, useState, ReactElement, JSX } from "react";
import { Pokemon } from "@/app/types/Pokemon";
import { Evolution } from "@/app/types/Evolution";
import { EvolutionNode } from "@/app/types/EvolutionNode";
import PokemonTabs from "./PokemonTabs";
import ImageStyleSelector from "./ImageStyleSelector";
import { FastAverageColor } from "fast-average-color";
import { getContrastingColor, getHarmoniousBgColor, darkenColor } from "@/utils/colorUtils";

const typeColors: Record<string, string> = {
    normal: "bg-[#828282]",
    fire: "bg-[#e4613e]",
    water: "bg-[#3099e1]",
    electric: "bg-[#dfbc28]",
    grass: "bg-[#439837]",
    ice: "bg-[#47c8c8]",
    fighting: "bg-[#e49021]",
    poison: "bg-[#9354cb]",
    ground: "bg-[#a4733c]",
    flying: "bg-[#74aad0]",
    psychic: "bg-[#e96c8c]",
    bug: "bg-[#9f9f28]",
    rock: "bg-[#a9a481]",
    ghost: "bg-[#6f4570]",
    dragon: "bg-[#576fbc]",
    dark: "bg-[#4f4747]",
    steel: "bg-[#74b0cb]",
    fairy: "bg-[#e18ce1]",
    stellar: "bg-gradient-to-r from-purple-400 to-blue-400",
    unknown: "bg-gray-600",
};

interface Props {
    selectedPokemon: Pokemon | null;
    setSelectedPokemon: (pokemon: Pokemon | null) => void;
    showMinimize?: boolean;
    onMinimize?: () => void;
    darkMode?: boolean;
    onColorChange?: (color: string) => void;
}

export default function PokemonInfoPanel({ selectedPokemon, setSelectedPokemon, showMinimize, onMinimize, darkMode = false, onColorChange }: Props) {
    const [selectedArtwork, setSelectedArtwork] = useState<"official" | "home" | "sprite">("home");
    const [evolutionChainTree, setEvolutionChainTree] = useState<EvolutionNode | null>(null);
    const [abilitiesWithDesc, setAbilitiesWithDesc] = useState<{ name: string; description: string }[]>([]);
    const [isShiny, setIsShiny] = useState(false);
    const [description, setDescription] = useState<string>("");
    const [descriptionVersion, setDescriptionVersion] = useState<string>("");
    const [secondaryDescription, setSecondaryDescription] = useState<string>("");
    const [secondaryDescriptionVersion, setSecondaryDescriptionVersion] = useState<string>("");
    const [bgColor, setBgColor] = useState<string>("#fff");
    const isGiratinaOrigin =
        selectedPokemon &&
        selectedPokemon.rawName === "giratina-altered" &&
        (
            selectedPokemon.id === 10007 ||
            selectedPokemon.name.toLowerCase().includes("origin") ||
            (selectedPokemon as any).formName === "Origin"
        );


    // Extract average color when image loads
    const imgRef = React.useRef<HTMLImageElement>(null);
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
        if (selectedPokemon && onColorChange) {
            onColorChange(bgColor);
        }
        // Only call when bgColor or selectedPokemon changes
    }, [bgColor, selectedPokemon]);

    useEffect(() => {
        async function fetchEvolutionChain(pokemonId: number) {
            try {
                const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
                const speciesData = await speciesRes.json();

                const evoChainRes = await fetch(speciesData.evolution_chain.url);
                const evoChainData = await evoChainRes.json();

                const rootNode: EvolutionNode = parseChain(evoChainData.chain);
                setEvolutionChainTree(rootNode);
            } catch (error) {
                console.error("Failed to fetch evolution chain", error);
                setEvolutionChainTree(null);
            }
        }

        async function fetchAbilitiesDescriptions() {
            // Clear abilities before fetching new ones
            setAbilitiesWithDesc([]);
            if (!selectedPokemon) {
                setAbilitiesWithDesc([]);
                return;
            }

            const preferredAbilityVersions = [
                "scarlet-violet",
                "legends-arceus",
                "sword-shield",
                "ultra-sun-ultra-moon",
                "sun-moon",
                "omega-ruby-alpha-sapphire",
                "x-y",
                "black-2-white-2",
                "black-white",
                "heartgold-soulsilver",
                "diamond-pearl",
                "emerald",
                "ruby-sapphire",
                "firered-leafgreen",
            ];
            const abilitiesDetailed = await Promise.all(
                selectedPokemon.abilities.map(async (ability) => {
                    try {
                        const res = await fetch(`https://pokeapi.co/api/v2/ability/${ability.name}`);
                        const data = await res.json();
                        const entries = data.flavor_text_entries.filter((e: any) => e.language.name === "en");

                        let entry = preferredAbilityVersions
                            .map(version => entries.find((e: any) => e.version_group.name === version))
                            .find(Boolean);

                        if (!entry) entry = entries[0];

                        return {
                            name: ability.name,
                            description: entry?.flavor_text.replace(/\f/g, " ") ?? "No description available.",
                        };
                    } catch {
                        return {
                            name: ability.name,
                            description: "Failed to load description.",
                        };
                    }
                })
            );
            setAbilitiesWithDesc(abilitiesDetailed);
        }

        async function fetchDescription(pokemonId: number) {
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
                const data = await res.json();
                const entries = data.flavor_text_entries.filter((e: any) => e.language.name === "en");

                // Standalone games to deprioritize for secondary entry
                const standaloneGames = [
                    "legends-arceus", "lets-go-pikachu", "lets-go-eevee", "brilliant-diamond", "shining-pearl"
                ];

                const preferredVersions = [
                    "scarlet", "violet",
                    "legends-arceus",
                    "sword", "shield",
                    "ultra-sun", "ultra-moon",
                    "sun", "moon",
                    "omega-ruby", "alpha-sapphire",
                    "x", "y",
                    "black-2", "white-2",
                    "black", "white",
                    "heartgold", "soulsilver",
                    "diamond", "pearl", "platinum",
                    "emerald",
                    "ruby", "sapphire",
                    "firered", "leafgreen",
                    ...standaloneGames
                ];

                // Find the main entry
                let mainEntry = preferredVersions
                    .map(version => entries.find((e: any) => e.version.name === version))
                    .find(Boolean);

                if (!mainEntry) mainEntry = entries[0];

                setDescription(
                    mainEntry
                        ? mainEntry.flavor_text.replace(/\f/g, " ").replace(/POK[eé]MON/gi, "Pokémon")
                        : "No description available."
                );
                setDescriptionVersion(mainEntry?.version?.name ?? "");

                // Find the secondary entry: skip the main entry's version and skip standalone games if main is standalone
                let secondaryEntry: any = null;
                if (!mainEntry || standaloneGames.includes(mainEntry.version.name)) {
                    // If main is standalone or missing, do NOT show a secondary entry
                    setSecondaryDescription("");
                    setSecondaryDescriptionVersion("");
                } else {
                    // If main is not standalone, pick the next available different version (not main)
                    secondaryEntry = preferredVersions
                        .map(version => entries.find((e: any) => e.version.name === version && e.version.name !== mainEntry.version.name))
                        .find(Boolean);

                    setSecondaryDescription(
                        secondaryEntry
                            ? secondaryEntry.flavor_text.replace(/\f/g, " ").replace(/POK[eé]MON/gi, "Pokémon")
                            : ""
                    );
                    setSecondaryDescriptionVersion(secondaryEntry?.version?.name ?? "");
                }
            } catch {
                setDescription("No description available.");
                setDescriptionVersion("");
                setSecondaryDescription("");
                setSecondaryDescriptionVersion("");
            }
        }
        if (selectedPokemon) {
            fetchEvolutionChain(selectedPokemon.id);
            fetchAbilitiesDescriptions();
            fetchDescription((selectedPokemon as any).baseSpeciesId || selectedPokemon.id);
        } else {
            setEvolutionChainTree(null);
            setAbilitiesWithDesc([]);
            setDescription("");
        }
    }, [selectedPokemon]);

    function getIdFromUrl(url: string): number {
        const parts = url.split("/").filter(Boolean);
        return Number(parts[parts.length - 1]);
    }

    function parseChain(node: any): EvolutionNode {
        const id = getIdFromUrl(node.species.url);
        const name = node.species.name;
        const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

        return {
            id,
            name,
            sprite,
            evolves_to: node.evolves_to.map((evo: any) => parseChain(evo)),
        };
    }

    function renderEvolutionTree(node: EvolutionNode | null): React.ReactNode {
        if (!node) return null;

        return (
            <div className="flex items-center gap-6">
                <div className="flex flex-col items-center min-w-[80px]">
                    <img
                        src={node.sprite}
                        alt={node.name}
                        className="w-16 h-16 object-contain"
                    />
                    <span className="capitalize mt-1 text-sm text-gray-700">{node.name}</span>
                </div>

                {node.evolves_to.length > 0 && (
                    <>
                        <span className="text-2xl text-gray-500 select-none">→</span>
                        <div className="flex items-center gap-6">
                            {node.evolves_to.map((evo) => (
                                <div key={evo.id}>
                                    {renderEvolutionTree(evo)}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div
            className={`
                fixed top-0 right-0 h-full w-130 shadow-2xl p-6
                z-50 flex flex-col overflow-y-auto
                transform transition-transform duration-300 ease-in-out
                ${selectedPokemon ? "translate-x-0" : "translate-x-full"}
                ${darkMode
                    ? "bg-black/50 backdrop-blur-md text-white"
                    : "bg-white/50 backdrop-blur-md text-black"}
              `}
        >
            <div className="flex items-center justify-end mb-6 gap-2">
                {showMinimize && onMinimize && (
                    <button
                        onClick={onMinimize}
                        className="text-gray-400 hover:text-indigo-600 tFext-3xl font-bold transition-colors"
                        aria-label="Minimize info panel"
                        type="button"
                    >
                        <span style={{ fontSize: "1.5em", lineHeight: 1 }}>–</span>
                    </button>
                )}
                <button
                    onClick={() => setSelectedPokemon(null)}
                    className="text-gray-500 hover:text-gray-900 text-3xl font-bold transition-colors"
                    aria-label="Close detail panel"
                    type="button"
                >
                    &times;
                </button>
            </div>

            {selectedPokemon && (
                <>
                    <h2 className={`text-3xl font-bold mb-2 text-center capitalize ${darkMode ? "text-white" : "text-black"}`}>
                        {
                            selectedPokemon.rawName === "giratina-altered" &&
                                (
                                    selectedPokemon.id === 10007 ||
                                    selectedPokemon.name.toLowerCase().includes("origin")
                                )
                                ? "Giratina (Origin)"
                                : selectedPokemon.rawName === "giratina-altered"
                                    ? "Giratina (Altered)"
                                    : selectedPokemon.name.replace("Giratina Altered", "Giratina")
                        }{" "}
                        <span className="text-lg font-normal text-gray-400">
                            #
                            {
                                (selectedPokemon as any).basePokedexId
                                    ? (selectedPokemon as any).basePokedexId.toString().padStart(3, "0")
                                    : selectedPokemon.id.toString().padStart(3, "0")
                            }
                        </span>
                    </h2>

                    {/* Types badges under name */}
                    <div className="flex justify-center gap-2 mb-6">
                        {selectedPokemon.types.map((type) => (
                            <span
                                key={type}
                                className={`capitalize text-white px-3 py-1 rounded-full font-semibold text-sm ${typeColors[type] ?? "bg-gray-500"
                                    }`}
                            >
                                {type}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col items-center mb-6">
                        <div
                            className="w-90 h-90 rounded-lg shadow-lg flex items-center justify-center cursor-pointer relative"
                            style={{
                                background: `linear-gradient(0deg, ${bgColor}00 0%, ${bgColor} 80%)`,
                                transition: "background 0.5s",
                            }}
                            onClick={() => setIsShiny((prev) => !prev)}
                        >
                            {isShiny && (
                                <img
                                    src="/artwork/shiny-sparkle.png"
                                    alt="Shiny"
                                    className="absolute top-3 left-3 w-7 h-7"
                                    style={{
                                        filter:
                                            "sepia(1) saturate(10) hue-rotate(10deg) brightness(2.5) drop-shadow(0 0 5px #fff700) drop-shadow(0 0 24px #fff700)",
                                    }}
                                    draggable={false}
                                />
                            )}
                            <img
                                ref={imgRef}
                                src={
                                    selectedPokemon
                                        ? selectedArtwork === "official"
                                            ? isShiny
                                                ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${selectedPokemon.id}.png`
                                                : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon.id}.png`
                                            : selectedArtwork === "home"
                                                ? isShiny
                                                    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${selectedPokemon.id}.png`
                                                    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${selectedPokemon.id}.png`
                                                : isShiny
                                                    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${selectedPokemon.id}.png`
                                                    : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPokemon.id}.png`
                                        : ""
                                }
                                alt={selectedPokemon?.name}
                                className="w-80 h-80 object-contain"
                                style={{ userSelect: "none", background: "transparent" }}
                                onLoad={extractColor}
                                crossOrigin="anonymous"
                            />
                        </div>
                        <div className="mt-3">
                            <ImageStyleSelector
                                imageStyle={selectedArtwork}
                                setImageStyle={setSelectedArtwork}
                                darkMode={darkMode}
                            />
                        </div>
                    </div>

                    {/* Evolution Line */}
                    {/* {evolutionChainTree && (
                        <section className="mb-6 flex flex-col items-center">
                            <h3 className="text-xl font-semibold mb-3 text-black">Evolution Line</h3>
                            {renderEvolutionTree(evolutionChainTree)}
                        </section>
                    )} */}

                    {description && (
                        <section className="mb-6">
                            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-black"}`}>
                                Pokédex Entry
                            </h3>
                            {descriptionVersion && (
                                <div className="text-sm font-semibold black mb-1">
                                    {descriptionVersion.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                </div>
                            )}
                            <div
                                className="text-base italic rounded-md px-4 py-3 mb-3"
                                style={{
                                    background: darkMode
                                        ? getContrastingColor(bgColor)
                                        : getHarmoniousBgColor(bgColor),
                                    color: darkenColor(bgColor, 0.3),
                                    border: `1.5px solid ${bgColor}`,
                                }}
                            >
                                {description}
                            </div>
                            {secondaryDescription && (
                                <div>
                                    <span className="text-sm font-semibold black mb-1">
                                        {secondaryDescriptionVersion
                                            ? secondaryDescriptionVersion.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
                                            : ""}
                                    </span>
                                    <div
                                        className="text-base italic rounded-md px-4 py-3 mt-1"
                                        style={{
                                            background: darkMode
                                                ? getContrastingColor(bgColor)
                                                : getHarmoniousBgColor(bgColor),
                                            color: darkenColor(bgColor, 0.3),
                                            border: `1.5px solid ${bgColor}`,
                                        }}
                                    >
                                        {secondaryDescription}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Abilities */}
                    <section className="mb-6">
                        <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-black"}`}>Abilities</h3>
                        <ul className="flex flex-col gap-2">
                            {abilitiesWithDesc.length > 0 ? (
                                abilitiesWithDesc.map((ability) => (
                                    <li
                                        key={ability.name}
                                        className="capitalize rounded-md px-3 py-2 font-medium"
                                        style={{
                                            background: darkMode
                                                ? getContrastingColor(bgColor)
                                                : getHarmoniousBgColor(bgColor),
                                            color: darkenColor(bgColor, 0.3),
                                            border: `1.5px solid ${bgColor}`,
                                        }}
                                    >
                                        <strong style={{ color: darkenColor(bgColor, 0.3) }}>
                                            {ability.name.replace("-", " ")}
                                        </strong>
                                        <p className="text-sm mt-1" style={{ color: darkenColor(bgColor, 0.3) }}>
                                            {ability.description}
                                        </p>
                                    </li>
                                ))
                            ) : (
                                <p>Loading abilities...</p>
                            )}
                        </ul>
                    </section>

                    {/* Base Stats */}
                    <section className="mb-6">
                        <h3 className={`text-xl font-semibold border-b border-gray-300 pb-1 mb-3 ${darkMode ? "text-white" : "text-black"}`}>
                            Base Stats
                        </h3>
                        <ul className="space-y-2 max-w-md">
                            {selectedPokemon.stats.map((stat) => {
                                const maxStatValue = 255; // approx max base stat in Pokemon games
                                const widthPercent = (stat.base_stat / maxStatValue) * 100;

                                return (
                                    <li key={stat.name} className="flex items-center space-x-1">
                                        <span
                                            className="w-28 capitalize font-medium"
                                            style={{ color: darkenColor(bgColor, 0.3) }}
                                        >
                                            {stat.name.replace("-", " ")}
                                        </span>
                                        <div className="flex-1 rounded-full h-5 overflow-hidden"
                                            style={{
                                                background: getHarmoniousBgColor(bgColor),
                                                transition: "background 0.5s",
                                                border: `1px solid ${bgColor}`,
                                            }}>
                                            <div
                                                className="h-5 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${widthPercent}%`,
                                                    background: bgColor,
                                                    boxShadow: `0 0 8px 0 ${bgColor}88`,
                                                }}
                                            />
                                        </div>
                                        <span
                                            className="w-10 text-right font-semibold"
                                            style={{ color: darkenColor(bgColor, 0.3) }}
                                        >
                                            {stat.base_stat}
                                        </span>
                                    </li>
                                );
                            })}
                            <li className="flex items-center space-x-1 mt-2 border-t pt-2">
                                <span className="w-28 font-bold" style={{ color: darkenColor(bgColor, 0.3) }}>Total</span>
                                <div className="flex-1" />
                                <span className="w-10 text-right font-bold" style={{ color: darkenColor(bgColor, 0.3) }}>
                                    {selectedPokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                                </span>
                            </li>
                        </ul>
                    </section>

                    {/* Moves */}
                    <section>
                        <h3 className={`text-xl font-semibold border-b border-gray-300 pb-1 mb-4 ${darkMode ? "text-white" : "text-black"}`}>
                            Moves (Level-up)
                        </h3>
                        <ul className="max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Array.from(
                                new Map(
                                    selectedPokemon.moves
                                        .filter((move) => move.move_learn_method === "level-up")
                                        .map((move) => [
                                            `${move.name}-${move.level_learned_at}`,
                                            move,
                                        ])
                                ).values()
                            )
                                .sort((a, b) => a.level_learned_at - b.level_learned_at)
                                .map((move, idx) => (
                                    <li
                                        key={`${move.name}-${move.level_learned_at}-${idx}`}
                                        className="flex justify-between items-center rounded-md px-4 py-2 cursor-default transition-colors"
                                        style={{
                                            background: darkMode
                                                ? getContrastingColor(bgColor)
                                                : getHarmoniousBgColor(bgColor),
                                            color: bgColor,
                                            border: `1.5px solid ${bgColor}`,
                                        }}
                                    >
                                        <span className="font-medium" style={{ color: darkenColor(bgColor, 0.3) }}>
                                            Lv {move.level_learned_at}: {move.name.replace("-", " ")}
                                        </span>
                                    </li>
                                ))}
                        </ul>
                    </section>

                </>
            )}
        </div>
    );
}
