'use client';

import { useEffect, useState } from "react";
import React, { useRef } from "react";
import { fetchAllPokemon } from "@/lib/pokeapi";
import { formatPokemonName } from "@/lib/localNameMap";
import SearchBar from "@/components/SearchBar";
import PokemonInfoPanel from "@/components/PokemonInfoPanel";
import { Pokemon } from "./types/Pokemon";
import { regionalForms } from "./types/RegionalForms";
import PokemonTabs, { PokemonTabsHandle } from "@/components/PokemonTabs";
import { megaEvolutions } from "./types/MegaEvolutions";
import PokemonCard from "@/components/PokemonCard";
import ImageStyleSelector from "@/components/ImageStyleSelector";
import AlternateForms from "@/components/AlternateForms";
import { alternateForms } from "./types/AlternateForms";

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
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {sortedList.map(pokemon => {
          const isShiny = shinyActive[pokemon.id] === true;

          // Check if this Pokémon has a regional form
          const hasRegionalForm = regionalForms.hasOwnProperty(pokemon.rawName);
          const isRegionalActive = regionalFormActive[pokemon.id] !== null && regionalFormActive[pokemon.id] !== undefined;

          const basePokemon = pokemon;
          const regionalFormData = regionalForms[pokemon.rawName as keyof typeof regionalForms];

          // Determine which form data to use
          let displayPokemonId = basePokemon.id;
          let displayName = basePokemon.name;
          let displayTypes = basePokemon.types;

          // Mega Evolution takes priority
          // Charizard
          if (basePokemon.rawName === "charizard") {
            if (megaFormActive[basePokemon.id] === "x" && megaEvolutions["charizard"]) {
              displayPokemonId = megaEvolutions["charizard"].pokedexId;
              displayName = `${basePokemon.name} (Mega X)`;
              displayTypes = megaEvolutions["charizard"].types;
            } else if (megaFormActive[basePokemon.id] === "y" && megaEvolutions["charizardY"]) {
              displayPokemonId = megaEvolutions["charizardY"].pokedexId;
              displayName = `${basePokemon.name} (Mega Y)`;
              displayTypes = megaEvolutions["charizardY"].types;
            }
          } else if (basePokemon.rawName === "mewtwo") {
            if (megaFormActive[basePokemon.id] === "x" && megaEvolutions["mewtwo"]) {
              displayPokemonId = megaEvolutions["mewtwo"].pokedexId;
              displayName = `${basePokemon.name} (Mega X)`;
              displayTypes = megaEvolutions["mewtwo"].types;
            } else if (megaFormActive[basePokemon.id] === "y" && megaEvolutions["mewtwoY"]) {
              displayPokemonId = megaEvolutions["mewtwoY"].pokedexId;
              displayName = `${basePokemon.name} (Mega Y)`;
              displayTypes = megaEvolutions["mewtwoY"].types;
            }
          } else if (basePokemon.rawName === "slowbro") {
            if (megaActive[basePokemon.id] && megaEvolutions["slowbro"]) {
              displayPokemonId = megaEvolutions["slowbro"].pokedexId;
              displayName = `${basePokemon.name} (Mega)`;
              displayTypes = megaEvolutions["slowbro"].types;
            } else if (regionalFormActive[basePokemon.id] === "galar" && regionalForms["slowbro"]) {
              displayPokemonId = regionalForms["slowbro"].pokedexId;
              displayName = `${basePokemon.name} (Galarian)`;
              displayTypes = regionalForms["slowbro"].types;
            }
          } else if (megaActive[basePokemon.id] && megaEvolutions[basePokemon.rawName]) {
            const megaData = megaEvolutions[basePokemon.rawName];
            displayPokemonId = megaData.pokedexId;
            displayName = `${basePokemon.name} (${megaData.formName})`;
            displayTypes = megaData.types;
          } else if (basePokemon.rawName === "meowth") {
            if (regionalFormActive[basePokemon.id] === "alola" && regionalForms["meowth"]) {
              displayPokemonId = regionalForms["meowth"].pokedexId;
              displayName = `${basePokemon.name} (Alolan)`;
              displayTypes = regionalForms["meowth"].types;
            } else if (regionalFormActive[basePokemon.id] === "galar" && regionalForms["meowth_galar"]) {
              displayPokemonId = regionalForms["meowth_galar"].pokedexId;
              displayName = `${basePokemon.name} (Galarian)`;
              displayTypes = regionalForms["meowth_galar"].types;
            }
          } else if (isRegionalActive && regionalFormData) {
            displayPokemonId = regionalFormData.pokedexId;
            displayName = `${basePokemon.name} (${regionalFormData.formName})`;
            displayTypes = regionalFormData.types;
          }

          if (basePokemon.rawName === "meowth") {
            if (regionalFormActive[basePokemon.id] === "alola" && regionalForms["meowth"]) {
              displayPokemonId = regionalForms["meowth"].pokedexId;
              displayName = `${basePokemon.name} (Alolan)`;
              displayTypes = regionalForms["meowth"].types;
            } else if (regionalFormActive[basePokemon.id] === "galar" && regionalForms["meowth_galar"]) {
              displayPokemonId = regionalForms["meowth_galar"].pokedexId;
              displayName = `${basePokemon.name} (Galarian)`;
              displayTypes = regionalForms["meowth_galar"].types;
            }
          } else if (isRegionalActive && regionalFormData) {
            displayPokemonId = regionalFormData.pokedexId;
            displayName = `${basePokemon.name} (${regionalFormData.formName})`;
            displayTypes = regionalFormData.types;
          }
          
          // Origin Form for Dialga, Palkia, Giratina
          let formSuffix = "";
          const altFormData = alternateForms[basePokemon.rawName]?.forms.find(
            f =>
              (specialFormActive[basePokemon.id] === "origin" && f.formName === "Origin") ||
              (!specialFormActive[basePokemon.id] && f.formName === "Normal")
          );

          if (altFormData) {
            displayPokemonId = altFormData.pokedexId ?? displayPokemonId;
            displayName = `${basePokemon.name}${altFormData.formName && altFormData.formName !== "Normal" ? ` (${altFormData.formName})` : ""}`;
            displayTypes = altFormData.types ?? displayTypes;
            formSuffix = altFormData.formSuffix ?? "";
          }

          let displayAbilities = basePokemon.abilities.map(a => a.name);

          // Mega Evolution takes priority (Charizard & Mewtwo multi-form support)
          if (basePokemon.rawName === "charizard") {
            if (
              megaFormActive[basePokemon.id] === "x" &&
              megaEvolutions["charizard"] &&
              regionalAbilities[megaEvolutions["charizard"].pokedexId]
            ) {
              displayAbilities = regionalAbilities[megaEvolutions["charizard"].pokedexId];
            } else if (
              megaFormActive[basePokemon.id] === "y" &&
              megaEvolutions["charizardY"] &&
              regionalAbilities[megaEvolutions["charizardY"].pokedexId]
            ) {
              displayAbilities = regionalAbilities[megaEvolutions["charizardY"].pokedexId];
            }
          } else if (basePokemon.rawName === "mewtwo") {
            if (
              megaFormActive[basePokemon.id] === "x" &&
              megaEvolutions["mewtwo"] &&
              regionalAbilities[megaEvolutions["mewtwo"].pokedexId]
            ) {
              displayAbilities = regionalAbilities[megaEvolutions["mewtwo"].pokedexId];
            } else if (
              megaFormActive[basePokemon.id] === "y" &&
              megaEvolutions["mewtwoY"] &&
              regionalAbilities[megaEvolutions["mewtwoY"].pokedexId]
            ) {
              displayAbilities = regionalAbilities[megaEvolutions["mewtwoY"].pokedexId];
            } else if (
              megaFormActive[basePokemon.id] === "y" &&
              megaEvolutions["mewtwo"] &&
              regionalAbilities[megaEvolutions["mewtwo"].pokedexId + 1]
            ) {
              // fallback: try pokedexId + 1 for Mega Mewtwo Y
              displayAbilities = regionalAbilities[megaEvolutions["mewtwo"].pokedexId + 1];
            }

          } else if (
            megaActive[basePokemon.id] &&
            megaEvolutions[basePokemon.rawName] &&
            regionalAbilities[megaEvolutions[basePokemon.rawName].pokedexId]
          ) {
            displayAbilities = regionalAbilities[megaEvolutions[basePokemon.rawName].pokedexId];
          } else if (basePokemon.rawName === "meowth") {
            if (
              regionalFormActive[basePokemon.id] === "alola" &&
              regionalForms["meowth"] &&
              regionalAbilities[regionalForms["meowth"].pokedexId]
            ) {
              displayAbilities = regionalAbilities[regionalForms["meowth"].pokedexId];
            } else if (
              regionalFormActive[basePokemon.id] === "galar" &&
              regionalForms["meowth_galar"] &&
              regionalAbilities[regionalForms["meowth_galar"].pokedexId]
            ) {
              displayAbilities = regionalAbilities[regionalForms["meowth_galar"].pokedexId];
            }
          } else if (
            isRegionalActive &&
            regionalFormData &&
            regionalAbilities[regionalFormData.pokedexId]
          ) {
            displayAbilities = regionalAbilities[regionalFormData.pokedexId];
          }


          // Determine image URL dynamically based on selected form and shiny status
          let imageUrl = "";
          if (isShiny) {
            if (basePokemon.rawName === "charizard") {
              if (megaFormActive[basePokemon.id] === "x" && megaEvolutions["charizard"]) {
                if (imageStyle === 'official') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${megaEvolutions["charizard"].pokedexId}.png`;
                } else if (imageStyle === 'home') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${megaEvolutions["charizard"].pokedexId}.png`;
                } else if (imageStyle === 'sprite') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${megaEvolutions["charizard"].pokedexId}.png`;
                }
              } else if (megaFormActive[basePokemon.id] === "y" && megaEvolutions["charizardY"]) {
                if (imageStyle === 'official') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${megaEvolutions["charizardY"].pokedexId}.png`;
                } else if (imageStyle === 'home') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${megaEvolutions["charizardY"].pokedexId}.png`;
                } else if (imageStyle === 'sprite') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${megaEvolutions["charizardY"].pokedexId}.png`;
                }
              } else {
                // fallback to normal shiny
                if (imageStyle === 'official') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${displayPokemonId}.png`;
                } else if (imageStyle === 'home') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${displayPokemonId}.png`;
                } else if (imageStyle === 'sprite') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${displayPokemonId}.png`;
                }
              }
            } else if (basePokemon.rawName === "mewtwo") {
              if (megaFormActive[basePokemon.id] === "x" && megaEvolutions["mewtwo"]) {
                if (imageStyle === 'official') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${megaEvolutions["mewtwo"].pokedexId}.png`;
                } else if (imageStyle === 'home') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${megaEvolutions["mewtwo"].pokedexId}.png`;
                } else if (imageStyle === 'sprite') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${megaEvolutions["mewtwo"].pokedexId}.png`;
                }
              } else if (megaFormActive[basePokemon.id] === "y" && megaEvolutions["mewtwoY"]) {
                if (imageStyle === 'official') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${megaEvolutions["mewtwoY"].pokedexId}.png`;
                } else if (imageStyle === 'home') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${megaEvolutions["mewtwoY"].pokedexId}.png`;
                } else if (imageStyle === 'sprite') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${megaEvolutions["mewtwoY"].pokedexId}.png`;
                }
              } else if (megaFormActive[basePokemon.id] === "y" && megaEvolutions["mewtwo"]) {
                // fallback: try pokedexId + 1
                const fallbackId = megaEvolutions["mewtwo"].pokedexId + 1;
                if (imageStyle === 'official') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${fallbackId}.png`;
                } else if (imageStyle === 'home') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${fallbackId}.png`;
                } else if (imageStyle === 'sprite') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${fallbackId}.png`;
                }
              } else {
                // fallback to normal shiny
                if (imageStyle === 'official') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${displayPokemonId}.png`;
                } else if (imageStyle === 'home') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${displayPokemonId}.png`;
                } else if (imageStyle === 'sprite') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${displayPokemonId}.png`;
                }
              }
            } else {
              // fallback for all other Pokémon
              if (imageStyle === 'official') {
                imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${displayPokemonId}.png`;
              } else if (imageStyle === 'home') {
                imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${displayPokemonId}.png`;
              } else if (imageStyle === 'sprite') {
                imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${displayPokemonId}.png`;
              }
            }
          } else {
            // Not shiny
            if (basePokemon.rawName === "charizard") {
              if (megaFormActive[basePokemon.id] === "x" && megaEvolutions["charizard"]) {
                if (imageStyle === 'official') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${megaEvolutions["charizard"].pokedexId}.png`;
                } else if (imageStyle === 'home') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${megaEvolutions["charizard"].pokedexId}.png`;
                } else if (imageStyle === 'sprite') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${megaEvolutions["charizard"].pokedexId}.png`;
                }
              } else if (megaFormActive[basePokemon.id] === "y" && megaEvolutions["charizardY"]) {
                if (imageStyle === 'official') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${megaEvolutions["charizardY"].pokedexId}.png`;
                } else if (imageStyle === 'home') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${megaEvolutions["charizardY"].pokedexId}.png`;
                } else if (imageStyle === 'sprite') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${megaEvolutions["charizardY"].pokedexId}.png`;
                }
              } else {
                // fallback to normal
                if (imageStyle === 'official') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${displayPokemonId}.png`;
                } else if (imageStyle === 'home') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${displayPokemonId}.png`;
                } else if (imageStyle === 'sprite') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${displayPokemonId}.png`;
                }
              }
            } else if (basePokemon.rawName === "mewtwo") {
              if (megaFormActive[basePokemon.id] === "x" && megaEvolutions["mewtwo"]) {
                if (imageStyle === 'official') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${megaEvolutions["mewtwo"].pokedexId}.png`;
                } else if (imageStyle === 'home') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${megaEvolutions["mewtwo"].pokedexId}.png`;
                } else if (imageStyle === 'sprite') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${megaEvolutions["mewtwo"].pokedexId}.png`;
                }
              } else if (megaFormActive[basePokemon.id] === "y" && megaEvolutions["mewtwoY"]) {
                if (imageStyle === 'official') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${megaEvolutions["mewtwoY"].pokedexId}.png`;
                } else if (imageStyle === 'home') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${megaEvolutions["mewtwoY"].pokedexId}.png`;
                } else if (imageStyle === 'sprite') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${megaEvolutions["mewtwoY"].pokedexId}.png`;
                }
              } else if (megaFormActive[basePokemon.id] === "y" && megaEvolutions["mewtwo"]) {
                // fallback: try pokedexId + 1
                const fallbackId = megaEvolutions["mewtwo"].pokedexId + 1;
                if (imageStyle === 'official') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${fallbackId}.png`;
                } else if (imageStyle === 'home') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${fallbackId}.png`;
                } else if (imageStyle === 'sprite') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${fallbackId}.png`;
                }
              } else {
                // fallback to normal
                if (imageStyle === 'official') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${displayPokemonId}.png`;
                } else if (imageStyle === 'home') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${displayPokemonId}.png`;
                } else if (imageStyle === 'sprite') {
                  imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${displayPokemonId}.png`;
                }
              }
            } else if (megaActive[basePokemon.id] && megaEvolutions[basePokemon.rawName]) {
              if (imageStyle === 'official') {
                imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${displayPokemonId}.png`;
              } else if (imageStyle === 'home') {
                imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${displayPokemonId}.png`;
              } else if (imageStyle === 'sprite') {
                imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${displayPokemonId}.png`;
              }
            } else if (isRegionalActive && regionalFormData) {
              if (imageStyle === 'official') {
                imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${displayPokemonId}.png`;
              } else if (imageStyle === 'home') {
                imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${displayPokemonId}.png`;
              } else if (imageStyle === 'sprite') {
                imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${displayPokemonId}.png`;
              }
            } else {
              imageUrl = basePokemon.images[imageStyle] ?? "";
            }
          }
          if (["dialga", "palkia", "giratina-altered"].includes(basePokemon.rawName)) {
            if (isShiny) {
              if (imageStyle === 'official') {
                imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${displayPokemonId}${formSuffix}.png`;
              } else if (imageStyle === 'home') {
                imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${displayPokemonId}${formSuffix}.png`;
              } else if (imageStyle === 'sprite') {
                imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${displayPokemonId}${formSuffix}.png`;
              }
            } else {
              if (imageStyle === 'official') {
                imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${displayPokemonId}${formSuffix}.png`;
              } else if (imageStyle === 'home') {
                imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${displayPokemonId}${formSuffix}.png`;
              } else if (imageStyle === 'sprite') {
                imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${displayPokemonId}${formSuffix}.png`;
              }
            }
          }
          return (
            <PokemonCard key={pokemon.id} imageUrl={imageUrl} displayName={displayName}>
              {/* Shiny toggle button */}
              {(imageStyle === 'official' || imageStyle === 'home' || imageStyle === 'sprite') && (
                <button
                  onClick={() => toggleShiny(pokemon.id)}
                  className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center group"
                  title="Toggle Shiny"
                  aria-label={`Toggle shiny for ${basePokemon.name}`}
                  type="button"
                  style={{ background: "transparent", border: "none", padding: 0 }}
                >
                  <img
                    src="/artwork/shiny-sparkle.png"
                    alt="Shiny"
                    className={`w-5 h-5 transition duration-200 select-none
                      ${isShiny
                        ? "brightness-150 drop-shadow-[0_0_6px_#fff700] drop-shadow-[0_0_12px_#fff700]"
                        : "brightness-0"}
                      group-hover:brightness-150 group-hover:drop-shadow-[0_0_6px_#fff700] group-hover:drop-shadow-[0_0_12px_#fff700] group-hover:scale-110
                    `}
                    draggable={false}
                  />
                </button>
              )}

              <AlternateForms
                pokemon={basePokemon}
                megaActive={megaActive}
                setMegaActive={setMegaActive}
                megaFormActive={megaFormActive}
                setMegaFormActive={setMegaFormActive}
                regionalFormActive={regionalFormActive}
                setRegionalFormActive={setRegionalFormActive}
                specialFormActive={specialFormActive}
                setSpecialFormActive={setSpecialFormActive}
              />

              <button
                onClick={async () => {
                  let pokemonToOpen = pokemon;

                  // --- MEGA SLOWBRO HANDLER ---
                  if (
                    basePokemon.rawName === "slowbro" &&
                    megaActive[basePokemon.id] &&
                    megaEvolutions["slowbro"]
                  ) {
                    try {
                      const megaData = megaEvolutions["slowbro"];
                      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${megaData.pokedexId}`);
                      if (!res.ok) {
                        alert("Mega Slowbro data not found in PokéAPI.");
                        return;
                      }
                      const data = await res.json();
                      pokemonToOpen = {
                        id: data.id,
                        rawName: data.name,
                        name: `${basePokemon.name} (Mega)`,
                        types: data.types.map((t: any) => t.type.name),
                        abilities: data.abilities.map((a: any) => ({
                          name: a.ability.name,
                          description: "",
                        })),
                        images: {
                          official: data.sprites.other?.['official-artwork']?.front_default ?? "",
                          home: data.sprites.other?.['home']?.front_default ?? "",
                          sprite: data.sprites.front_default ?? "",
                        },
                        stats: data.stats.map((s: any) => ({
                          name: s.stat.name,
                          base_stat: s.base_stat,
                        })),
                        moves: data.moves.flatMap((m: any) =>
                          m.version_group_details
                            .filter((v: any) => v.move_learn_method.name === "level-up")
                            .map((v: any) => ({
                              name: m.move.name,
                              move_learn_method: v.move_learn_method.name,
                              level_learned_at: v.level_learned_at,
                            }))
                        ),
                        height: data.height,
                        weight: data.weight,
                        baseSpeciesId: basePokemon.id,
                        basePokedexId: basePokemon.id,
                      };
                    } catch (e) {
                      alert("Failed to load Mega Slowbro data.");
                      return;
                    }
                  }

                  // --- MEGA CHARIZARD X/Y HANDLER ---
                  else if (
                    basePokemon.rawName === "charizard" &&
                    megaFormActive[basePokemon.id] &&
                    (megaFormActive[basePokemon.id] === "x" || megaFormActive[basePokemon.id] === "y")
                  ) {
                    const formKey = megaFormActive[basePokemon.id] === "x" ? "charizard" : "charizardY";
                    const formLabel = megaFormActive[basePokemon.id] === "x" ? "Mega X" : "Mega Y";
                    const megaData = megaEvolutions[formKey];
                    if (megaData) {
                      try {
                        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${megaData.pokedexId}`);
                        if (!res.ok) {
                          alert(`Mega Charizard ${formLabel} data not found in PokéAPI.`);
                          return;
                        }
                        const data = await res.json();
                        pokemonToOpen = {
                          id: data.id,
                          rawName: data.name,
                          name: `${basePokemon.name} (${formLabel})`,
                          types: data.types.map((t: any) => t.type.name),
                          abilities: data.abilities.map((a: any) => ({
                            name: a.ability.name,
                            description: "",
                          })),
                          images: {
                            official: data.sprites.other?.['official-artwork']?.front_default ?? "",
                            home: data.sprites.other?.['home']?.front_default ?? "",
                            sprite: data.sprites.front_default ?? "",
                          },
                          stats: data.stats.map((s: any) => ({
                            name: s.stat.name,
                            base_stat: s.base_stat,
                          })),
                          moves: data.moves.flatMap((m: any) =>
                            m.version_group_details
                              .filter((v: any) => v.move_learn_method.name === "level-up")
                              .map((v: any) => ({
                                name: m.move.name,
                                move_learn_method: v.move_learn_method.name,
                                level_learned_at: v.level_learned_at,
                              }))
                          ),
                          height: data.height,
                          weight: data.weight,
                          baseSpeciesId: basePokemon.id,
                          basePokedexId: basePokemon.id,
                        };
                      } catch (e) {
                        alert(`Failed to load Mega Charizard ${formLabel} data.`);
                        return;
                      }
                    }
                  }

                  // --- MEGA MEWTWO X/Y HANDLER ---
                  else if (
                    basePokemon.rawName === "mewtwo" &&
                    megaFormActive[basePokemon.id] &&
                    (megaFormActive[basePokemon.id] === "x" || megaFormActive[basePokemon.id] === "y")
                  ) {
                    let formKey = megaFormActive[basePokemon.id] === "x" ? "mewtwo" : "mewtwoY";
                    let formLabel = megaFormActive[basePokemon.id] === "x" ? "Mega X" : "Mega Y";
                    let megaData = megaEvolutions[formKey];

                    // fallback for Mega Y if not present in megaEvolutions
                    if (megaFormActive[basePokemon.id] === "y" && !megaData && megaEvolutions["mewtwo"]) {
                      megaData = { ...megaEvolutions["mewtwo"], pokedexId: megaEvolutions["mewtwo"].pokedexId + 1 };
                    }

                    if (megaData) {
                      try {
                        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${megaData.pokedexId}`);
                        if (!res.ok) {
                          alert(`Mega Mewtwo ${formLabel} data not found in PokéAPI.`);
                          return;
                        }
                        const data = await res.json();
                        pokemonToOpen = {
                          id: data.id,
                          rawName: data.name,
                          name: `${basePokemon.name} (${formLabel})`,
                          types: data.types.map((t: any) => t.type.name),
                          abilities: data.abilities.map((a: any) => ({
                            name: a.ability.name,
                            description: "",
                          })),
                          images: {
                            official: data.sprites.other?.['official-artwork']?.front_default ?? "",
                            home: data.sprites.other?.['home']?.front_default ?? "",
                            sprite: data.sprites.front_default ?? "",
                          },
                          stats: data.stats.map((s: any) => ({
                            name: s.stat.name,
                            base_stat: s.base_stat,
                          })),
                          moves: data.moves.flatMap((m: any) =>
                            m.version_group_details
                              .filter((v: any) => v.move_learn_method.name === "level-up")
                              .map((v: any) => ({
                                name: m.move.name,
                                move_learn_method: v.move_learn_method.name,
                                level_learned_at: v.level_learned_at,
                              }))
                          ),
                          height: data.height,
                          weight: data.weight,
                          baseSpeciesId: basePokemon.id,
                          basePokedexId: basePokemon.id,
                        };
                      } catch (e) {
                        alert(`Failed to load Mega Mewtwo ${formLabel} data.`);
                        return;
                      }
                    }
                  }

                  // --- GENERIC MEGA HANDLER ---
                  else if (
                    megaActive[basePokemon.id] &&
                    megaEvolutions[basePokemon.rawName]
                  ) {
                    const megaData = megaEvolutions[basePokemon.rawName];
                    try {
                      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${megaData.pokedexId}`);
                      if (!res.ok) {
                        alert(`Mega ${basePokemon.name} data not found in PokéAPI.`);
                        return;
                      }
                      const data = await res.json();
                      pokemonToOpen = {
                        id: data.id,
                        rawName: data.name,
                        name: `${basePokemon.name} (${megaData.formName})`,
                        types: data.types.map((t: any) => t.type.name),
                        abilities: data.abilities.map((a: any) => ({
                          name: a.ability.name,
                          description: "",
                        })),
                        images: {
                          official: data.sprites.other?.['official-artwork']?.front_default ?? "",
                          home: data.sprites.other?.['home']?.front_default ?? "",
                          sprite: data.sprites.front_default ?? "",
                        },
                        stats: data.stats.map((s: any) => ({
                          name: s.stat.name,
                          base_stat: s.base_stat,
                        })),
                        moves: data.moves.flatMap((m: any) =>
                          m.version_group_details
                            .filter((v: any) => v.move_learn_method.name === "level-up")
                            .map((v: any) => ({
                              name: m.move.name,
                              move_learn_method: v.move_learn_method.name,
                              level_learned_at: v.level_learned_at,
                            }))
                        ),
                        height: data.height,
                        weight: data.weight,
                        baseSpeciesId: basePokemon.id,
                        basePokedexId: basePokemon.id,
                      };
                    } catch (e) {
                      alert(`Failed to load Mega ${basePokemon.name} data.`);
                      return;
                    }
                  }

                  // --- GALARIAN MEOWTH HANDLER ---
                  else if (
                    basePokemon.rawName === "meowth" &&
                    regionalFormActive[basePokemon.id] === "galar" &&
                    regionalForms["meowth_galar"]
                  ) {
                    const formData = regionalForms["meowth_galar"];
                    try {
                      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${formData.pokedexId}`);
                      if (!res.ok) {
                        alert("Galarian Meowth data not found in PokéAPI.");
                        return;
                      }
                      const data = await res.json();
                      pokemonToOpen = {
                        id: data.id,
                        rawName: data.name,
                        name: `${basePokemon.name} (Galarian)`,
                        types: data.types.map((t: any) => t.type.name),
                        abilities: data.abilities.map((a: any) => ({
                          name: a.ability.name,
                          description: "",
                        })),
                        images: {
                          official: data.sprites.other?.['official-artwork']?.front_default ?? "",
                          home: data.sprites.other?.['home']?.front_default ?? "",
                          sprite: data.sprites.front_default ?? "",
                        },
                        stats: data.stats.map((s: any) => ({
                          name: s.stat.name,
                          base_stat: s.base_stat,
                        })),
                        moves: data.moves.flatMap((m: any) =>
                          m.version_group_details
                            .filter((v: any) => v.move_learn_method.name === "level-up")
                            .map((v: any) => ({
                              name: m.move.name,
                              move_learn_method: v.move_learn_method.name,
                              level_learned_at: v.level_learned_at,
                            }))
                        ),
                        height: data.height,
                        weight: data.weight,
                        baseSpeciesId: basePokemon.id,
                        basePokedexId: formData.basePokedexId,
                      };
                    } catch (e) {
                      alert("Failed to load Galarian Meowth data.");
                      return;
                    }

                    // --- ALOLAN MEOWTH HANDLER ---
                  } else if (
                    basePokemon.rawName === "meowth" &&
                    regionalFormActive[basePokemon.id] === "alola" &&
                    regionalForms["meowth"]
                  ) {
                    const formData = regionalForms["meowth"];
                    try {
                      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${formData.pokedexId}`);
                      if (!res.ok) {
                        alert("Alolan Meowth data not found in PokéAPI.");
                        return;
                      }
                      const data = await res.json();
                      pokemonToOpen = {
                        id: data.id,
                        rawName: data.name,
                        name: `${basePokemon.name} (Alolan)`,
                        types: data.types.map((t: any) => t.type.name),
                        abilities: data.abilities.map((a: any) => ({
                          name: a.ability.name,
                          description: "",
                        })),
                        images: {
                          official: data.sprites.other?.['official-artwork']?.front_default ?? "",
                          home: data.sprites.other?.['home']?.front_default ?? "",
                          sprite: data.sprites.front_default ?? "",
                        },
                        stats: data.stats.map((s: any) => ({
                          name: s.stat.name,
                          base_stat: s.base_stat,
                        })),
                        moves: data.moves.flatMap((m: any) =>
                          m.version_group_details
                            .filter((v: any) => v.move_learn_method.name === "level-up")
                            .map((v: any) => ({
                              name: m.move.name,
                              move_learn_method: v.move_learn_method.name,
                              level_learned_at: v.level_learned_at,
                            }))
                        ),
                        height: data.height,
                        weight: data.weight,
                        basePokedexId: formData.basePokedexId,
                      };
                    } catch (e) {
                      alert("Failed to load Alolan Meowth data.");
                      return;
                    }

                    // --- GENERIC REGIONAL FORM HANDLER ---
                  } else if (isRegionalActive && regionalFormData) {
                    try {
                      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${regionalFormData.pokedexId}`);
                      if (!res.ok) {
                        alert(`${regionalFormData.formName} data not found in PokéAPI.`);
                        return;
                      }
                      const data = await res.json();
                      pokemonToOpen = {
                        id: data.id,
                        rawName: data.name,
                        name: `${basePokemon.name} (${regionalFormData.formName})`,
                        types: data.types.map((t: any) => t.type.name),
                        abilities: data.abilities.map((a: any) => ({
                          name: a.ability.name,
                          description: "",
                        })),
                        images: {
                          official: data.sprites.other?.['official-artwork']?.front_default ?? "",
                          home: data.sprites.other?.['home']?.front_default ?? "",
                          sprite: data.sprites.front_default ?? "",
                        },
                        stats: data.stats.map((s: any) => ({
                          name: s.stat.name,
                          base_stat: s.base_stat,
                        })),
                        moves: data.moves.flatMap((m: any) =>
                          m.version_group_details
                            .filter((v: any) => v.move_learn_method.name === "level-up")
                            .map((v: any) => ({
                              name: m.move.name,
                              move_learn_method: v.move_learn_method.name,
                              level_learned_at: v.level_learned_at,
                            }))
                        ),
                        height: data.height,
                        weight: data.weight,
                        baseSpeciesId: basePokemon.id,
                        basePokedexId: regionalFormData.basePokedexId,
                      };
                    } catch (e) {
                      alert(`Failed to load ${regionalFormData.formName} data.`);
                      return;
                    }
                  }

                  // Open the info panel as before
                  if (
                    tabsRef.current &&
                    tabsRef.current.activeTabId === pokemonToOpen.id
                  ) {
                    if (tabsRef.current.isMinimized && tabsRef.current.isMinimized()) {
                      tabsRef.current.restorePanel?.(pokemonToOpen.id);
                    } else {
                      tabsRef.current.minimizePanel();
                    }
                  } else {
                    tabsRef.current?.openTab(pokemonToOpen);
                  }
                }}
                className="font-medium text-center hover:underline"
                type="button"
                aria-label={`Show more info about ${displayName}`}
              >
                #{
                  // Use basePokedexId for regional forms, else use basePokemon.id
                  (basePokemon.rawName === "meowth" && regionalFormActive[basePokemon.id] === "alola" && regionalForms["meowth"])
                    ? regionalForms["meowth"].basePokedexId.toString().padStart(3, "0")
                    : (basePokemon.rawName === "meowth" && regionalFormActive[basePokemon.id] === "galar" && regionalForms["meowth_galar"])
                      ? regionalForms["meowth_galar"].basePokedexId.toString().padStart(3, "0")
                      : (isRegionalActive && regionalFormData && regionalFormData.basePokedexId)
                        ? regionalFormData.basePokedexId.toString().padStart(3, "0")
                        : basePokemon.id.toString().padStart(3, "0")
                }
                <br />
                {displayName}
              </button>

              <span className="text-s text-black text-center mt-1 italic">
                {displayAbilities
                  .map(ability =>
                    ability
                      .split("-")
                      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                      .join(" ")
                  )
                  .join(" / ")}
              </span>

              <div className="flex gap-1 mt-2 flex-wrap justify-center">
                {displayTypes.map(type => (
                  <span
                    key={type}
                    className={`text-white text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${typeColors[type] || typeColors["unknown"]}`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </PokemonCard>
          );
        })}

      </ul>

      {filteredList.length === 0 && (
        <p className="text-center mt-8 text-gray-600">No Pokémon found.</p>
      )}

      <PokemonTabs ref={tabsRef} darkMode={darkMode} />

    </main>
  );
}