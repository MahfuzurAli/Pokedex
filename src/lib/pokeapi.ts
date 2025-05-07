// lib/pokeapi.ts

export async function fetchAllPokemon() {
  const limit = 1025; // Decides up to what Pokedex number to you want to display.
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  const data = await res.json();

  const pokemonList = await Promise.all(
    data.results.map(async (pokemon: any) => {
      const res = await fetch(pokemon.url);
      const pokemonList = await res.json();
      return {
        id: pokemonList.id,
        name: pokemonList.name,
        sprite: pokemonList.sprites.front_default,
        types: pokemonList.types.map((t: any) => t.type.name),
      };
    })
  );

  return pokemonList;
}
