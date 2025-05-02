
# Pokédex Project

## Overview

This is a simple Pokédex web application built using **Next.js** and **shadcn/ui**. It fetches data from the [PokeAPI](https://pokeapi.co/) to display a list of Pokémon along with their respective sprites. The application is designed to allow users to explore information about various Pokémon in a grid layout, with the ability to view their names and unique identifiers (IDs).

## Features

- **Pokémon List**: Displays a list of the first 1025 Pokémon, sourced from the PokeAPI.
- **Sprite Display**: Shows each Pokémon's sprite in a clean, responsive layout.
- **Responsive Design**: The layout adapts to different screen sizes (mobile, tablet, desktop).
- **Loading State**: A simple loading indicator is displayed while the Pokémon data is being fetched.

## Technologies Used

- **Next.js**: A React framework for building web applications.
- **TypeScript**: A statically typed superset of JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for building responsive and customizable UI.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/pokedex-project.git
   cd pokedex-project
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

   The application will be accessible at `http://localhost:3000`.

## Current Features

- Displays a list of Pokémon with their names and IDs.
- Displays Pokémon sprites from the PokeAPI.

## Future Improvements

- **Official Artwork**: Replace sprites with official Pokémon artwork for a more polished look.
- **Search Functionality**: Add a search bar to allow users to search for specific Pokémon by name or ID.
- **Detailed Information**: Add more detailed information about each Pokémon, such as types, abilities, and stats.
- **Pagination**: Implement pagination to load Pokémon in smaller chunks for better performance with larger datasets.
- **Favorites**: Allow users to mark Pokémon as favorites and save them locally.

## License

This project is open-source and available under the [MIT License](LICENSE).
