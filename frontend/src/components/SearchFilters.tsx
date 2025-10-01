
import { Filter, X } from 'lucide-react';
import { SearchFilters as ISearchFilters } from '../utils/api';

interface SearchFiltersProps {
  filters: ISearchFilters;
  onFiltersChange: (filters: ISearchFilters) => void;
  filterOptions: {
    sectors: string[];
    funding_stages: string[];
    locations: string[];
  };
  isVisible: boolean;
  onToggleVisibility: () => void;
  performSearch: () => void;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  filterOptions,
  isVisible,
  onToggleVisibility,
  performSearch
}: SearchFiltersProps) {
  const handleFilterChange = (key: keyof ISearchFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value
    });
    performSearch();
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <button
        onClick={onToggleVisibility}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      >
        <Filter className="h-4 w-4" />
        Filters
        {activeFiltersCount > 0 && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isVisible && (
        <div className="mt-4 p-6 bg-white rounded-xl shadow-lg border border-gray-200 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filter Results</h3>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={onToggleVisibility}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sector
              </label>
              <select
                value={filters.sector || ''}
                onChange={(e) => handleFilterChange('sector', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200"
              >
                <option value="">All sectors</option>
                {filterOptions.sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funding Stage
              </label>
              <select
                value={filters.funding_stage || ''}
                onChange={(e) => handleFilterChange('funding_stage', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200"
              >
                <option value="">All stages</option>
                {filterOptions.funding_stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors duration-200"
              >
                <option value="">All locations</option>
                {filterOptions.locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}