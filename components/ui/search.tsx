"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

interface SearchProps {
  placeholder: string;
  searchButton?: boolean;
}

export default function Search({
  placeholder,
  searchButton = false,
}: SearchProps) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("search")?.toString() || ""
  );

  const executeSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("offset", "0"); // Reset to the first page
    params.set("limit", "8"); // Default limit, or adjust as needed
    if (term) {
      params.set("search", term); // Set the raw search term, no manual encoding
    } else {
      params.delete("search");
    }
    replace(`/books?${params.toString()}`);
  };

  const debouncedSearch = useDebouncedCallback((term: string) => {
    executeSearch(term);
  }, 300);

  const handleSearchInput = (term: string) => {
    setSearchTerm(term);

    if (!searchButton) {
      debouncedSearch(term);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeSearch(searchTerm);
    }
  };

  const handleButtonClick = () => {
    executeSearch(searchTerm);
  };

  return (
    <div className="relative flex items-center w-full">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        type="text"
        className="block w-full rounded-full border border-gray-700 bg-gray-900 text-white py-2 pl-12 pr-4 text-sm placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
        placeholder={placeholder}
        onChange={(e) => handleSearchInput(e.target.value)}
        onKeyDown={handleKeyDown}
        value={searchTerm}
      />
      <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition duration-300 ease-in-out" />
      {searchButton && (
        <button
          type="button"
          onClick={handleButtonClick}
          className="ml-3 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-6 text-sm font-medium shadow-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-300 ease-in-out"
        >
          Search
        </button>
      )}
    </div>
  );
}
