import React, {useState, useEffect} from 'react';
import { Bell, Clipboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from '../firebase/firebaseConfig';


export default function SocialHeader({ notificationCount, fid }) {
  const navigate = useNavigate();
  
  const handleCopy = async ()=>{
      try {
        await navigator.clipboard.writeText(fid);
        console.log('FID copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
      }

  }

  return (
    <div className="flex justify-between items-center pt-[100px] mb-8">
      <div>
        <h1 className="text-4xl font-bold text-indigo-800">Social Dashboard</h1>
        <p className="text-indigo-600 mt-2">Connect with friends and track habits together</p>
      
      {fid && <div className='flex items-center gap-5'>
                  <p className='text-md'>Your FID: {fid}</p> 
                  <Clipboard className='cursor-pointer w-5 h-5' onClick={handleCopy}/>
              </div>
      }
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/groupHabitInvites')}
          className="relative p-2 hover:bg-indigo-100 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          
          <Bell className="w-6 h-6 text-indigo-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>
        
      </div>
    </div>
  );
}
