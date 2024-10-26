import React, { useEffect, useState } from 'react';
import FooterAndNavbar from '../FooterAndNavbar/FooterAndNavbar';
import { useAuth } from '../contexts/AuthContext';
import Logout from '../Auth/Logout';
import { Link } from 'react-router-dom';
import { PlusCircle, TrendingUp, Clipboard } from 'lucide-react';
import { doc, getDoc, getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebase/firebaseConfig';
import sc1 from '../../../public/sc1.png';
import sc2 from '../../../public/sc2.png';
import sc3 from '../../../public/sc3.png';

function Profile() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [habits, setHabits] = useState([]);
  const [scoreBadge, setScoreBadge] = useState(0);
  const [completeBadge, setCompleteBadge] = useState(0);
  const db = getFirestore(app);

  useEffect(() => {
    async function fetchUserData() {
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists()) {
            setUserData(userSnapshot.data());
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
    }
    fetchUserData();

    async function fetchHabits() {
      if (currentUser) {
        try {
          const habitsRef = collection(db, 'users', currentUser.uid, 'habits');
          const snapshot = await getDocs(habitsRef);
          const habitsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setHabits(habitsData);
        } catch (error) {
          console.error("Error fetching habits:", error);
        }
      }
    }
    fetchHabits();
  }, [currentUser, db]);

  useEffect(() => {
    if (userData) {
      const score = userData.totalScore;
      setScoreBadge(score >= 1000 ? 3 : score >= 500 ? 2 : score >= 100 ? 1 : 0);
      setCompleteBadge(habits.filter((habit) => habit.bestStreak >= 1).length);
    }
  }, [userData, habits]);

  const handleCopy = async () => {
    if (userData && userData.fid) {
      try {
        await navigator.clipboard.writeText(userData.fid);
        console.log('FID copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-indigo-700 via-indigo-600 to-indigo-800 min-h-screen text-white flex flex-col items-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-indigo-700 rounded-2xl p-8 shadow-2xl mb-10 transition transform hover:scale-105">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img src={currentUser.photoURL} className="rounded-full w-24 h-24 shadow-lg" alt="User" />
            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-extrabold text-white">Hello, {currentUser.displayName || "User"}</h1>
              <p className="text-indigo-200 mt-2">Welcome back to your habit journey!</p>
              {userData && (
                <div className="mt-3 w-full flex items-center justify-center sm:justify-start gap-2">
                  <p className="text-md">Your FID: {userData.fid}</p>
                  <Clipboard
                    className="cursor-pointer w-5 h-5 text-white hover:text-indigo-300 transition"
                    onClick={handleCopy}
                  />
                </div>
              )}
              <div className="mt-5 flex items-center justify-center gap-2">
                {scoreBadge >= 1 && <img src={sc1} className="w-10 h-10 shadow-md rounded-full" alt="Badge 1" />}
                {scoreBadge >= 2 && <img src={sc2} className="w-10 h-10 shadow-md rounded-full" alt="Badge 2" />}
                {scoreBadge >= 3 && <img src={sc3} className="w-10 h-10 shadow-md rounded-full" alt="Badge 3" />}
              </div>
              <h2 className="mt-2 text-indigo-300">Completions Badge: {completeBadge}</h2>
            </div>
            <Logout />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/newHabit">
            <QuickActionCard title="New Habit" icon={<PlusCircle className="w-8 h-8" />} />
          </Link>
          <Link to="/dataViz">
            <QuickActionCard title="View Habits" icon={<TrendingUp className="w-8 h-8" />} />
          </Link>
        </div>
      </div>

      <FooterAndNavbar />
    </div>
  );
}

function QuickActionCard({ title, icon }) {
  return (
    <div className="bg-white/10 rounded-xl p-6 flex items-center justify-between h-32 hover:bg-white/20 transition duration-300 shadow-lg transform hover:scale-105">
      <span className="text-lg font-semibold text-white">{title}</span>
      <div className="text-indigo-200">{icon}</div>
    </div>
  );
}

export default Profile;
