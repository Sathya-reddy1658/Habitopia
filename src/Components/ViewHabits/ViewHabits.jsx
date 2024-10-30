import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc,
  getDoc 
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { Target, Trash2, Edit2 } from 'lucide-react';

export default function ViewHabits({ selectedDate }) {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTarget, setNewTarget] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const db = getFirestore();

  useEffect(() => {
    if (currentUser) {
      fetchHabits();
    }
  }, [currentUser]);

  const fetchHabits = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const habitsRef = collection(db, "users", currentUser.uid, "habits");
      const snapshot = await getDocs(habitsRef);
      const userHabits = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHabits(userHabits);
    } catch (error) {
      console.error("Error fetching habits:", error);
      alert("Failed to fetch habits. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTarget = async () => {
    if (!selectedHabit || !newTarget || isNaN(newTarget) || Number(newTarget) <= 0) {
      alert("Please enter a valid target number greater than 0");
      return;
    }
    
    try {
      setUpdating(true);
      const habitRef = doc(db, "users", currentUser.uid, "habits", selectedHabit.id);
      const habitDoc = await getDoc(habitRef);
      
      if (!habitDoc.exists()) {
        alert("Unable to find the habit. Please try again.");
        await fetchHabits();
        setIsModalOpen(false);
        return;
      }

      await updateDoc(habitRef, {
        target: Number(newTarget)
      });
      
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit.id === selectedHabit.id 
            ? { ...habit, target: Number(newTarget) } 
            : habit
        )
      );
      
      setIsModalOpen(false);
      setNewTarget("");
      alert("Target updated successfully!");
    } catch (error) {
      console.error("Error updating target:", error);
      alert("Failed to update target. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (!currentUser || !window.confirm("Are you sure you want to delete this habit?")) return;

    try {
      setDeleting(true);
      const habitRef = doc(db, "users", currentUser.uid, "habits", habitId);
      const habitDoc = await getDoc(habitRef);
      
      if (!habitDoc.exists()) {
        alert("Unable to find the habit. Please try again.");
        await fetchHabits();
        return;
      }

      await deleteDoc(habitRef);
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
      alert("Habit deleted successfully!");
    } catch (error) {
      console.error("Error deleting habit:", error);
      alert("Failed to delete habit. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">Loading habits...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Your Habits</h1>
          </div>
          <p className="text-gray-600">
            Manage and track your habits to build a better routine
          </p>
        </div>

        {habits.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-center">No habits found. Start by adding a new habit!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map(habit => (
              <div key={habit.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedHabit(habit);
                        setNewTarget(habit.target.toString());
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      disabled={updating}
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      disabled={deleting}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{habit.habitName}</h3>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Target: </span>
                  <span className="ml-2">{habit.target} {habit.metricUnit}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && selectedHabit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-w-full">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Update Target for {selectedHabit.habitName}
              </h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">New Target ({selectedHabit.metricUnit})</label>
                <input
                  type="number"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new target"
                  disabled={updating}
                />
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleUpdateTarget}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update Target"}
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewTarget("");
                  }}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  disabled={updating}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}