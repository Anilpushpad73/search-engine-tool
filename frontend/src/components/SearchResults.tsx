
import { SearchResult } from '../utils/api';
import { MapPin, DollarSign, Users, Calendar, ExternalLink, Star } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isSearching: boolean;
  error?: string | null;
}

export default function SearchResults({ results, query, isSearching, error }: SearchResultsProps) {
  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      'Artificial Intelligence': 'bg-purple-100 text-purple-800',
      'Clean Energy': 'bg-green-100 text-green-800',
      'HealthTech': 'bg-blue-100 text-blue-800',
      'EdTech': 'bg-orange-100 text-orange-800',
      'FinTech': 'bg-emerald-100 text-emerald-800',
      'Cybersecurity': 'bg-red-100 text-red-800',
      'Food & Delivery': 'bg-yellow-100 text-yellow-800',
      'Real Estate': 'bg-indigo-100 text-indigo-800',
      'Gaming': 'bg-pink-100 text-pink-800',
      'Retail Tech': 'bg-teal-100 text-teal-800'
    };
    return colors[sector] || 'bg-gray-100 text-gray-800';
  };

  const getFundingStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'Pre-Seed': 'bg-gray-100 text-gray-700',
      'Seed': 'bg-blue-100 text-blue-700',
      'Series A': 'bg-green-100 text-green-700',
      'Series B': 'bg-orange-100 text-orange-700',
      'Series C': 'bg-red-100 text-red-700'
    };
    return colors[stage] || 'bg-gray-100 text-gray-700';
  };

  if (isSearching) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Searching...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Search Unavailable
        </h3>
        <p className="text-gray-500">
          Please start the Python backend to enable search functionality
        </p>
      </div>
    );
  }

  if (!query.trim() && results.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Discover Amazing Startups
        </h3>
        <p className="text-gray-500">
          Enter a search term to find startups by name, sector, description, or location
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No results found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search terms or filters to find more startups
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Found {results.length} startup{results.length !== 1 ? 's' : ''} for "{query}"
        </h2>
      </div>

      <div className="grid gap-6">
        {results.map(({ startup, score, matched_fields, highlights }) => (
          <div
            key={startup.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlights?.name || startup.name
                        }}
                      />
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSectorColor(startup.sector)}`}>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlights?.sector || startup.sector
                          }}
                        />
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFundingStageColor(startup.funding_stage)}`}>
                        {startup.funding_stage}
                      </span>
                      {score > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          <Star className="h-3 w-3 fill-current" />
                          {(score * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlights?.description || startup.description
                    }}
                  />
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlights?.location || startup.location
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 flex-shrink-0" />
                    <span>{startup.funding_amount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span>{startup.employees} employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>Founded {startup.founded}</span>
                  </div>
                </div>

                {matched_fields.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500">Matched in:</span>
                    {matched_fields.map(field => (
                      <span
                        key={field}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md capitalize"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-row lg:flex-col gap-2 lg:gap-3">
                <a
                  href={`https://${startup.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Website
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}