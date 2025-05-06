// app/page.tsx
import { fetchAllPokemon } from "@/lib/pokeapi";

export default async function HomePage() {
  const pokemonList = await fetchAllPokemon();

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-4">Pokédex</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pokemonList.map((pokemon, index) => (
          <li
            key={index}
            className="bg-white rounded shadow p-4 flex justify-between items-center"
          >
            <span className="capitalize font-medium">{pokemon.name}</span>
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              className="w-12 h-12"
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
