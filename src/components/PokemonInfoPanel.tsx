import React from "react";
import { Pokemon } from "@/app/types/Pokemon";

interface Props {
    selectedPokemon: Pokemon | null;
    setSelectedPokemon: React.Dispatch<React.SetStateAction<Pokemon | null>>;
}

export default function PokemonInfoPanel({ selectedPokemon, setSelectedPokemon }: Props) {
    return (
        <>
            {/* Sliding panel */}
            <div
                className={`
          fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-4
          z-50 flex flex-col overflow-y-auto
          transform transition-transform duration-300 ease-in-out
          ${selectedPokemon ? "translate-x-0" : "translate-x-full"}
        `}
            >
                <button
                    onClick={() => setSelectedPokemon(null)}
                    className="self-end mb-4 text-gray-600 hover:text-gray-900"
                    aria-label="Close detail panel"
                    type="button"
                >
                    &times;
                </button>

                {selectedPokemon && (
                    <>
                        <h2 className="text-2xl font-bold mb-2">{selectedPokemon.name}</h2>
                        <img
                            src={selectedPokemon.images.home}
                            alt={selectedPokemon.name}
                            className="w-full h-auto mb-4 object-contain"
                        />
                        <p>
                            <strong>Types:</strong> {selectedPokemon.types.join(", ")}
                        </p>
                    </>
                )}
            </div>
        </>
    );
}
