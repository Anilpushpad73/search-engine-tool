import { useState, useEffect } from 'react';
import SearchBox from './components/SearchBox';
import SearchFilters from './components/SearchFilters';
import SearchResults from './components/SearchResults';
import SearchHistory from './components/SearchHistory';
import { searchStartups, getFilterOptions, SearchFilters as ISearchFilters, SearchResult } from './utils/api';
import { Search, TrendingUp } from 'lucide-react';

function App() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<ISearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterOptions, setFilterOptions] = useState<{
    sectors: string[];
    funding_stages: string[];
    locations: string[];
  }>({ sectors: [], funding_stages: [], locations: [] });
  const [error, setError] = useState<string | null>(null);

  // Load filter options and startup count on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const options = await getFilterOptions();
        setFilterOptions(options);
  
      } catch (err) {
        setError('Failed to connect to search API. Please make sure the Python backend is running.');
        console.error('Failed to load initial data:', err);
      }
    };
    
    loadInitialData();
  }, []);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search history to localStorage
  const addToHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const performSearch = async (historicQuery?:string) => {
    const q = historicQuery ?? query;
    setIsSearching(true);
    setHasSearched(true);
    setError(null);
    
    try {
      const response = await searchStartups(q, filters);
      setSearchResults(response.results);
      setIsSearching(false);
    
      if (q.trim()) {
        addToHistory(q.trim());
      }
    } catch (err) {
      setError('Search failed. Please check your connection and try again.');
      console.error('Search error:', err);
      setIsSearching(false);
    }
  };

  // Real-time search as user types
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim() || hasSearched) {
        performSearch();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filters]);


  const handleHistoryItemClick = (historicQuery: string) => {
    setQuery(historicQuery);
    setTimeout(() => {
    performSearch(historicQuery);
  }, 0);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-200/90 backdrop-blur-md shadow-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-sm">
                <Search className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Startup Search Engine
              </h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Find your next big career move or investment with precision search.
            </p>
          </div>
        </div>
      </div>

{/* Spacer to prevent content hiding behind fixed header */}
<div className="h-32"></div>


      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p className="font-medium">Connection Error</p>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-sm mt-2">
                ⚠️ The application can’t reach the server: <code className="bg-red-100 px-2 py-1 rounded">Please make sure the backend is running.</code>
              </p>
            </div>
          )}
          
          {/* Search Box */}
          <SearchBox
            query={query}
            onQueryChange={setQuery}
            onSearch={performSearch}
            isSearching={isSearching}
          />

          {/* Search History */}
          <SearchHistory
            history={searchHistory}
            onHistoryItemClick={handleHistoryItemClick}
            onClearHistory={clearHistory}
          />

          {/* Filters */}
          <SearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            filterOptions={filterOptions}
            isVisible={showFilters}
            onToggleVisibility={() => setShowFilters(!showFilters)}
            performSearch={performSearch}
          />


          {/* Stats */}
          {(hasSearched || Object.keys(filters).length > 0) && !error && (
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Searching for startups</span>
              </div>
              {searchResults.length > 0 && (
                <span className="font-medium text-blue-600">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}

          {/* Search Results */}
          <SearchResults
            results={searchResults}
            query={query}
            isSearching={isSearching}
            error={error}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Built with React, TypeScript, and Tailwind CSS. Features TF-IDF scoring, fuzzy matching, and intelligent filtering.
            </p>
            <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-400">
              <span>• Real-time search</span>
              <span>• Relevance scoring</span>
              <span>• Advanced filtering</span>
              <span>• Search history</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;