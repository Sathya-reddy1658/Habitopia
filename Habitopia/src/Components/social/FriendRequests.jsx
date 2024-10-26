import React from 'react';
import { UserCheck, UserX, UserPlus } from 'lucide-react';
import EmptyState from './EmptyState';

export default function FriendRequests({ requests, onAccept, onReject }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Incoming Requests</h2>
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.uid} 
              className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg"
            >
              <p className="font-semibold text-indigo-900">{request.displayName}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => onAccept(request.uid)} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >

                  <UserCheck className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onReject(request.uid)} 
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <UserX className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={UserPlus}
          message="No pending friend requests"
        />
      )}
    </div>
  );
}
