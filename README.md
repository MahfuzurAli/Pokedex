# Pokédex Project

## Overview

This is a feature-rich Pokédex web application built using **Next.js** and **shadcn/ui**. It fetches data from the [PokeAPI](https://pokeapi.co/) and supports a wide variety of Pokémon forms, including regional, mega, and alternate forms. The app allows users to explore detailed information about Pokémon, view their sprites and official artwork, and interact with a modern, responsive UI.

## Features

- **Pokémon List**: Displays a list of the first 1025 Pokémon, including support for regional, mega, and alternate forms.
- **Sprite & Official Artwork Display**: Toggle between sprites, HOME, and official artwork for each Pokémon.
- **Responsive Design**: The layout adapts to different screen sizes (mobile, tablet, desktop).
- **Tab Info Panel**: Open multiple Pokémon info panels as tabs, with customizable placement (right sidebar or bottom bar).
- **Form Toggles**: Instantly switch between regional, mega, and special forms (like Origin Dialga/Palkia/Giratina) and see their correct images and info.
- **Shiny Toggle**: View shiny versions of Pokémon artwork and sprites.
- **Search & Sort**: Search for Pokémon by name or ID and sort the list by various criteria.
- **Type & Generation Filters**: Filter Pokémon by type or generation.
- **Dark Mode**: Toggle between light and dark themes.
- **Loading State**: A simple loading indicator is displayed while the Pokémon data is being fetched.

## Technologies Used

- **Next.js**: A React framework for building web applications.
- **TypeScript**: A statically typed superset of JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for building responsive and customizable UI.
- **shadcn/ui**: For accessible and beautiful UI components.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/pokedex.git
   cd pokedex
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

- Displays a list of Pokémon with their names, IDs, types, and forms.
- Displays Pokémon sprites, HOME, and official artwork from the PokeAPI.
- Info panel with tabbed browsing and placement customization.
- Toggle and view regional, mega, and alternate forms (including Origin forms).
- Shiny toggle for all supported artwork styles.
- Search, sort, and filter Pokémon.
- Dark mode support.

## Future Improvements

- **Favorites**: Allow users to mark Pokémon as favorites and save them locally.
- **Performance**: Further optimize loading and rendering for large datasets.
- **Accessibility**: Continue improving keyboard and screen reader support.

## License

This project is open-source and available under the [MIT License](LICENSE).