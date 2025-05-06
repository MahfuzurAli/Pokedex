// lib/pokeapi.ts

export async function fetchAllPokemon() {
  const limit = 1025; // You can change this to get more Pokémon
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  const data = await res.json();

  const pokemonList = await Promise.all(
    data.results.map(async (pokemon: { name: string; url: string }) => {
      const pokeRes = await fetch(pokemon.url);
      const pokeData = await pokeRes.json();
      return {
        name: pokemon.name,
        sprite: pokeData.sprites.front_default,
      };
    })
  );

  return pokemonList;
}
