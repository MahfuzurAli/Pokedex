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
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGeneration, setSelectedGeneration] = useState<string | null>(null);
  const [imageStyle, setImageStyle] = useState<'official' | 'home' | 'sprite'>('home');
  const [sortOption, setSortOption] = useState("number-asc");
  const [shinyActive, setShinyActive] = useState<Record<number, boolean>>({});
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [regionalFormActive, setRegionalFormActive] = useState<{ [pokemonId: number]: boolean }>({});
  const [regionalAbilities, setRegionalAbilities] = useState<Record<number, string[]>>({});
  const tabsRef = useRef<PokemonTabsHandle>(null);


  function toggleShiny(id: number) {
    setShinyActive(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function toggleRegionalForm(pokemonId: number) {
    setRegionalFormActive(prev => ({
      ...prev,
      [pokemonId]: !prev[pokemonId],
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
    Object.entries(regionalFormActive).forEach(([pokemonId, isActive]) => {
      if (isActive) {
        const basePokemon = pokemonList.find(p => p.id === Number(pokemonId));
        if (!basePokemon) return;
        const regionalFormData = regionalForms[basePokemon.rawName as keyof typeof regionalForms];
        if (regionalFormData && !regionalAbilities[regionalFormData.pokedexId]) {
          fetchRegionalAbilities(regionalFormData.pokedexId);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionalFormActive, pokemonList]);

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
      normalizeString(ability.name).includes(normalizedSearch)
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
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
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
              src={`/icons/${type}.svg`}
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
      <div className="flex justify-end gap-2 mb-4">
        {(['home', 'official', 'sprite'] as const).map(style => (
          <button
            key={style}
            onClick={() => setImageStyle(style)}
            className={`
        p-1 rounded
        bg-transparent
        ${imageStyle === style ? 'ring-2 ring-indigo-500' : ''}
        transition
        hover:ring-2 hover:ring-indigo-300
      `}
            title={
              style === 'official'
                ? "Official Artwork"
                : style === 'home'
                  ? "Home Artwork"
                  : "Sprite Artwork"
            }
            type="button"
          >
            <img
              src={`/${style}-artwork.png`}
              alt={`${style} artwork`}
              className="w-8 h-8 object-contain"
              draggable={false}
              style={{ background: "transparent" }}
            />
          </button>
        ))}
      </div>

      {/* Pokémon List */}
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {sortedList.map(pokemon => {
          const isShiny = shinyActive[pokemon.id] === true;

          // Check if this Pokémon has a regional form
          const hasRegionalForm = regionalForms.hasOwnProperty(pokemon.rawName);
          const isRegionalActive = regionalFormActive[pokemon.id] === true;

          const basePokemon = pokemon;
          const regionalFormData = regionalForms[pokemon.rawName as keyof typeof regionalForms];

          // Determine which form data to use
          // Determine which form data to use
          const displayPokemonId = isRegionalActive && regionalFormData ? regionalFormData.pokedexId : basePokemon.id;
          const displayName = isRegionalActive && regionalFormData ? `${basePokemon.name} (${regionalFormData.formName})` : basePokemon.name;
          const displayTypes = isRegionalActive && regionalFormData ? regionalFormData.types : basePokemon.types;
          // Abilities always come from basePokemon
          const displayAbilities =
            isRegionalActive && regionalFormData && regionalAbilities[regionalFormData.pokedexId]
              ? regionalAbilities[regionalFormData.pokedexId]
              : basePokemon.abilities.map(a => a.name);


          // Determine image URL dynamically based on selected form and shiny status
          let imageUrl = "";

          if (isShiny) {
            if (imageStyle === 'official') {
              imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${displayPokemonId}.png`;
            } else if (imageStyle === 'home') {
              imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${displayPokemonId}.png`;
            } else if (imageStyle === 'sprite') {
              imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${displayPokemonId}.png`;
            }
          } else {
            if (isRegionalActive && regionalFormData) {
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

          return (
            <li key={pokemon.id} className="bg-white rounded-lg shadow p-3 flex flex-col items-center justify-between aspect-square text-sm relative">
              {/* Shiny toggle button */}
              {(imageStyle === 'official' || imageStyle === 'home' || imageStyle === 'sprite') && (
                <button
                  onClick={() => toggleShiny(pokemon.id)}
                  className="absolute top-2 left-2 w-6 h-6 text-yellow-400 hover:text-yellow-300"
                  title="Toggle Shiny"
                  aria-label={`Toggle shiny for ${basePokemon.name}`}
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

              {/* Regional form toggle button */}
              {hasRegionalForm && (
                <button
                  className="group absolute top-2 right-2 w-6 h-6"
                  title="Toggle Regional Form"
                  aria-label={`Toggle regional form for ${basePokemon.name}`}
                  type="button"
                  onClick={() => toggleRegionalForm(pokemon.id)}
                >
                  {regionalFormData?.formName?.toLowerCase().includes("alola") ? (
                    <img
                      src="/alola-symbol.png"
                      alt="Alolan Form"
                      className={`w-4 h-4 object-contain transition duration-200
                        ${isRegionalActive
                          ? "filter invert sepia saturate-[5000%] hue-rotate-[180deg] opacity-90"
                          : ""}
                        group-hover:filter group-hover:invert group-hover:sepia group-hover:saturate-[5000%] group-hover:hue-rotate-[180deg] group-hover:opacity-90`}
                      draggable={false}
                    />
                  ) : regionalFormData?.formName?.toLowerCase().includes("galar") ? (
                    <img
                      src="/galar-symbol.png"
                      alt="Galarian Form"
                      className={`w-4 h-4 object-contain transition duration-200
                        ${isRegionalActive
                          ? "filter invert sepia saturate-[5000%] hue-rotate-[180deg] opacity-90"
                          : ""}
                        group-hover:filter group-hover:invert group-hover:sepia group-hover:saturate-[5000%] group-hover:hue-rotate-[180deg] group-hover:opacity-90`}
                      draggable={false}
                    />
                  ) : regionalFormData?.formName?.toLowerCase().includes("hisui") ? (
                    <img
                      src="/hisui-symbol.png"
                      alt="Hisuian Form"
                      className={`w-4 h-4 object-contain transition duration-200
                        ${isRegionalActive
                          ? "filter invert sepia saturate-[5000%] hue-rotate-[180deg] opacity-90"
                          : ""}
                        group-hover:filter group-hover:invert group-hover:sepia group-hover:saturate-[5000%] group-hover:hue-rotate-[180deg] group-hover:opacity-90`}
                      draggable={false}
                    />
                  ) : regionalFormData?.formName?.toLowerCase().includes("paldea") ? (
                    <img
                      src="/paldea-symbol.png"
                      alt="Paldean Form"
                      className={`w-4 h-4 object-contain transition duration-200
                        ${isRegionalActive
                          ? "filter invert sepia saturate-[5000%] hue-rotate-[180deg] opacity-90"
                          : ""}
                        group-hover:filter group-hover:invert group-hover:sepia group-hover:saturate-[5000%] group-hover:hue-rotate-[180deg] group-hover:opacity-90`}
                      draggable={false}
                    />
                  ) : (
                    <span className="text-blue-500 group-hover:text-blue-400">▶</span>
                  )}
                </button>
              )}

              <img
                src={imageUrl}
                alt={displayName}
                className="w-35 h-35 object-contain mb-2"
                loading="lazy"
              />

              <button
                onClick={async () => {
                  let pokemonToOpen = pokemon;

                  // If regional form is active, fetch its data
                  if (isRegionalActive && regionalFormData) {
                    try {
                      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${regionalFormData.pokedexId}`);
                      if (!res.ok) {
                        alert("Regional form data not found in PokéAPI.");
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
                      };
                    } catch (e) {
                      alert("Failed to load regional form data.");
                      return;
                    }
                  }

                  // Handle minimized/active logic
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
                #{displayPokemonId.toString().padStart(4, "0")}<br />
                {displayName}
              </button>

              <span className="text-s text-gray-500 text-center mt-1 italic">
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
            </li>
          );
        })}

      </ul>

      {filteredList.length === 0 && (
        <p className="text-center mt-8 text-gray-600">No Pokémon found.</p>
      )}

      <PokemonTabs ref={tabsRef} />

    </main>
  );
}