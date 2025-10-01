// API utilities for connecting to Python backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export interface SearchResponse {
  query: string;
  filters: Record<string, string>;
  total_results: number;
  results: SearchResult[];
}

export interface SearchResult {
  startup: Startup;
  score: number;
  matched_fields: string[];
  highlights: Record<string, string>;
}

export interface Startup {
  id: number;
  name: string;
  sector: string;
  location: string;
  funding_stage: string;
  funding_amount: string;
  description: string;
  founded: number;
  employees: string;
  website: string;
}

export interface FilterOptions {
  sectors: string[];
  funding_stages: string[];
  locations: string[];
}

export interface SearchFilters {
  sector?: string;
  funding_stage?: string;
  location?: string;
}

// Search startups using the Python backend
export async function searchStartups(
  query: string,
  filters: SearchFilters = {},
  limit: number = 20
): Promise<SearchResponse> {
  const params = new URLSearchParams(); //  get & set key-value pairs, easily construct, read, and manipulate query parameters in URLs.

  if (query.trim()) {
    params.append('q', query.trim());
  }
  
  if (filters.sector) {
    params.append('sector', filters.sector);
  }
  
  if (filters.funding_stage) {
    params.append('funding_stage', filters.funding_stage);
  }
  
  if (filters.location) {
    params.append('location', filters.location);
  }
  
  params.append('limit', limit.toString());
 
  const response = await fetch(`${API_BASE_URL}/search?${params}`);
  
  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }

  return response.json();
}

// Get filter options from the backend
export async function getFilterOptions(): Promise<FilterOptions> {
  const response = await fetch(`${API_BASE_URL}/filters`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch filter options: ${response.statusText}`);
  }
  
  return response.json();
}

// Health check for the backend
export async function healthCheck(): Promise<{ status: string; total_startups: number; message: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }
  
  return response.json();
}