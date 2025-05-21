// lib/pokeapi.ts

export type Pokemon = {
  id: number;
  name: string;
  images: {
    sprite: string | null;
    home: string | null;
    official: string | null;
  };
  types: string[];
  abilities: string[];
};

export async function fetchAllPokemon(): Promise<Pokemon[]> {
  const limit = 1025;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  const data = await res.json();

  const pokemonList: Pokemon[] = await Promise.all(
    data.results.map(async (pokemon: { name: string; url: string }) => {
      const res = await fetch(pokemon.url);
      const details = await res.json();

      return {
        id: details.id,
        name: details.name,
        images: {
          sprite: details.sprites.front_default || null,
          home: details.sprites.other['home']?.front_default || null,
          official: details.sprites.other['official-artwork']?.front_default || null,
        },
        types: details.types.map((t: any) => t.type.name),
        abilities: details.abilities.map((a: any) => a.ability.name),
      };
    })
  );

  return pokemonList;
}
