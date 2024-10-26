import { Clock, Crown, Users } from 'lucide-react'
import React from 'react'

function MembersList({groupData,memberId,setSelectedMember,memberDetails,selectedMember}) {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-xl p-8 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Users className="text-blue-500" size={24} />
                Members
              </h2>
              <div className="space-y-4">
                {Object.entries(groupData.participants || {}).map(([memberId]) => (
                  <button
                    key={memberId}
                    onClick={() => setSelectedMember(memberId)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                      selectedMember === memberId
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        {memberDetails[memberId]?.displayName || 'Anonymous'}
                      </span>
                      {memberId === groupData.creatorId && (
                        <Crown className={`${
                          selectedMember === memberId ? 'text-white' : 'text-yellow-500'
                        }`} size={20} />
                      )}
                    </div>
                  </button>
                ))}
                
                {Object.entries(groupData.pendingParticipants || {}).map(([memberId]) => (
                  <div
                    key={memberId}
                    className="w-full p-4 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">
                        {memberDetails[memberId]?.displayName || 'Anonymous'}
                      </span>
                      <span className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full flex items-center gap-2">
                        <Clock size={14} />
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>  
    </div>
  )
}

export default MembersList
