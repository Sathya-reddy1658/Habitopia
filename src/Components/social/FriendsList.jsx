import React, { useState } from 'react';
import { Activity, UserX, Users, Award, Clock } from 'lucide-react';
import EmptyState from './EmptyState';

export default function FriendsList({ friends, onViewProfile, onRemoveFriend }) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleRemoveClick = (friend) => {
    setSelectedFriend(friend);
    setShowConfirmDialog(true);
  };

  const handleConfirmRemove = () => {
    if (selectedFriend) {
      onRemoveFriend(selectedFriend.uid);
    }
    setShowConfirmDialog(false);
    setSelectedFriend(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Your Friends</h2>
      {friends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <div
              key={friend.uid}
              className="bg-indigo-50 rounded-lg p-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-indigo-900">{friend.displayName}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewProfile(friend.uid)}
                    className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                    title="View Activity"
                  >
                    <Activity className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveClick(friend)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    title="Remove Friend"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-sm text-indigo-600">
                  <Award className="w-4 h-4 mr-2" />
                  <span>{friend.habitCount || 0} habits</span>
                </div>
                <div className="flex items-center text-sm text-indigo-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{friend.streak || 0} day streak</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          message="No friends added yet. Start by searching for friends!"
        />
      )}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 transform transition-all duration-300 scale-100"
          >
           
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove {selectedFriend?.displayName} from your friends list?
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove Friend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}