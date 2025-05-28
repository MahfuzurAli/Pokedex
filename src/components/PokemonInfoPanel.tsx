import React, { useEffect, useState, ReactElement, JSX } from "react";
import { Pokemon } from "@/app/types/Pokemon";
import { Evolution } from "@/app/types/Evolution";
import { EvolutionNode } from "@/app/types/EvolutionNode";

const typeColors: Record<string, string> = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-cyan-300",
    fighting: "bg-orange-600",
    poison: "bg-purple-500",
    ground: "bg-yellow-700",
    flying: "bg-indigo-300",
    psychic: "bg-pink-400",
    bug: "bg-lime-500",
    rock: "bg-yellow-600",
    ghost: "bg-violet-600",
    dragon: "bg-indigo-700",
    dark: "bg-gray-700",
    steel: "bg-slate-400",
    fairy: "bg-pink-300",
    stellar: "bg-gradient-to-r from-purple-400 to-blue-400",
    unknown: "bg-gray-600",
};

interface Props {
    selectedPokemon: Pokemon | null;
    setSelectedPokemon: React.Dispatch<React.SetStateAction<Pokemon | null>>;
}

export default function PokemonInfoPanel({ selectedPokemon, setSelectedPokemon }: Props) {
    const [selectedArtwork, setSelectedArtwork] = useState<"official" | "home" | "sprite">("home");
    const [evolutionChainTree, setEvolutionChainTree] = useState<EvolutionNode | null>(null);
    const [abilitiesWithDesc, setAbilitiesWithDesc] = useState<{ name: string; description: string }[]>([]);

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
            if (!selectedPokemon) {
                setAbilitiesWithDesc([]);
                return;
            }

            const abilitiesDetailed = await Promise.all(
                selectedPokemon.abilities.map(async (ability) => {
                    try {
                        const res = await fetch(`https://pokeapi.co/api/v2/ability/${ability.name}`);
                        const data = await res.json();
                        const englishEntry = data.effect_entries.find(
                            (entry: any) => entry.language.name === "en"
                        );
                        return {
                            name: ability.name,
                            description: englishEntry?.short_effect ?? "No description available.",
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

        if (selectedPokemon) {
            fetchEvolutionChain(selectedPokemon.id);
            fetchAbilitiesDescriptions();
        } else {
            setEvolutionChainTree
            setAbilitiesWithDesc([]);
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
        fixed top-0 right-0 h-full w-130 bg-white shadow-2xl p-6
        z-50 flex flex-col overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${selectedPokemon ? "translate-x-0" : "translate-x-full"}
      `}
        >
            <button
                onClick={() => setSelectedPokemon(null)}
                className="self-end mb-6 text-gray-500 hover:text-gray-900 text-3xl font-bold transition-colors"
                aria-label="Close detail panel"
                type="button"
            >
                &times;
            </button>

            {selectedPokemon && (
                <>
                    <h2 className="text-3xl font-bold mb-2 text-center capitalize text-black">
                        {selectedPokemon.name}
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

                    <div className="flex flex-col items-center mb-6 gap-4">
                        <img
                            src={selectedPokemon.images[selectedArtwork] ?? ""}
                            alt={selectedPokemon.name}
                            className="w-80 h-80 object-contain rounded-lg shadow-lg bg-gray-50"
                        />

                        <div className="flex justify-between w-full max-w-xs">
                            {(["official", "home", "sprite"] as const).map((artwork) => (
                                <button
                                    key={artwork}
                                    onClick={() => setSelectedArtwork(artwork)}
                                    className={`px-2 py-0.5 rounded border transition-colors ${selectedArtwork === artwork
                                        ? "bg-indigo-600 text-white border-indigo-600"
                                        : "bg-indigo-100 text-indigo-900 border-indigo-300 hover:bg-indigo-200"
                                        }`}
                                >
                                    {artwork.charAt(0).toUpperCase() + artwork.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Evolution Line */}
                    {evolutionChainTree && (
                        <section className="mb-6 flex flex-col items-center">
                            <h3 className="text-xl font-semibold mb-3 text-black">Evolution Line</h3>
                            {renderEvolutionTree(evolutionChainTree)}
                        </section>
                    )}



                    {/* Abilities */}
                    <section className="mb-6">
                        <h3 className="text-xl font-semibold mb-2 text-black">Abilities</h3>
                        <ul className="flex flex-col gap-2">
                            {abilitiesWithDesc.length > 0 ? (
                                abilitiesWithDesc.map((ability) => (
                                    <li
                                        key={ability.name}
                                        className="capitalize bg-indigo-200 text-indigo-800 rounded-md px-3 py-2 font-medium"
                                    >
                                        <strong>{ability.name.replace("-", " ")}</strong>
                                        <p className="text-indigo-700 text-sm mt-1">{ability.description}</p>
                                    </li>
                                ))
                            ) : (
                                <p>Loading abilities...</p>
                            )}
                        </ul>
                    </section>

                    {/* Base Stats */}
                    <section className="mb-6">
                        <h3 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-3 text-black">
                            Base Stats
                        </h3>
                        <ul className="space-y-2 max-w-md">
                            {selectedPokemon.stats.map((stat) => {
                                const maxStatValue = 255; // approx max base stat in Pokemon games
                                const widthPercent = (stat.base_stat / maxStatValue) * 100;

                                return (
                                    <li key={stat.name} className="flex items-center space-x-1">
                                        <span className="w-28 capitalize font-medium text-indigo-800">
                                            {stat.name.replace("-", " ")}
                                        </span>
                                        <div className="flex-1 bg-indigo-100 rounded-full h-5 overflow-hidden">
                                            <div
                                                className="bg-indigo-600 h-5 rounded-full transition-all duration-300"
                                                style={{ width: `${widthPercent}%` }}
                                            />
                                        </div>
                                        <span className="w-10 text-right font-semibold text-indigo-900">
                                            {stat.base_stat}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>

                    {/* Moves */}
                    <section>
                        <h3 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-4 text-black">
                            Moves (Level-up)
                        </h3>
                        <ul className="max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-900">
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
                                        className="flex justify-between items-center bg-indigo-50 hover:bg-indigo-100 rounded-md px-4 py-2 cursor-default transition-colors"
                                    >
                                        <span className="font-medium text-indigo-900">
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
