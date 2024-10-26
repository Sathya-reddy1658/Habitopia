import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';
import { ArrowLeft, Trophy, Target } from 'lucide-react';

const db = getFirestore();

function UpdateHabit() {
  const { habitId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [progressValue, setProgressValue] = useState(0);
  const [completedCheckbox, setCompletedCheckbox] = useState(false);

  // Keeping all your existing useEffect and handlers the same
  useEffect(() => {
    const fetchHabitData = async () => {
      if (currentUser && habitId) {
        try {
          const habitRef = doc(db, 'users', currentUser.uid, 'habits', habitId);
          const habitSnap = await getDoc(habitRef);

          if (habitSnap.exists()) {
            const habitData = habitSnap.data();
            setHabit(habitData);
            setProgressValue(habitData.progress || 0);

            const dateProgressRef = doc(db, 'users', currentUser.uid, 'habits', habitId, 'progress', selectedDate);
            const dateProgressSnap = await getDoc(dateProgressRef);
            
            if (dateProgressSnap.exists()) {
              const dateProgressData = dateProgressSnap.data();
              setProgressValue(dateProgressData.progress || 0);
              setCompletedCheckbox(dateProgressData.completed || false);
            }
          } else {
            setError('Habit not found');
          }
        } catch (err) {
          console.error('Error fetching habit data:', err);
          setError('Failed to fetch habit data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHabitData();
  }, [currentUser, habitId, selectedDate]);

  const handleSubmit = async (e) => {
    // Keeping your existing submit handler the same
    e.preventDefault();
    try {
      const dateProgressRef = doc(db, 'users', currentUser.uid, 'habits', habitId, 'dailyProgress', selectedDate);
      const dateProgressSnap = await getDoc(dateProgressRef);
  
      let scoreToAdd = 0;
      if (!dateProgressSnap.exists()) {
        scoreToAdd = 69;
      } else {
        scoreToAdd = 13;
      }
  
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const userCurrentScore = userData.score || 0;
  
      const habitRef = doc(db, 'users', currentUser.uid, 'habits', habitId);
      const habitSnap = await getDoc(habitRef);
      const habitData = habitSnap.data();
      const habitCurrentScore = habitData.score || 0;
  
      await updateDoc(userRef, {
        score: userCurrentScore + scoreToAdd
      });
  
      await updateDoc(habitRef, {
        score: habitCurrentScore + scoreToAdd });
  
      await setDoc(dateProgressRef, {
        progress: progressValue,
        completed: completedCheckbox,
        date: selectedDate,
        score: scoreToAdd,
        timestamp: new Date().toISOString()
      }, { merge: true });
  
      alert('Progress and scores updated successfully!');
  
      setHabit(prevHabit => ({
        ...prevHabit,
        progress: progressValue,
        score: habitCurrentScore + scoreToAdd 
      }));
  
    } catch (err) {
      console.error('Error updating progress and scores:', err);
      setError('Failed to update progress and scores');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-gray-500">Loading habit data...</p>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-red-500">Error: {error}</p>
    </div>;
  }

  const isTargetReached = habit && progressValue >= habit.target;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/home')} 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{habit?.habitName}</h1>
            <p className="text-gray-500 text-sm">Update your progress</p>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-gray-600">Today's Progress</span>
            </div>
            {isTargetReached && (
              <Trophy className="w-5 h-5 text-yellow-500" />
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="number"
                value={progressValue}
                onChange={(e) => setProgressValue(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Enter progress in ${habit?.metricUnit}`}
                min="0"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Target: {habit?.target} {habit?.metricUnit}
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="completed"
                checked={completedCheckbox}
                onChange={(e) => setCompletedCheckbox(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="completed" className="ml-2 text-sm text-gray-600">
                Mark as completed for today
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
            >
              Save Progress
            </button>
          </form>
        </div>

        {/* Progress Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Current Progress</p>
            <p className="font-semibold text-gray-900">
              {progressValue} / {habit?.target} {habit?.metricUnit}
            </p>
          </div>
          
          {isTargetReached && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-green-700 text-sm font-medium">
                🎉 Congratulations! You've reached your target!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateHabit;