import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { format, subDays } from "date-fns";
import { useAuth } from "../../contexts/AuthContext";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import FooterAndNavbar from "../../FooterAndNavbar/FooterAndNavbar";
import GroupHeader from "./GroupHeader";
import MembersList from "./MembersList";
import GroupLeaderBoard from "./GroupLeaderBoard";
import ProgressChart from "./ProgressChart";

export default function GroupHabitPage() {
  const { groupId } = useParams();
  const { currentUser } = useAuth();
  const [groupData, setGroupData] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [memberDetails, setMemberDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const firestoreDb = getFirestore();

    const groupRef = ref(db, `groupHabits/${groupId}`);
    const unsubscribeGroup = onValue(groupRef, async (snapshot) => {
      const data = snapshot.val();
      console.log("Fetched group data:", data); // Log fetched data
      if (data) {
        setGroupData(data);

        const memberIds = [
          ...(data.participants || []),
          ...(data.pendingParticipants || []),
        ];
        const memberPromises = memberIds.map(async (memberId) => {
          const userDoc = await getDoc(doc(firestoreDb, "users", memberId));
          return [memberId, userDoc.data()];
        });

        const memberDetailsMap = Object.fromEntries(
          await Promise.all(memberPromises)
        );
        setMemberDetails(memberDetailsMap);

        const leaderboardData = Object.entries(data.memberProgress || {})
          .map(([memberId, progress]) => {
            const totalProgress = Object.values(progress || {}).reduce(
              (sum, day) => sum + (day.progress || 0),
              0
            );
            return {
              memberId,
              totalProgress,
              name: memberDetailsMap[memberId]?.displayName || "Anonymous",
            };
          })
          .sort((a, b) => b.totalProgress - a.totalProgress);
        setLeaderboard(leaderboardData);

        setLoading(false);
      } else {
        console.log("No data found for groupHabits");
        setLoading(false);
      }
    });

    const invitesRef = ref(db, `users/${currentUser.uid}/groupHabitInvites`);
    const unsubscribeInvites = onValue(invitesRef, (snapshot) => {
      const invites = [];
      snapshot.forEach((child) => {
        invites.push({ id: child.key, ...child.val() });
      });
      setPendingInvites(
        invites.filter((invite) => invite.status === "pending")
      );
    });

    return () => {
      unsubscribeGroup();
      unsubscribeInvites();
    };
  }, [groupId, currentUser]);

  useEffect(() => {
    if (selectedMember && groupData?.memberProgress?.[selectedMember]) {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = format(subDays(new Date(), i), "yyyy-MM-dd");
        const progress =
          groupData.memberProgress[selectedMember][date]?.progress || 0;
        return {
          date,
          progress,
          target: groupData.target,
        };
      }).reverse();

      setProgressData(last7Days);
    }
  }, [selectedMember, groupData]);

  const handleInviteResponse = async (inviteId, accept) => {
    const db = getDatabase();
    const updates = {};
    updates[`users/${currentUser.uid}/groupHabitInvites/${inviteId}/status`] =
      accept ? "accepted" : "rejected";

    if (accept) {
      updates[`groupHabits/${groupId}/participants/${currentUser.uid}`] = true;
      updates[`groupHabits/${groupId}/pendingParticipants/${currentUser.uid}`] =
        null;
    }

    await update(ref(db), updates);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6">
        Loading ....
        <FooterAndNavbar/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <FooterAndNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          <GroupHeader groupData={groupData} memberDetails={memberDetails} />

          {pendingInvites.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-orange-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Clock className="text-orange-500" size={24} />
                Pending Invites
              </h2>
              <div className="grid gap-4">
                {pendingInvites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between p-4 bg-orange-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {invite.habitName}
                      </p>
                      <p className="text-gray-600">From: {invite.fromName}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleInviteResponse(invite.id, true)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                      >
                        <CheckCircle size={24} />
                      </button>
                      <button
                        onClick={() => handleInviteResponse(invite.id, false)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      >
                        <XCircle size={24} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <MembersList
            groupData={groupData}
            selectedMember={selectedMember}
            setSelectedMember={setSelectedMember}
            memberDetails={memberDetails}
          />

          <ProgressChart progressData={progressData} memberDetails={memberDetails} selectedMember={selectedMember } />
          
        </div>

      <GroupLeaderBoard leaderboard={leaderboard} groupData={groupData} />
      </div>
    </div>
  );
}
