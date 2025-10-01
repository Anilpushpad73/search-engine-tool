import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBoxProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  isSearching: boolean;
}


export default function SearchBox({ query, onQueryChange, onSearch, isSearching }: SearchBoxProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const handleClear = () => {
    onQueryChange("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        {/* Input with search icon */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search startups by name, sector, description..."
            className="w-full pl-12 pr-10 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
            disabled={isSearching}
          />

          {/* Clear button inside input */}
          {query && !isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Loading spinner */}
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Search button */}
        <button
          type="submit"
          disabled={isSearching}
          className="px-5 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Search
        </button>
      </form>
    </div>
  );
}
