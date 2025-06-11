import React from "react";
import PokemonCard from "./PokemonCard";
import AlternateForms from "./AlternateForms";
import type { AlternateForms as AlternateFormsType } from "@/app/types/AlternateForms";
import { Pokemon } from "@/app/types/Pokemon";
import { RegionalForms } from "@/app/types/RegionalForms";
import { MegaEvolutions } from "@/app/types/MegaEvolutions";
import { PokemonTabsHandle } from "./PokemonTabs";




interface PokemonListProps {
    sortedList: Pokemon[];
    shinyActive: Record<number, boolean>;
    toggleShiny: (id: number) => void;
    regionalForms: RegionalForms;
    regionalFormActive: { [pokemonId: number]: string | null };
    megaActive: { [pokemonId: number]: boolean };
    megaFormActive: { [pokemonId: number]: string | null };
    setMegaActive: React.Dispatch<React.SetStateAction<{ [pokemonId: number]: boolean }>>;
    setMegaFormActive: React.Dispatch<React.SetStateAction<{ [pokemonId: number]: string | null }>>;
    setRegionalFormActive: React.Dispatch<React.SetStateAction<{ [pokemonId: number]: string | null }>>;
    specialFormActive: { [pokemonId: number]: string | null };
    setSpecialFormActive: React.Dispatch<React.SetStateAction<{ [pokemonId: number]: string | null }>>;
    regionalAbilities: Record<number, string[]>;
    typeColors: Record<string, string>;
    imageStyle: 'official' | 'home' | 'sprite';
    alternateForms: AlternateFormsType;
    megaEvolutions: MegaEvolutions;
    tabsRef: React.RefObject<PokemonTabsHandle | null>;
    darkMode: boolean;
}

const PokemonList: React.FC<PokemonListProps> = ({
    sortedList,
    shinyActive,
    toggleShiny,
    regionalForms,
    regionalFormActive,
    megaActive,
    megaFormActive,
    setMegaActive,
    setMegaFormActive,
    setRegionalFormActive,
    specialFormActive,
    setSpecialFormActive,
    regionalAbilities,
    typeColors,
    imageStyle,
    tabsRef,
    alternateForms,
    megaEvolutions,
    darkMode,
}) => {
    return (
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
                    (f: { formName: string; pokedexId?: number; types?: string[]; formSuffix?: string }) =>
                        (specialFormActive[basePokemon.id] === "origin" && f.formName === "Origin") ||
                        (!specialFormActive[basePokemon.id] && f.formName === "Normal")
                );

                if (altFormData) {
                    displayPokemonId = altFormData.pokedexId ?? displayPokemonId;
                    displayName =
                        basePokemon.rawName === "giratina-altered" && altFormData.formName === "Origin"
                            ? "Giratina (Origin)"
                            : `${basePokemon.name}${altFormData.formName && altFormData.formName !== "Normal" ? ` (${altFormData.formName})` : ""}`;
                    displayTypes = altFormData.types ?? displayTypes;
                    formSuffix = altFormData.formSuffix ?? "";
                }
                if (
                    basePokemon.rawName === "giratina-altered" &&
                    (!altFormData || altFormData.formName === "Normal" || altFormData.formName === "Altered")
                ) {
                    displayName = "Giratina (Altered)";
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

                                    // --- ORIGIN FORM HANDLER ---
                                } else if (
                                    (["dialga", "palkia", "giratina-altered"].includes(basePokemon.rawName)) &&
                                    specialFormActive[basePokemon.id] === "origin" &&
                                    alternateForms[basePokemon.rawName]
                                ) {
                                    const altFormData = alternateForms[basePokemon.rawName].forms.find((f: any) => f.formName === "Origin");
                                    if (altFormData) {
                                        try {
                                            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${altFormData.pokedexId}`);
                                            if (!res.ok) {
                                                alert("Origin form data not found in PokéAPI.");
                                                return;
                                            }
                                            const data = await res.json();
                                            pokemonToOpen = {
                                                id: data.id,
                                                rawName: data.name,
                                                name: `${basePokemon.name} (Origin)`,
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
                                            alert("Failed to load Origin form data.");
                                            return;
                                        }
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
                            className={`font-medium text-center hover:underline ${darkMode ? "text-white" : "text-black"}`}
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

                        <span className={`text-s text-center mt-1 italic ${darkMode ? "text-white" : "text-black"}`}>
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
    );
};

export default PokemonList;