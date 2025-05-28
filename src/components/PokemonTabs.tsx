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

interface PokemonTabsProps { }

const PokemonTabs = forwardRef<PokemonTabsHandle, PokemonTabsProps>((props, ref) => {
    const [tabs, setTabs] = useState<Pokemon[]>([]);
    const [activeTabId, setActiveTabId] = useState<number | null>(null);
    const [minimized, setMinimized] = useState(false);

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
                        onClick={() => (minimized ? restorePanel(pokemon.id) : setActiveTabId(pokemon.id))}
                        className={`flex items-center justify-between bg-white shadow rounded-l-full rounded-r-none px-3 py-2 border border-gray-300
                          ${activeTabId === pokemon.id && !minimized ? "border-indigo-500 bg-indigo-100" : ""}
                          hover:bg-indigo-50 transition-colors relative`}
                        style={{ minWidth: 80 }}
                    >
                        <img
                            src={pokemon.images?.sprite || "/placeholder.png"}
                            alt={pokemon.name}
                            className="w-8 h-8 mr-2"
                        />
                        <span className="capitalize font-medium">{pokemon.name}</span>
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
                    </button>
                ))}
            </div>

            {/* Info Panel */}
            <div
                className={`fixed top-0 right-0 h-full z-50 transition-transform duration-300
          ${minimized || !activePokemon ? "translate-x-full" : "translate-x-0"}`}
                style={{ width: 340 }}
            >
                {activePokemon && !minimized && (
                    <PokemonInfoPanel
                        selectedPokemon={activePokemon}
                        setSelectedPokemon={() => activePokemon && closeTab(activePokemon.id)}
                        showMinimize
                        onMinimize={minimizePanel}
                    />
                )}
            </div>
        </>
    );
});

export default PokemonTabs;