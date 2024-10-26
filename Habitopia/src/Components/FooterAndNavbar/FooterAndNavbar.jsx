import React from 'react';
import { Link } from 'react-router-dom';
import { DiamondPlus, UserRound, Home, BarChart2, Users } from 'lucide-react';
import NavLink from './NavLink';

function FooterAndNavbar() {
  return (
    <>
      <nav className="hidden md:flex fixed top-0 select-none left-0 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/home" className="text-xl font-bold hover:text-indigo-200 transition duration-300">
            Habitopia.
          </Link>
          <div className="flex items-center space-x-6">
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/dataViz">Explore</NavLink>
            <NavLink to="/newHabit">New Habit</NavLink>
            <NavLink to="/social">Social</NavLink>
            <NavLink to="/profile">
              <UserRound className="h-5 w-5" />
            </NavLink>
          </div>
        </div>
      </nav>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white z-50">
        <div className="flex justify-around items-center py-2">
          <NavLink to="/home" icon={<Home />} label="Home" />
          <NavLink to="/dataViz" icon={<BarChart2 />} label="Explore" />
          <NavLink to="/newHabit" icon={<DiamondPlus />} label="New Habit" />
          <NavLink to="/social" icon={<Users />} label="Social" />
          <NavLink to="/profile" icon={<UserRound />} label="Profile" />
        </div>
      </nav>
    </>
  );
}

export default FooterAndNavbar;