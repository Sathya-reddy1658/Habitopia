import { Award, Trophy } from 'lucide-react'
import React from 'react'

function GroupLeaderBoard({leaderboard,groupData}) {
  return (
    <div>
        <div className="bg-white rounded-lg shadow-2xl p-8 border border-yellow-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Trophy className="text-yellow-500" size={24} />
            Leaderboard
          </h2>
          <div className="grid gap-4">
            {leaderboard.map((member, index) => (
              <div
                key={member.memberId}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0
                    ? "bg-yellow-50"
                    : index === 1
                    ? "bg-gray-50"
                    : index === 2
                    ? "bg-orange-50"
                    : "bg-white border border-gray-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-500"
                        : index === 2
                        ? "bg-orange-500"
                        : "bg-blue-100"
                    } text-white font-bold text-lg`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-500">
                      Total: {member.totalProgress} {groupData.metricUnit}
                    </p>
                  </div>
                </div>
                {index < 3 && (
                  <Award
                    size={28}
                    className={
                      index === 0
                        ? "text-yellow-500"
                        : index === 1
                        ? "text-gray-500"
                        : "text-orange-500"
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}

export default GroupLeaderBoard
