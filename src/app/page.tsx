'use client';

import { useEffect, useState } from "react";
import { fetchAllPokemon } from "@/lib/pokeapi";
import { formatPokemonName } from "@/lib/localNameMap";

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

type Pokemon = {
  id: number;
  rawName: string;
  name: string;
  images: {
    official: string;
    home: string;
    sprite: string;
  };
  types: string[];
  abilities: string[];
};

function normalizeString(str: string) {
  return str.toLowerCase().trim();
}

export default function HomePage() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGeneration, setSelectedGeneration] = useState<string | null>(null);
  const [imageStyle, setImageStyle] = useState<'official' | 'home' | 'sprite'>('official');
  const [sortOption, setSortOption] = useState("number-asc");
  const [shinyActive, setShinyActive] = useState<Record<number, boolean>>({});

  function toggleShiny(id: number) {
    setShinyActive(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  useEffect(() => {
    async function loadData() {
      const data = await fetchAllPokemon();
      // Map to ensure images fields are always strings
      const normalizedData = data.map((pokemon: any) => ({
        ...pokemon,
        rawName: pokemon.name,
        name: formatPokemonName(pokemon.name),
        images: {
          official: pokemon.images.official ?? "",
          home: pokemon.images.home ?? "",
          sprite: pokemon.images.sprite ?? "",
        },
      }));
      setPokemonList(normalizedData);
    }
    loadData();
  }, []);

  // Generation ID Ranges
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

  // Filter Pokémon based on search, type, and generation filters
  function normalizeString(str: string) {
    return str.toLowerCase().replace(/[-_]/g, ' ').trim();
  }

  const normalizedSearch = normalizeString(searchTerm);

  const filteredList = pokemonList.filter(pokemon => {
    const matchesName = normalizeString(pokemon.rawName).includes(normalizedSearch);
    const matchesId = pokemon.id.toString().includes(normalizedSearch);
    const matchesAbility = pokemon.abilities.some(ability =>
      normalizeString(ability).includes(normalizedSearch)
    );

    const matchesType = selectedType ? pokemon.types.includes(selectedType) : true;
    const matchesGeneration = selectedGeneration
      ? pokemon.id >= genRanges[selectedGeneration][0] && pokemon.id <= genRanges[selectedGeneration][1]
      : true;

    return (matchesName || matchesId || matchesAbility) && matchesType && matchesGeneration;
  });

  // Apply Sorting
  const sortedList = [...filteredList].sort((a, b) => {
    switch (sortOption) {
      case "number-asc":
        return a.id - b.id;
      case "number-desc":
        return b.id - a.id;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });



  // Custom order for type buttons
  const customOrder = [
    "fire", "water", "grass", "electric", "ice", "ground", "rock", "steel",
    "flying", "fighting", "bug", "dark", "psychic", "ghost", "normal",
    "poison", "fairy", "dragon"
  ];

  // List all types that exist in the loaded Pokémon, ordered by customOrder
  const allTypes = customOrder.filter(type =>
    pokemonList.some(pokemon => pokemon.types.includes(type))
  );

  // List of generations for buttons
  const generations = Object.keys(genRanges);

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-4">Pokédex</h1>

      {/* Search Bar + Sort Dropdown */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <input
          type="text"
          placeholder="Search by name, number or ability..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2"
        />

        <select
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          className="mt-2 sm:mt-0 p-2 border rounded w-full sm:w-auto text-sm"
        >
          <option value="number-asc">Sort by Number (1-1025)</option>
          <option value="number-desc">Sort by Number (1025-1)</option>
          <option value="name-asc">Sort by Name (A-Z)</option>
          <option value="name-desc">Sort by Name (Z-A)</option>
        </select>
      </div>

      {/* Type Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {allTypes.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`
              text-white text-xs px-3 py-1 rounded-full font-semibold capitalize
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

      {/* Generation Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {generations.map(gen => (
          <button
            key={gen}
            onClick={() => setSelectedGeneration(gen)}
            className={`
              text-xs px-3 py-1 rounded-full font-semibold capitalize
              ${selectedGeneration === gen
                ? "bg-blue-500 text-white border-2 border-black"
                : "bg-gray-200 text-black border-2 border-transparent"
              }
              h-8
            `}
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

      {/* Image Style Buttons */}
      <div className="flex justify-end gap-2 mb-4">
        {(['official', 'home', 'sprite'] as const).map(style => (
          <button
            key={style}
            onClick={() => setImageStyle(style)}
            className={`text-sm px-2 py-1 rounded-full ${imageStyle === style ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}
            title={style === 'official' ? "Official Artwork" : style === 'home' ? "Home Sprite" : "Traditional Sprite"}
          >
            {style === 'official' ? '🎨' : style === 'home' ? '🏠' : '🎮'}
          </button>
        ))}
      </div>

      {/* Pokémon List */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {sortedList.map(pokemon => {
          const isShiny = shinyActive[pokemon.id] === true;

          // Determine image URL dynamically
          let imageUrl = pokemon.images[imageStyle];
          if (isShiny && (imageStyle === 'home' || imageStyle === 'sprite')) {
            if (imageStyle === 'home') {
              imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemon.id}.png`;
            } else if (imageStyle === 'sprite') {
              imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.id}.png`;
            }
          }

          return (
            <li
              key={pokemon.id}
              className="bg-white rounded-lg shadow p-3 flex flex-col items-center justify-between aspect-square text-sm relative"
            >
              {(imageStyle === 'home' || imageStyle === 'sprite') && (
                <button
                  onClick={() => toggleShiny(pokemon.id)}
                  className="absolute top-2 left-2 w-6 h-6 text-yellow-400 hover:text-yellow-300"
                  title="Toggle Shiny"
                  aria-label={`Toggle shiny for ${pokemon.name}`}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`w-4 h-4 ${isShiny ? 'text-yellow-400' : 'text-gray-400'}`}
                  >
                    <polygon points="12 2 15 9 22 9 16.5 13.5 18.5 21 12 16.5 5.5 21 7.5 13.5 2 9 9 9 12 2" />
                  </svg>
                </button>
              )}

              <img
                src={imageUrl}
                alt={pokemon.name}
                className="w-35 h-35 object-contain mb-2"
              />
              <span className="font-medium text-center">
                #{pokemon.id.toString().padStart(4, "0")}<br />
                {pokemon.name}
              </span>

              <span className="text-s text-gray-500 text-center mt-1 italic">
                {pokemon.abilities
                  .map(ability =>
                    ability
                      .split("-")
                      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                      .join(" ")
                  )
                  .join(" / ")}
              </span>

              <div className="flex gap-1 mt-2 flex-wrap justify-center">
                {pokemon.types.map(type => (
                  <span
                    key={type}
                    className={`text-white text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${typeColors[type] || typeColors["unknown"]}`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      {filteredList.length === 0 && (
        <p className="text-center mt-8 text-gray-600">No Pokémon found.</p>
      )}
    </main>
  );
}