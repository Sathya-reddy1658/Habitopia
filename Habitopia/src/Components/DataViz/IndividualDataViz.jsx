import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';

const IndividualDataViz = () => {
  const location = useLocation();
  const { habitId } = useParams();
  const { currentUser } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [habit, setHabit] = useState(location.state?.habit);
  const isGroupHabit = habitId.startsWith('group_');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isGroupHabit) {
          const db = getDatabase();
          const groupRef = ref(db, `groupHabits/${habitId}`);
          
          onValue(groupRef, (snapshot) => {
            const groupData = snapshot.val();
            if (!groupData) return;

            const last7Days = Array.from({ length: 7 }, (_, i) => {
              const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
              const memberProgress = groupData.memberProgress?.[currentUser.uid]?.[date];
              return {
                date,
                progress: memberProgress?.progress || 0,
                target: groupData.target
              };
            }).reverse();

            setProgressData(last7Days);
            if (!habit) {
              setHabit({
                habitName: groupData.groupName,
                target: groupData.target,
                metricUnit: groupData.metricUnit
              });
            }
            setLoading(false);
          });
        } else {
          // Fetch individual habit data from Firestore
          const db = getFirestore();
          const progressRef = collection(db, "users", currentUser.uid, "habits", habitId, "dailyProgress");
          const snapshot = await getDocs(progressRef);
          
          const progressByDate = {};
          snapshot.forEach(doc => {
            progressByDate[doc.id] = doc.data();
          });

          const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
            return {
              date,
              progress: progressByDate[date]?.progress || 0,
              target: habit?.target
            };
          }).reverse();

          setProgressData(last7Days);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching progress data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [habitId, currentUser, habit, isGroupHabit]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {habit?.habitName} Progress
          </h1>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'MMM d')}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => format(new Date(date), 'MMMM d, yyyy')}
                  formatter={(value) => [`${value} ${habit?.metricUnit}`, 'Progress']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="progress" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#9CA3AF" 
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualDataViz;