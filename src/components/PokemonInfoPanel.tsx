import React, { useEffect, useState } from "react";
import { Pokemon } from "@/app/types/Pokemon";

interface Props {
    selectedPokemon: Pokemon | null;
    setSelectedPokemon: React.Dispatch<React.SetStateAction<Pokemon | null>>;
}

type Evolution = {
    id: number;
    name: string;
    sprite: string;
};

export default function PokemonInfoPanel({ selectedPokemon, setSelectedPokemon }: Props) {
    const [evolutionChain, setEvolutionChain] = useState<Evolution[]>([]);

    useEffect(() => {
        async function fetchEvolutionChain(pokemonId: number) {
            try {
                const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
                const speciesData = await speciesRes.json();

                const evoChainRes = await fetch(speciesData.evolution_chain.url);
                const evoChainData = await evoChainRes.json();

                const chain: Evolution[] = [];
                function parseChain(node: any) {
                    if (!node) return;
                    const evoName: string = node.species.name;
                    const evoId = getIdFromUrl(node.species.url);
                    const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evoId}.png`;
                    chain.push({ id: evoId, name: evoName, sprite });

                    if (node.evolves_to.length > 0) {
                        node.evolves_to.forEach(parseChain);
                    }
                }
                parseChain(evoChainData.chain);

                setEvolutionChain(chain);
            } catch (error) {
                console.error("Failed to fetch evolution chain", error);
                setEvolutionChain([]);
            }
        }

        if (selectedPokemon) {
            fetchEvolutionChain(selectedPokemon.id);
        } else {
            setEvolutionChain([]);
        }
    }, [selectedPokemon]);

    function getIdFromUrl(url: string): number {
        const parts = url.split("/").filter(Boolean);
        return Number(parts[parts.length - 1]);
    }

    return (
        <div
            className={`
        fixed top-0 right-0 h-full w-150 bg-white shadow-2xl p-6
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
                    <h2 className="text-3xl font-bold mb-4 text-center capitalize text-black">
                        {selectedPokemon.name}
                    </h2>

                    <img
                        src={selectedPokemon.images.home ?? ""}
                        alt={selectedPokemon.name}
                        className="w-80 h-80 mb-4 object-contain mx-auto rounded-lg shadow-lg bg-gray-50"
                    />

                    {/* Evolution Line */}
                    {evolutionChain.length > 0 && (
                        <section className="mb-6 flex flex-col items-center">
                            <div className="flex space-x-6 justify-center items-center">
                                {evolutionChain.map((evo) => (
                                    <div key={evo.id} className="flex flex-col items-center">
                                        <img
                                            src={evo.sprite}
                                            alt={evo.name}
                                            className="w-16 h-16 object-contain"
                                        />
                                        <span className="capitalize mt-1 text-sm text-gray-700">{evo.name}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="mb-6">
                        <h3 className="text-xl font-semibold mb-2 text-black">Types</h3>
                        <p className="text-gray-700 text-lg">{selectedPokemon.types.join(", ")}</p>
                    </section>

                    {/* Abilities */}
                    <section className="mb-6">
                        <h3 className="text-xl font-semibold mb-2 text-black">Abilities</h3>
                        <ul className="flex flex-col gap-2">
                            {selectedPokemon.abilities.map((ability) => (
                                <li
                                    key={ability.name}
                                    className="capitalize bg-indigo-200 text-indigo-800 rounded-md px-3 py-2 font-medium"
                                >
                                    <strong>{ability.name.replace("-", " ")}</strong>
                                    <p className="text-indigo-700 text-sm mt-1">{ability.description}</p>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="mb-6">
                        <h3 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-3 text-black">
                            Base Stats
                        </h3>
                        <ul className="space-y-1">
                            {selectedPokemon.stats.map((stat) => (
                                <li
                                    key={stat.name}
                                    className="flex justify-between bg-indigo-50 rounded-md px-3 py-1 text-indigo-800 capitalize font-medium"
                                >
                                    <span>{stat.name.replace("-", " ")}</span>
                                    <span>{stat.base_stat}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-3 text-black">
                            Moves (Level-up)
                        </h3>
                        <ul className="max-h-44 overflow-y-auto list-disc list-inside space-y-1 text-gray-800">
                            {selectedPokemon.moves
                                .filter((move) => move.move_learn_method === "level-up")
                                .sort((a, b) => a.level_learned_at - b.level_learned_at)
                                .map((move) => (
                                    <li key={move.name} className="hover:text-indigo-700 cursor-default">
                                        Lv {move.level_learned_at}: {move.name.replace("-", " ")}
                                    </li>
                                ))}
                        </ul>
                    </section>
                </>
            )}
        </div>
    );
}
