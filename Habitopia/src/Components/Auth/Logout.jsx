
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {auth} from '../firebase/firebaseConfig';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {   
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      <button className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;