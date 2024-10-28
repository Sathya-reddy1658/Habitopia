import React, { useEffect, useState } from 'react';
import { format, isToday, startOfDay } from 'date-fns';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, increment } from "firebase/firestore";
import { getDatabase, ref, get, set } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";
import HabitCard from './HabitCard';

const HabitsComponent = ({ selectedDate }) => {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempProgress, setTempProgress] = useState(0);

  const db = getFirestore();
  const realtimeDb = getDatabase();

  useEffect(() => {
    fetchHabitsWithProgress();
  }, [currentUser, selectedDate]);

  const fetchHabitsWithProgress = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      const habitsRef = collection(db, "users", currentUser.uid, "habits");
      const snapshot = await getDocs(habitsRef);
      const regularHabits = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt)
      }));
      
      const groupHabitsRef = ref(realtimeDb, 'groupHabits');
      const groupHabitsSnapshot = await get(groupHabitsRef);
      const groupHabitsData = groupHabitsSnapshot.val() || {};
      
      const userGroupHabits = Object.entries(groupHabitsData)
        .filter(([_, habit]) => 
          habit.members?.[currentUser.uid]?.status === 'accepted'
        )
        .map(([id, habit]) => ({
          id,
          ...habit,
          isGroupHabit: true,
          createdAt: new Date(habit.createdAt)
        }));

      const allHabits = [
        ...regularHabits,
        ...userGroupHabits.filter(gh => 
          !regularHabits.some(rh => rh.id === gh.id)
        )
      ];

      const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
      const habitsWithProgress = await Promise.all(
        allHabits
          .filter(habit => startOfDay(habit.createdAt) <= startOfDay(selectedDate))
          .map(async (habit) => {
            const progressRef = doc(db, "users", currentUser.uid, "habits", habit.id, "dailyProgress", selectedDateStr);
            const progressDoc = await getDoc(progressRef);
            
            if (progressDoc.exists()) {
              return {
                ...habit,
                ...progressDoc.data()
              };
            }

            if (isToday(selectedDate)) {
              await initializeProgress(habit.id, selectedDateStr, habit.isGroupHabit);
            }

            return {
              ...habit,
              progress: 0,
              completed: false
            };
          })
      );

      setHabits(habitsWithProgress);
    } catch (error) {
      console.error("Error fetching habits:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeProgress = async (habitId, dateStr, isGroupHabit) => {
    const progressData = { progress: 0, completed: false };
    
    await setDoc(
      doc(db, "users", currentUser.uid, "habits", habitId, "dailyProgress", dateStr),
      progressData
    );

    if (isGroupHabit) {
      await set(
        ref(realtimeDb, `groupHabits/${habitId}/memberProgress/${currentUser.uid}/${dateStr}`),
        {
          ...progressData,
          updatedAt: new Date().toISOString()
        }
      );
    }
  };

  const updateHabitProgress = async () => {
    if (!selectedHabit || !isToday(selectedDate)) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const completed = tempProgress >= selectedHabit.target;

    try {
      await setDoc(
        doc(db, "users", currentUser.uid, "habits", selectedHabit.id, "dailyProgress", dateStr),
        { progress: tempProgress, completed },
        { merge: true }
      );

      if (selectedHabit.isGroupHabit) {
        await set(
          ref(realtimeDb, `groupHabits/${selectedHabit.id}/memberProgress/${currentUser.uid}/${dateStr}`),
          {
            progress: tempProgress,
            completed,
            updatedAt: new Date().toISOString()
          }
        );
      }

      const scoreIncrement = !selectedHabit.firstTimeCompleted && completed ? 69 : completed ? 13 : 0;
      
      if (scoreIncrement > 0) {
        await Promise.all([
          setDoc(
            doc(db, "users", currentUser.uid, "habits", selectedHabit.id),
            { score: increment(scoreIncrement), firstTimeCompleted: true },
            { merge: true }
          ),
          setDoc(
            doc(db, "users", currentUser.uid),
            { totalScore: increment(scoreIncrement) },
            { merge: true }
          )
        ]);
      }

      setHabits(habits.map(h =>
        h.id === selectedHabit.id
          ? { ...h, progress: tempProgress, completed }
          : h
      ));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleSliderChange = (e) => {
    if (e.target.value >= selectedHabit.progress) {
      setTempProgress(Number(e.target.value));
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-900">
          Habits for {format(selectedDate, 'MMMM d, yyyy')}
        </h2>
       
      </div>

      {habits.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">No habits for this date.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedHabit(habit);
                setTempProgress(habit.progress || 0);
                setIsModalOpen(true);
              }}
              isEditable={isToday(selectedDate)}
            />
          ))}
        </div>
      )}

      {isModalOpen && selectedHabit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            {selectedHabit.completed ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Congratulations! 🎉
                </h2>
                <p className="text-gray-700">
                  You have achieved your target for {selectedHabit.habitName}!
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedHabit.habitName}
                </h2>
                {selectedHabit.hasMetric === "yes" && (
                  <div>
                    <p className="text-gray-700">
                      Current progress: {tempProgress} / {selectedHabit.target} {selectedHabit.metricUnit}
                    </p>
                    <input
                      type="range"
                      min="0"
                      max={selectedHabit.target}
                      value={tempProgress}
                      onChange={handleSliderChange}
                      className="w-full mt-2"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <button
                    onClick={updateHabitProgress}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Update Progress
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitsComponent;