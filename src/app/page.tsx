// app/page.tsx
import { fetchAllPokemon } from "@/lib/pokeapi";

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-orange-700",
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

export default async function HomePage() {
  const pokemonList = await fetchAllPokemon();

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-4">Pokédex</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pokemonList.map((pokemon) => (
          <li
            key={pokemon.id}
            className="bg-white rounded shadow p-4 flex justify-between items-center"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  #{pokemon.id.toString().padStart(4, "0")} -{" "}
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </span>
                <div className="flex gap-1">
                  {pokemon.types.map((type: string) => (
                    <span
                      key={type}
                      className={`text-white text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                        typeColors[type] || typeColors["unknown"]
                      }`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              className="w-15 h-15"
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
