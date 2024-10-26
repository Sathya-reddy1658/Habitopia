import { Target, Users } from 'lucide-react'
import React from 'react'

function GroupHeader({groupData,memberDetails}) {
  return (
        <div className="bg-white rounded-lg shadow-xl p-8 border border-blue-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{groupData.emoji}</div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {groupData.habitName}
                  </h1>
                  <p className="text-gray-500">Created by {memberDetails[groupData.creatorId]?.displayName}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                  <Users className="text-blue-500" size={20} />
                  <span className="text-blue-700 font-semibold">
                    {Object.keys(groupData.participants || {}).length} members
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                  <Target className="text-green-500" size={20} />
                  <span className="text-green-700 font-semibold">
                    {groupData.target} {groupData.metricUnit}
                  </span>
                </div>
              </div>
            </div>
          </div>
  )
}

export default GroupHeader
