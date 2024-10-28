import React from 'react';
import { Search, UserPlus } from 'lucide-react';
import EmptyState from './EmptyState';

export default function SearchSection({ 
  searchInput, 
  setSearchInput, 
  searchUser, 
  searchResults, 
  showSearchResults, 
  sendRequest 
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search by name or friend ID..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-grow placeholder:text-sm px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={searchUser}
          className="sm:px-6 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {showSearchResults && searchResults.length > 0 && (
        <div className="mt-4 space-y-2">
          {searchResults.map((result) => (
            <div
              key={result.uid}
              className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg"
            >
              <div>
                <p className="font-semibold text-indigo-900">{result.displayName}</p>
                <p className="text-sm text-indigo-600">ID: {result.fid}</p>
              </div>
              <button
                onClick={() => sendRequest(result.uid, result.displayName)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showSearchResults && searchResults.length === 0 && (
        <EmptyState
          icon={Search}
          message="No users found matching your search"
        />
      )}
    </div>
  );
}