'use client';

import { useEffect, useState } from "react";
import React, { useRef } from "react";
import { fetchAllPokemon } from "@/lib/pokeapi";
import { formatPokemonName } from "@/lib/localNameMap";
import SearchBar from "@/components/SearchBar";
import { Pokemon } from "./types/Pokemon";
import { regionalForms } from "./types/RegionalForms";
import PokemonTabs, { PokemonTabsHandle } from "@/components/PokemonTabs";
import { megaEvolutions } from "./types/MegaEvolutions";
import PokemonCard from "@/components/PokemonCard";
import ImageStyleSelector from "@/components/ImageStyleSelector";
import AlternateForms from "@/components/AlternateForms";
import { alternateForms } from "./types/AlternateForms";
import PokemonList from "@/components/PokemonList";

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

function normalizeString(str: string) {
  return str.toLowerCase().trim();
}

export default function HomePage() {
  // Constants and State Variables
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGeneration, setSelectedGeneration] = useState<string | null>("Kanto");
  const [imageStyle, setImageStyle] = useState<'official' | 'home' | 'sprite'>('home');
  const [sortOption, setSortOption] = useState("number-asc");
  const [shinyActive, setShinyActive] = useState<Record<number, boolean>>({});
  const [regionalFormActive, setRegionalFormActive] = useState<{ [pokemonId: number]: string | null }>({});
  const [regionalAbilities, setRegionalAbilities] = useState<Record<number, string[]>>({});
  const tabsRef = useRef<PokemonTabsHandle>(null);
  const [megaActive, setMegaActive] = useState<{ [pokemonId: number]: boolean }>({});
  const [megaFormActive, setMegaFormActive] = useState<{ [pokemonId: number]: string | null }>({});
  const [darkMode, setDarkMode] = useState(false);
  const [specialFormActive, setSpecialFormActive] = useState<{ [pokemonId: number]: string | null }>({});
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


  function toggleShiny(id: number) {
    setShinyActive(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function toggleRegionalForm(pokemonId: number) {
    setRegionalFormActive(prev => ({
      ...prev,
      [pokemonId]: prev[pokemonId] ? null : "active",
    }));
  }

  async function fetchRegionalAbilities(pokedexId: number) {
    if (regionalAbilities[pokedexId]) return; // Already cached
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokedexId}`);
      if (!res.ok) {
        setRegionalAbilities(prev => ({ ...prev, [pokedexId]: ["unknown"] }));
        return;
      }
      const data = await res.json();
      const abilities = data.abilities.map((a: any) => a.ability.name);
      setRegionalAbilities(prev => ({ ...prev, [pokedexId]: abilities }));
    } catch {
      setRegionalAbilities(prev => ({ ...prev, [pokedexId]: ["unknown"] }));
    }
  }

  useEffect(() => {
    // For each active regional form, fetch abilities if not already cached
    Object.entries(regionalFormActive).forEach(([pokemonId, activeKey]) => {
      if (activeKey) {
        const basePokemon = pokemonList.find(p => p.id === Number(pokemonId));
        if (!basePokemon) return;

        // Special handling for Meowth's forms
        if (basePokemon.rawName === "meowth") {
          if (activeKey === "alola" && regionalForms["meowth"] && !regionalAbilities[regionalForms["meowth"].pokedexId]) {
            fetchRegionalAbilities(regionalForms["meowth"].pokedexId);
          } else if (activeKey === "galar" && regionalForms["meowth_galar"] && !regionalAbilities[regionalForms["meowth_galar"].pokedexId]) {
            fetchRegionalAbilities(regionalForms["meowth_galar"].pokedexId);
          }
        } else {
          const regionalFormData = regionalForms[basePokemon.rawName as keyof typeof regionalForms];
          if (regionalFormData && !regionalAbilities[regionalFormData.pokedexId]) {
            fetchRegionalAbilities(regionalFormData.pokedexId);
          }
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionalFormActive, pokemonList]);

  useEffect(() => {
    // For each active Mega, fetch abilities if not already cached
    Object.entries(megaActive).forEach(([pokemonId, isActive]) => {
      if (isActive) {
        const basePokemon = pokemonList.find(p => p.id === Number(pokemonId));
        if (!basePokemon) return;
        const megaData = megaEvolutions[basePokemon.rawName];
        if (megaData && !regionalAbilities[megaData.pokedexId]) {
          fetchRegionalAbilities(megaData.pokedexId);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [megaActive, pokemonList]);

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

  useEffect(() => {
    Object.entries(megaFormActive).forEach(([pokemonId, form]) => {
      const basePokemon = pokemonList.find(p => p.id === Number(pokemonId));
      if (!basePokemon) return;

      if (basePokemon.rawName === "charizard") {
        if (form === "x" && megaEvolutions["charizard"] && !regionalAbilities[megaEvolutions["charizard"].pokedexId]) {
          fetchRegionalAbilities(megaEvolutions["charizard"].pokedexId);
        } else if (form === "y" && megaEvolutions["charizardY"] && !regionalAbilities[megaEvolutions["charizardY"].pokedexId]) {
          fetchRegionalAbilities(megaEvolutions["charizardY"].pokedexId);
        }
      } else if (basePokemon.rawName === "mewtwo") {
        if (form === "x" && megaEvolutions["mewtwo"] && !regionalAbilities[megaEvolutions["mewtwo"].pokedexId]) {
          fetchRegionalAbilities(megaEvolutions["mewtwo"].pokedexId);
        } else if (form === "y" && megaEvolutions["mewtwoY"] && !regionalAbilities[megaEvolutions["mewtwoY"].pokedexId]) {
          fetchRegionalAbilities(megaEvolutions["mewtwoY"].pokedexId);
        } else if (form === "y" && megaEvolutions["mewtwo"] && !regionalAbilities[megaEvolutions["mewtwo"].pokedexId + 1]) {
          // fallback for Mega Mewtwo Y if not in megaEvolutions
          fetchRegionalAbilities(megaEvolutions["mewtwo"].pokedexId + 1);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [megaFormActive, pokemonList]);

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("pokedex-dark-mode");
    if (saved === "true") setDarkMode(true);
    if (saved === "false") setDarkMode(false);
  }, []);
  // Save dark mode preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("pokedex-dark-mode", darkMode ? "true" : "false");
  }, [darkMode]);


  // Filter Pokémon based on search, type, and generation filters
  function normalizeString(str: string) {
    return str.toLowerCase().replace(/[-_]/g, ' ').trim();
  }

  const normalizedSearch = normalizeString(searchTerm);

  function getDisplayTypes(pokemon: Pokemon): string[] {
    if (pokemon.rawName === "charizard" && megaFormActive[pokemon.id] === "x" && megaEvolutions["charizard"]) {
      return megaEvolutions["charizard"].types;
    }
    if (pokemon.rawName === "charizard" && megaFormActive[pokemon.id] === "y" && megaEvolutions["charizardY"]) {
      return megaEvolutions["charizardY"].types;
    }
    if (pokemon.rawName === "mewtwo" && megaFormActive[pokemon.id] === "x" && megaEvolutions["mewtwo"]) {
      return megaEvolutions["mewtwo"].types;
    }
    if (pokemon.rawName === "mewtwo" && megaFormActive[pokemon.id] === "y" && megaEvolutions["mewtwoY"]) {
      return megaEvolutions["mewtwoY"].types;
    }
    if (pokemon.rawName === "slowbro" && megaActive[pokemon.id] && megaEvolutions["slowbro"]) {
      return megaEvolutions["slowbro"].types;
    }
    if (pokemon.rawName === "slowbro" && regionalFormActive[pokemon.id] === "galar" && regionalForms["slowbro"]) {
      return regionalForms["slowbro"].types;
    }
    if (megaActive[pokemon.id] && megaEvolutions[pokemon.rawName]) {
      return megaEvolutions[pokemon.rawName].types;
    }
    if (pokemon.rawName === "meowth" && regionalFormActive[pokemon.id] === "alola" && regionalForms["meowth"]) {
      return regionalForms["meowth"].types;
    }
    if (pokemon.rawName === "meowth" && regionalFormActive[pokemon.id] === "galar" && regionalForms["meowth_galar"]) {
      return regionalForms["meowth_galar"].types;
    }
    if (regionalFormActive[pokemon.id] && regionalForms[pokemon.rawName as keyof typeof regionalForms]) {
      return regionalForms[pokemon.rawName as keyof typeof regionalForms].types;
    }
    return pokemon.types;
  }

  const filteredList = pokemonList.filter(pokemon => {
    const matchesName = normalizeString(pokemon.rawName).includes(normalizedSearch);
    const matchesId = pokemon.id.toString().includes(normalizedSearch);
    const matchesAbility = pokemon.abilities.some(ability =>
      normalizeString(ability.name).includes(normalizedSearch)
    );
    const matchesType = selectedType ? getDisplayTypes(pokemon).includes(selectedType) : true;
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
    <main className={`p-4 min-h-screen transition-colors duration-300 ${darkMode ? "bg-[#23272f]" : "bg-white"}`}>
      <div className="flex items-center justify-between mb-4">
        <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-black"}`}>Pokédex</h1>
        <button
          onClick={() => setDarkMode(d => !d)}
          className="px-3 py-1 rounded-full border border-gray-400 bg-gray-200 dark:bg-[#23272f] dark:text-white text-black transition"
          aria-label="Toggle dark mode"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Search Bar + Sort Dropdown */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
        darkMode={darkMode}
      />


      {/* Type Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {allTypes.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`
              flex items-center justify-center
              rounded-full
              ${selectedType === type ? "border-2 border-black" : "border-2 border-transparent"}
              h-15 w-15 p-1
              transition
              focus:outline-none
            `}
            title={type.charAt(0).toUpperCase() + type.slice(1)}
            aria-label={type}
          >
            <img
              src={`/type icons/${type}.svg`}
              alt={type}
              className="w-15 h-15"
              draggable={false}
            />
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
      <ImageStyleSelector
        imageStyle={imageStyle}
        setImageStyle={setImageStyle}
        darkMode={darkMode}
      />

      {/* Pokémon List */}
      <PokemonList
        sortedList={sortedList}
        shinyActive={shinyActive}
        toggleShiny={toggleShiny}
        regionalForms={regionalForms}
        regionalFormActive={regionalFormActive}
        megaActive={megaActive}
        megaFormActive={megaFormActive}
        setMegaActive={setMegaActive}
        setMegaFormActive={setMegaFormActive}
        setRegionalFormActive={setRegionalFormActive}
        specialFormActive={specialFormActive}
        setSpecialFormActive={setSpecialFormActive}
        regionalAbilities={regionalAbilities}
        typeColors={typeColors}
        imageStyle={imageStyle}
        alternateForms={alternateForms}
        megaEvolutions={megaEvolutions}
        tabsRef={tabsRef}
        darkMode={darkMode}
      />

      {filteredList.length === 0 && (
        <p className="text-center mt-8 text-gray-600">No Pokémon found.</p>
      )}

      <PokemonTabs ref={tabsRef} darkMode={darkMode} />

    </main>
  );
}