// src/app/api/pokemon/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  const url = query
    ? `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
    : 'https://pokeapi.co/api/v2/pokemon?limit=151';

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: 'Pokémon not found' }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
