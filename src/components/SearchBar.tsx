"use client";

import React from "react";

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
};

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
}: SearchBarProps) {
  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
      <input
        type="text"
        placeholder="Search by name, number or ability..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border rounded w-full sm:w-1/2"
      />

      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="mt-2 sm:mt-0 p-2 border rounded w-full sm:w-auto text-sm"
      >
        <option value="number-asc">Sort by Number (1-1025)</option>
        <option value="number-desc">Sort by Number (1025-1)</option>
        <option value="name-asc">Sort by Name (A-Z)</option>
        <option value="name-desc">Sort by Name (Z-A)</option>
      </select>
    </div>
  );
}
