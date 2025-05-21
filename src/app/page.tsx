'use client';

import { useEffect, useState } from "react";
import { fetchAllPokemon } from "@/lib/pokeapi";

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
  unknown: "bg-gray-600"
};

type Pokemon = {
  id: number;
  name: string;
  sprite: string;
  types: string[];
};

export default function HomePage() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGeneration, setSelectedGeneration] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
  const [selectedNature, setSelectedNature] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAllPokemon();
      setPokemonList(data);
    };
    loadData();
  }, []);

  const filteredList = pokemonList.filter((pokemon) => {
    const matchesName = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType ? pokemon.types.includes(selectedType) : true;

    const genRanges: Record<string, [number, number]> = {
      Kanto: [1, 151],
      Johto: [152, 251],
      Hoenn: [252, 386],
      Sinnoh: [387, 493],
      Unova: [494, 649],
      Kalos: [650, 721],
      Alola: [722, 809],
      Galar: [810, 898],
      Paldea: [899, 1025],
    };

    const matchesGeneration = selectedGeneration
      ? pokemon.id >= genRanges[selectedGeneration][0] && pokemon.id <= genRanges[selectedGeneration][1]
      : true;

    return matchesName && matchesType && matchesGeneration;
  });


  const customOrder = [
    "fire", "water", "grass", "electric", "ice", "ground", "rock", "steel",
    "flying", "fighting", "bug", "dark", "psychic", "ghost", "normal",
    "poison", "fairy", "dragon"
  ];

  const allTypes = customOrder.filter(type =>
    pokemonList.some(pokemon => pokemon.types.includes(type))
  );

  const generations = ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar", "Paldea"];


  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-4">Pokédex</h1>

      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full sm:w-1/2"
      />

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {allTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`text-white text-xs px-3 py-1 rounded-full font-semibold capitalize 
        ${typeColors[type] || typeColors["unknown"]} 
        ${selectedType === type ? "border-2 border-black" : "border-2 border-transparent"}
        h-8
      `}
          >
            {type}
          </button>
        ))}

        {selectedType && (
          <button
            onClick={() => setSelectedType(null)}
            className="text-xs px-3 py-1 rounded-full font-semibold capitalize bg-gray-300 text-black border-2 border-transparent h-8"
          >
            Clear Filter
          </button>
        )}
      </div>
      {/* Generation buttons */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {generations.map((gen) => (
          <button
            key={gen}
            onClick={() => setSelectedGeneration(gen)}
            className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${selectedGeneration === gen
              ? "bg-blue-500 text-white border-2 border-black"
              : "bg-gray-200 text-black border-2 border-transparent"
              } h-8`}
          >
            {gen}
          </button>
        ))}

        {selectedGeneration && (
          <button
            onClick={() => setSelectedGeneration(null)}
            className="text-xs px-3 py-1 rounded-full font-semibold capitalize bg-gray-300 text-black border-2 border-transparent h-8"
          >
            Clear Filter
          </button>
        )}
      </div>



      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {filteredList.map((pokemon) => (
          <li
            key={pokemon.id}
            className="bg-white rounded-lg shadow p-3 flex flex-col items-center justify-between aspect-square text-sm"
          >
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              className="w-35 h-35 object-contain mb-2"
            />
            <span className="font-medium text-center">
              #{pokemon.id.toString().padStart(4, "0")}<br />
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </span>
            <div className="flex gap-1 mt-2 flex-wrap justify-center">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className={`text-white text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${typeColors[type] || typeColors["unknown"]
                    }`}
                >
                  {type}
                </span>
              ))}
            </div>
          </li>

        ))}
      </ul>

      {filteredList.length === 0 && (
        <p className="text-center mt-8 text-gray-600">No Pokémon found.</p>
      )}
    </main>
  );
}
