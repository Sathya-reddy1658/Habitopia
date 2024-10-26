import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';

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
    e.preventDefault();
    try {
      const dateProgressRef = doc(db, 'users', currentUser.uid, 'habits', habitId, 'dailyProgress', selectedDate);
      const dateProgressSnap = await getDoc(dateProgressRef);
  
      let scoreToAdd = 0;
      if (!dateProgressSnap.exists()) {
        // First progress entry for the date
        scoreToAdd = 69;
      } else {
        // Subsequent progress entry for the date
        scoreToAdd = 13;
      }
  
      // Fetch the user's current score
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const userCurrentScore = userData.score || 0;
  
      // Fetch the habit's current score
      const habitRef = doc(db, 'users', currentUser.uid, 'habits', habitId);
      const habitSnap = await getDoc(habitRef);
      const habitData = habitSnap.data();
      const habitCurrentScore = habitData.score || 0;
  
      // Update the user's score in Firestore
      await updateDoc(userRef, {
        score: userCurrentScore + scoreToAdd // Update user's total score
      });
  
      // Update habit score in Firestore
      await updateDoc(habitRef, {
        score: habitCurrentScore + scoreToAdd // Update habit's total score
      });
  
      // Save the progress for the day and the score achieved for the day in dailyProgress
      await setDoc(dateProgressRef, {
        progress: progressValue,
        completed: completedCheckbox,
        date: selectedDate,
        score: scoreToAdd,  // Store the score achieved on that day
        timestamp: new Date().toISOString()
      }, { merge: true });
  
      alert('Progress and scores updated successfully!');
  
      setHabit(prevHabit => ({
        ...prevHabit,
        progress: progressValue,
        score: habitCurrentScore + scoreToAdd // Update habit score in local state
      }));
  
    } catch (err) {
      console.error('Error updating progress and scores:', err);
      setError('Failed to update progress and scores');
    }
  };
  
  if (loading) {
    return <div className="text-center p-4">Loading habit data...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  const isTargetReached = habit && progressValue >= habit.target;

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-10 backdrop-filter rounded-xl p-6 shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white mb-2">{habit?.habitName}</h1>
          <p className="text-indigo-200">Update Your Progress</p>
        </div>
  
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="progressValue" className="sr-only">Progress ({habit?.metricUnit})</label>
              <input
                type="number"
                id="progressValue"
                value={progressValue}
                onChange={(e) => setProgressValue(Number(e.target.value))}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={`Progress (${habit?.metricUnit})`}
                required
                min="0"
              />
            </div>
          </div>
  
          <div className="flex items-center">
            <input
              type="checkbox"
              id="completed"
              checked={completedCheckbox}
              onChange={(e) => setCompletedCheckbox(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="completed" className="ml-2 block text-sm text-white">
              I made progress today!
            </label>
          </div>
  
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Progress
            </button>
          </div>
        </form>
  
        {isTargetReached && (
          <div className="mt-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-md p-4">
            <p className="text-green-300 font-bold text-center">Congratulations! You've reached your target! 🎉</p>
          </div>
        )}
  
        <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4">
          <p className="text-indigo-100 text-center">
            Current Progress: <span className="font-bold text-white">{progressValue}</span> / {habit?.target} {habit?.metricUnit}
          </p>
        </div>
  
        <div className="mt-6">
          <button 
            onClick={() => navigate('/home')} 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Habits
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateHabit;
