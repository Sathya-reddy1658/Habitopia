import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, UserRound, Home, BarChart2, Users } from 'lucide-react';

function FooterAndNavbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 select-none left-0 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/home" className="text-xl font-bold hover:text-indigo-200 transition duration-300">
            Habitopia.
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/home">Home</Link>
            <Link to="/dataViz">Explore</Link>
            <Link to="/newHabit">New Habit</Link>
            <Link to="/social">Social</Link>
            <Link to="/profile">
              <UserRound className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Floating Mobile Navigation */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white rounded-full shadow-lg z-50">
        <div className="flex justify-around items-center h-16 px-6 relative">
          {/* Left section */}
          <div className="flex space-x-8">
            <Link 
              to="/home" 
              className="flex flex-col items-center"
            >
              <Home 
                className={`w-7 h-7 ${isActive('/home') ? 'text-blue-600' : 'text-gray-600'} !important`}
                strokeWidth={2}
              />
            </Link>
            <Link 
              to="/dataViz" 
              className="flex flex-col items-center"
            >
              <BarChart2 
                className={`w-7 h-7 ${isActive('/dataViz') ? 'text-blue-600' : 'text-gray-600'} !important`}
                strokeWidth={2}
              />
            </Link>
          </div>

          {/* Center Plus Button */}
          <Link 
            to="/newHabit"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white"
          >
            <Plus className="w-8 h-8" strokeWidth={2.5} />
          </Link>

          {/* Right section */}
          <div className="flex space-x-8">
            <Link 
              to="/social" 
              className="flex flex-col items-center"
            >
              <Users 
                className={`w-7 h-7 ${isActive('/social') ? 'text-blue-600' : 'text-gray-600'} !important`}
                strokeWidth={2}
              />
            </Link>
            <Link 
              to="/profile" 
              className="flex flex-col items-center"
            >
              <UserRound 
                className={`w-7 h-7 ${isActive('/profile') ? 'text-blue-600' : 'text-gray-600'} !important`}
                strokeWidth={2}
              />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default FooterAndNavbar;