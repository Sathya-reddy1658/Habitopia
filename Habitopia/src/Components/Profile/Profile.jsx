import React, { useEffect, useState } from 'react';
import FooterAndNavbar from '../FooterAndNavbar/FooterAndNavbar';
import { useAuth } from '../contexts/AuthContext';
import Logout from '../Auth/Logout';
import { Link } from 'react-router-dom';
import { UserCircle, TrendingUp, Award, PlusCircle, Settings, Clipboard } from 'lucide-react';
import { doc, getDoc, getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebase/firebaseConfig';
import sc1 from '../../../public/sc1.png'
import sc2 from '../../../public/sc2.png'
import sc3 from '../../../public/sc3.png'

function Profile() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [habits, setHabits] = useState([]);
  const [scoreBadge, setScoreBadge] = useState(0);
  const [completeBadge, setCompleteBadge] = useState(0);
  const db = getFirestore(app);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user_Ref = doc(db, "users", currentUser.uid);
        console.log("Fetching data for user:", currentUser.uid); 
        const userSnapshot = await getDoc(user_Ref);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
          console.log("User data:", userSnapshot.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    }    
    if (currentUser) {
      fetchUserData();
    }

    const fetchHabits = async () => {
      if (!currentUser) {
        console.error("No user is logged in!");
        setLoading(false);
        return;
      }
      try {
        const habitsRef = collection(db, "users", currentUser.uid, "habits");
        const snapshot = await getDocs(habitsRef);
        const habitsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHabits(habitsData);
        if (habitsData.length > 0) {
          setSelectedHabit(habitsData[0]);
        }
      } catch (error) {
        console.error("Error fetching habits:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHabits();
    
  }, [currentUser, db]);
  const badgeSetter = ()=>{
    if (userData){
      if(userData.totalScore>=100){
        setScoreBadge(1);
      }
      if(userData.totalScore>=500){
        setScoreBadge(2);
      }  
      if(userData.totalScore>=1000){
        setScoreBadge(3);
      }
      habits.forEach((habit)=>{
        if(habit.bestStreak>= 1)
          setCompleteBadge(completeBadge+1);
      })
      
    }
  }
  useEffect(() => {
    badgeSetter();
  }, [userData]);
  
  const handleCopy = async ()=>{
    if (userData && userData.fid) {
      try {
        await navigator.clipboard.writeText(userData.fid);
        console.log('FID copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  }

  
  
  return (
    <div className='sm:pt-20 pt-5 select bg-indigo-600 w-full text-white min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col sm:flex-row justify-between items-center mb-8'>
          <div className='flex items-center mb-4 sm:mb-0'>
            <img src={currentUser.photoURL} className='rounded-full mr-4 ' alt="" />
            <div>
              <h1 className='text-3xl sm:text-4xl font-bold'>
              Hello, {currentUser.displayName || "User"}
              </h1>
              <div>
              <div>Badges: </div>
              {scoreBadge >= 1 && 
                <img src={sc1} className='w-14 h-14'></img>
              }
              {scoreBadge >= 2 && 
                <img src={sc2} className='w-14 h-14'></img>
              }
              {scoreBadge >= 3 && 
                <img src={sc3} className='w-14 h-14'></img>
              }
              <h1>Completions Badge: {completeBadge}</h1>
              </div>
              <p className='text-indigo-200'>Welcome back to your habit journey!</p>
              {userData && <div className='flex items-center gap-5'>
                              <p className='text-md'>Your FID: {userData.fid}</p> 
                              <Clipboard className='cursor-pointer w-5 h-5' onClick={handleCopy}/>
                          </div>
              }
            </div>
          </div>
          <Logout />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          
          <Link to="/newHabit">
            <QuickActionCard title="New Habit" icon={<PlusCircle />} />
          </Link>
          <Link to="/settings">
            <QuickActionCard title="Settings" icon={<Settings />} />
          </Link>
          <Link to="/dataViz">
          <QuickActionCard title="View Habits" icon={<TrendingUp />} />
        </Link>
        </div>
      </div>

      <FooterAndNavbar />
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className='bg-white/10 rounded-lg p-4 flex items-center justify-between h-32'>
      <div className='mr-4 text-indigo-300'>{icon}</div>
      <div>
        <h3 className='text-lg font-semibold'>{title}</h3>
        <p className='text-2xl font-bold'>{value}</p>
      </div>
    </div>
  );
}

function QuickActionCard({ title, icon }) {
  return (
    <div className='bg-white/10 rounded-lg p-4 flex items-center justify-between h-32 hover:bg-white/20 transition duration-300'>
      <span className='text-lg font-semibold'>{title}</span>
      <div className='text-indigo-300'>{icon}</div>
    </div>
  );
}

export default Profile;