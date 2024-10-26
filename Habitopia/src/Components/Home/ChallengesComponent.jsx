import React from 'react';

const ChallengesComponent = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 my-4">
      <h3 className="text-xl font-semibold mb-3 text-gray-800">Challenges</h3>
      <div className="bg-indigo-50 p-4 rounded-md">
        <p className="font-bold text-indigo-800">Best Runners! 🏃</p>
        <p className="text-sm text-indigo-600">5 days 13 hours left</p>
        <p className="text-sm text-indigo-600">2 friends joined</p>
      </div>
    </div>
  );
};

export default ChallengesComponent;