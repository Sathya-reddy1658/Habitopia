import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update, remove } from 'firebase/database';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Check, X, Users, Bell, Calendar, Target, Clock, ArrowLeft } from 'lucide-react';
import FooterAndNavbar from '../FooterAndNavbar/FooterAndNavbar';
import { useNavigate } from 'react-router-dom';

const GroupHabitInvites = () => {
  const { currentUser } = useAuth();
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingInvites, setProcessingInvites] = useState({});
  const navigate = useNavigate();
  const db = getFirestore();
  const realtimeDb = getDatabase();

  useEffect(() => {
    if (!currentUser) return;

    const invitesRef = ref(realtimeDb, `users/${currentUser.uid}/groupHabitInvites`);

    const unsubscribe = onValue(invitesRef, (snapshot) => {
      try {
        const invitesData = snapshot.val();
        if (invitesData) {
          const invitesArray = Object.entries(invitesData)
            .map(([key, value]) => ({
              id: key,
              ...value
            }))
            .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
          setInvites(invitesArray);
        } else {
          setInvites([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading invites:', err);
        setError('Failed to load invites');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleAcceptInvite = async (invite) => {
    if (!currentUser) return;
    setProcessingInvites(prev => ({ ...prev, [invite.id]: 'accepting' }));

    try {
      const habitDetails = invite.habitDetails;
      const habitRef = doc(collection(db, "users", currentUser.uid, "habits"));
      await setDoc(habitRef, {
        ...habitDetails,
        isGroupHabit: true,
        groupId: habitDetails.id,
        joinedAt: new Date().toISOString()
      });

      const groupHabitRef = ref(realtimeDb, `groupHabits/${habitDetails.id}/members/${currentUser.uid}`);
      await update(groupHabitRef, {
        status: 'accepted',
        joinedAt: new Date().toISOString()
      });

      await remove(ref(realtimeDb, `users/${currentUser.uid}/groupHabitInvites/${invite.id}`));
      await update(ref(realtimeDb, `groupHabits/${habitDetails.id}/pendingInvites/${currentUser.uid}`), {
        status: 'accepted',
        respondedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error accepting invite:', error);
      setError('Failed to accept invite');
    } finally {
      setProcessingInvites(prev => ({ ...prev, [invite.id]: undefined }));
    }
  };

  const handleRejectInvite = async (invite) => {
    if (!currentUser) return;
    setProcessingInvites(prev => ({ ...prev, [invite.id]: 'rejecting' }));

    try {
      await update(ref(realtimeDb, `groupHabits/${invite.habitDetails.id}/pendingInvites/${currentUser.uid}`), {
        status: 'rejected',
        respondedAt: new Date().toISOString()
      });
      await remove(ref(realtimeDb, `users/${currentUser.uid}/groupHabitInvites/${invite.id}`));
    } catch (error) {
      console.error('Error rejecting invite:', error);
      setError('Failed to reject invite');
    } finally {
      setProcessingInvites(prev => ({ ...prev, [invite.id]: undefined }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        Loading...
        <FooterAndNavbar />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 sm:mt-20 mb-6">
        <button onClick={() => navigate(-1)} className="p-2  bg-indigo-100 hover:bg-indigo-200 rounded-full">
          <ArrowLeft className="w-6 h-6 text-indigo-600" />
        </button>
        <Bell className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold text-indigo-900">Group Habit Invites</h2>
      </div>
      <FooterAndNavbar />
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {invites.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-sm border border-indigo-100">
          <div className="text-center p-12">
            <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-indigo-900 mb-2">No Pending Invites</h3>
            <p className="text-gray-600">You're all caught up! Check back later for new group habit invitations.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {invites.map((invite) => (
            <div
              key={invite.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-indigo-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-indigo-900">
                        {invite.habitDetails.habitName}
                      </h3>
                      <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full">
                        Group Habit
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{invite.habitDetails.groupName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{invite.habitDetails.freq}</span>
                      </div>
                      {invite.habitDetails.hasMetric === "yes" && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Target className="w-4 h-4" />
                          <span className="text-sm">
                            {invite.habitDetails.target} {invite.habitDetails.metricUnit}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(invite.sentAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {invite.fromName.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        Invited by <span className="font-medium">{invite.fromName}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptInvite(invite)}
                      disabled={processingInvites[invite.id]}
                      className={`p-2 rounded-full transition-colors duration-200 ${processingInvites[invite.id] === 'accepting'
                          ? 'bg-green-100 cursor-wait'
                          : 'bg-green-100 hover:bg-green-200 text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                        }`}
                      title="Accept invite"
                    >
                      {processingInvites[invite.id] === 'accepting' ? (
                        <div className="w-5 h-5 border-2 border-t-green-600 border-green-200 rounded-full animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleRejectInvite(invite)}
                      disabled={processingInvites[invite.id]}
                      className={`p-2 rounded-full transition-colors duration-200 ${processingInvites[invite.id] === 'rejecting'
                          ? 'bg-red-100 cursor-wait'
                          : 'bg-red-100 hover:bg-red-200 text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                        }`}
                      title="Decline invite"
                    >
                      {processingInvites[invite.id] === 'rejecting' ? (
                        <div className="w-5 h-5 border-2 border-t-red-600 border-red-200 rounded-full animate-spin" />
                      ) : (
                        <X className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupHabitInvites;