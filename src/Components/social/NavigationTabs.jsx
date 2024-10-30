import React, { useEffect } from 'react';
import { Users, UserPlus } from 'lucide-react';

export default function NavigationTabs({ 
  activeTab, 
  setActiveTab, 
  incomingRequestsCount,
  hasNewRequests 
}) 
{
  useEffect(() => {
    if (hasNewRequests && activeTab !== 'requests') {
      const button = document.querySelector('#requestsButton');
      button?.classList.add('animate-bounce');
      setTimeout(() => {
        button?.classList.remove('animate-bounce');
      }, 1000);
    }
  }, [hasNewRequests, activeTab]);

  return (
    <div className="flex space-x-4 mb-8">
      <button
        onClick={() => setActiveTab('friends')}
        className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
          activeTab === 'friends'
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'bg-white text-indigo-600 hover:bg-indigo-50'
        }`}
      >
        <Users className="w-5 h-5" />
        <span>Friends</span>
      </button>
      <button
        id="requestsButton"
        onClick={() => setActiveTab('requests')}
        className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
          activeTab === 'requests'
            ? 'bg-indigo-600 text-white shadow-lg'
            : 'bg-white text-indigo-600 hover:bg-indigo-50'
        }`}
      >
        <UserPlus className="w-5 h-5" />
        <span>Requests</span>
        {incomingRequestsCount > 0 && (
          <span className={`bg-red-500 text-white text-xs rounded-full px-2 py-1 ${
            hasNewRequests && activeTab !== 'requests' ? 'animate-pulse' : ''
          }`}>
            {incomingRequestsCount}
          </span>
        )}
      </button>
    </div>
  );
}