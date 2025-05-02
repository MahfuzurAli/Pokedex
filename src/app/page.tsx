// app/page.tsx
'use client'

import { useEffect, useState } from 'react'

type Pokemon = {
  name: string
  url: string
}

export default function Home() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
        const data = await res.json()
        setPokemonList(data.results)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch Pokémon:', error)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p className="text-center mt-10">Loading Pokédex...</p>

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Pokédex</h1>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {pokemonList.map((pokemon, index) => {
          const pokemonId = index + 1
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`

          return (
            <li
              key={index}
              className="bg-white dark:bg-zinc-800 p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="capitalize font-medium">{pokemon.name}</p>
                <p className="text-sm text-zinc-500">ID: {pokemonId}</p>
              </div>
              <img src={imageUrl} alt={pokemon.name} className="w-12 h-12" />
            </li>
          )
        })}
      </ul>
    </main>
  )
}
