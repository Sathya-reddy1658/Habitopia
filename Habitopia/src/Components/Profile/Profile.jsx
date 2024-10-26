import React, { useEffect, useState } from 'react';
import FooterAndNavbar from '../FooterAndNavbar/FooterAndNavbar';
import { useAuth } from '../contexts/AuthContext';
import Logout from '../Auth/Logout';
import { Link } from 'react-router-dom';
import { UserCircle, TrendingUp, Award, PlusCircle, Settings, Clipboard } from 'lucide-react';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '../firebase/firebaseConfig';

function Profile() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
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
  }, [currentUser, db]);
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
          <StatCard icon={<TrendingUp />} title="Streak" value="7 days" />
          <StatCard icon={<Award />} title="Completed Habits" value="42" />
          <Link to="/newHabit">
            <QuickActionCard title="New Habit" icon={<PlusCircle />} />
          </Link>
          <Link to="/settings">
            <QuickActionCard title="Settings" icon={<Settings />} />
          </Link>
          <Link to="/viewhabits">
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