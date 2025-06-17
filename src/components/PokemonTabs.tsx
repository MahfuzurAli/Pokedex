import React, { useState, forwardRef, useImperativeHandle } from "react";
import PokemonInfoPanel from "./PokemonInfoPanel";
import { Pokemon } from "@/app/types/Pokemon";

export interface PokemonTabsHandle {
    openTab: (pokemon: Pokemon) => void;
    minimizePanel: () => void;
    restorePanel: (id: number) => void;
    activeTabId: number | null;
    isMinimized: () => boolean;
}

interface PokemonTabsProps {
    darkMode: boolean;
}

const PokemonTabs = forwardRef<PokemonTabsHandle, PokemonTabsProps>(({ darkMode }, ref) => {
    const [tabs, setTabs] = useState<Pokemon[]>([]);
    const [activeTabId, setActiveTabId] = useState<number | null>(null);
    const [minimized, setMinimized] = useState(false);
    const [tabsColors, setTabColors] = useState<Record<number, string>>({});

    // Expose openTab to parent via ref
    useImperativeHandle(ref, () => ({
        openTab,
        minimizePanel,
        restorePanel,
        activeTabId,
        isMinimized: () => minimized,
    }));

    // Open or activate a tab for a Pokémon
    function openTab(pokemon: Pokemon) {
        setTabs((prev) => {
            if (prev.find((p) => p.id === pokemon.id)) return prev;
            return [...prev, pokemon];
        });
        setActiveTabId(pokemon.id);
        setMinimized(false);
    }

    // Close a tab
    function closeTab(id: number) {
        setTabs((prev) => prev.filter((p) => p.id !== id));
        if (activeTabId === id) {
            const remaining = tabs.filter((p) => p.id !== id);
            setActiveTabId(remaining.length ? remaining[remaining.length - 1].id : null);
        }
    }

    // Minimize the panel
    function minimizePanel() {
        setMinimized(true);
    }

    // Restore the panel
    function restorePanel(id: number) {
        setActiveTabId(id);
        setMinimized(false);
    }

    // Handle color change for a Pokémon tab
    function handleColorChange(pokemonId: number, color: string) {
        setTabColors((prev) => ({ ...prev, [pokemonId]: color }));
    }

    const activePokemon = tabs.find((p) => p.id === activeTabId) || null;

    return (
        <>
            {/* Tab Bar */}
            <div
                className={`fixed bottom-4 ${minimized ? "right-4" : "right-[530px]"} flex flex-col-reverse gap-2 z-50 transition-all`}
            >
                {tabs.map((pokemon) => (
                    <button
                        key={pokemon.id}
                        onClick={() => {
                            if (activeTabId === pokemon.id && !minimized) {
                                minimizePanel();
                            } else if (minimized) {
                                restorePanel(pokemon.id);
                            } else {
                                setActiveTabId(pokemon.id);
                            }
                        }}
                        className={`flex items-center justify-between
                      bg-white/40 backdrop-blur-md shadow
                      rounded-l-full rounded-r-none px-3 py-2 border border-black
                      ${activeTabId === pokemon.id && !minimized ? "ring-2 ring-white border-transparent shadow-lg" : ""}
                      hover:bg-white/60 transition-colors relative
                      ${minimized ? "justify-center px-2 py-2" : ""}`}
                        style={{
                            minWidth: minimized ? 48 : 80,
                            minHeight: minimized ? 48 : undefined,
                            boxShadow:
                                activeTabId === pokemon.id && !minimized && tabsColors[pokemon.id]
                                    ? `0 0 0 4px ${tabsColors[pokemon.id]}`
                                    : undefined,
                            borderColor:
                                activeTabId === pokemon.id && !minimized && tabsColors[pokemon.id]
                                    ? tabsColors[pokemon.id]
                                    : undefined,
                        }}
                    >
                        <img
                            src={pokemon.images?.sprite || "/placeholder.png"}
                            alt={pokemon.name}
                            className={`transition-all duration-200
                        ${minimized ? "w-9 h-9 mx-auto" : "w-9 h-9 mr-2"}`}
                            style={minimized ? { display: "block" } : {}}
                        />
                        {!minimized && (
                            <>
                                <span className="capitalize font-medium">
                                    {pokemon.rawName === "giratina-altered" && pokemon.name.toLowerCase().includes("origin")
                                        ? "Giratina (Origin)"
                                        : pokemon.rawName === "giratina-altered"
                                            ? "Giratina (Altered)"
                                            : pokemon.name.replace(/^Giratina Altered/, "Giratina")}
                                </span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        closeTab(pokemon.id);
                                    }}
                                    className="ml-2 text-gray-400 hover:text-red-500 cursor-pointer"
                                    aria-label="Close tab"
                                    role="button"
                                    tabIndex={0}
                                >
                                    ×
                                </span>
                            </>
                        )}
                    </button>
                ))}
            </div>

            {/* Info Panel */}
            <div
                className={`fixed top-0 right-0 h-full z-50 transition-transform duration-300
        ${activePokemon && !minimized ? "translate-x-0" : "translate-x-full"}`}
                style={{ width: 340 }}
            >
                <div
                    className={`h-full transition-opacity duration-200 ${activePokemon && !minimized ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                        }`}
                >
                    {activePokemon && (
                        <PokemonInfoPanel
                            selectedPokemon={activePokemon}
                            setSelectedPokemon={() => activePokemon && closeTab(activePokemon.id)}
                            showMinimize
                            onMinimize={minimizePanel}
                            darkMode={darkMode}
                            onColorChange={(color: string) => handleColorChange(activePokemon.id, color)}
                        />
                    )}
                </div>
            </div>
        </>
    );
});

export default PokemonTabs;