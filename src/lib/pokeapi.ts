import { Pokemon } from "@/app/types/Pokemon";

export async function fetchAllPokemon(): Promise<Pokemon[]> {
  const limit = 1025; // or more
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  const data = await res.json();

  const pokemonList: Pokemon[] = await Promise.all(
    data.results.map(async (pokemon: { name: string; url: string }) => {
      const res = await fetch(pokemon.url);
      const details = await res.json();

      // Fetch abilities with descriptions in parallel
      const abilitiesWithDesc = await Promise.all(
        details.abilities.map(async (a: any) => {
          try {
            const abilityRes = await fetch(a.ability.url);
            const abilityData = await abilityRes.json();

            const englishEntry = abilityData.effect_entries.find(
              (entry: any) => entry.language.name === "en"
            );

            return {
              name: a.ability.name,
              description: englishEntry?.short_effect ?? "No description available.",
            };
          } catch {
            return {
              name: a.ability.name,
              description: "Failed to load description.",
            };
          }
        })
      );

      return {
        id: details.id,
        name: details.name,
        rawName: details.name,
        images: {
          sprite: details.sprites.front_default || null,
          home: details.sprites.other['home']?.front_default || null,
          official: details.sprites.other['official-artwork']?.front_default || null,
        },
        types: details.types.map((t: any) => t.type.name),
        abilities: abilitiesWithDesc,
        height: details.height,
        weight: details.weight,
        stats: details.stats.map((stat: any) => ({
          name: stat.stat.name,
          base_stat: stat.base_stat,
        })),
        moves: details.moves.map((move: any) => ({
          name: move.move.name,
          level_learned_at: move.version_group_details[0]?.level_learned_at ?? 0,
          move_learn_method: move.version_group_details[0]?.move_learn_method.name ?? '',
        })),
      };
    })
  );

  return pokemonList;
}
