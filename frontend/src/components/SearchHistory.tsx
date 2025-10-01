
import { Clock} from 'lucide-react';
interface SearchHistoryProps {
  history: string[];
  onHistoryItemClick: (query: string) => void;
  onClearHistory: () => void;

}

export default function SearchHistory({ history, onHistoryItemClick, onClearHistory}: SearchHistoryProps) {
  if (history.length === 0) return null;
  
  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Recent Searches</span>
          </div>
          <button
            onClick={onClearHistory}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Clear all
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {history.slice(0, 5).map((query, index) => (
            <button
              key={index}
              onClick={() => onHistoryItemClick(query)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors duration-200 flex items-center gap-2"
            >
              {query}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}