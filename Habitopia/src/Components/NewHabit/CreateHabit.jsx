import React, { useState } from 'react';
import NewHabit from './NewHabit';
import NewGroupHabit from './NewGroupHabit';
import { Users, Plus, ArrowLeft } from 'lucide-react';
import FooterAndNavbar from '../FooterAndNavbar/FooterAndNavbar';
import { useNavigate } from 'react-router-dom';

function CreateHabit() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState(null);

  return (
    <div className="min-h-screen bg-indigo-600">
        <FooterAndNavbar/>
      {!activeView ? (
          <div className="h-[80vh] pt-5 flex items-center justify-center flex-col gap-4">
            <h1 className='text-white font-bold text-4xl text-center pb-10 ' >Create New Habit</h1>
          <button
            onClick={() => setActiveView('individual')}
            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-300 font-medium shadow-lg"
          >
            <Plus size={20} />
            New Habit
          </button>
          <button
            onClick={() => setActiveView('group')}
            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-300 font-medium shadow-lg"
          >
            <Users size={20} />
            New Group Habit
          </button>
        </div>
      ) : (
        <div>
           <button onClick={() => navigate(-1)} className="p-2 sm:mt-20 mt-5 ml-5 bg-indigo-100 hover:bg-indigo-200 rounded-full"> 
          <ArrowLeft className="w-6 h-6 text-indigo-600" />
        </button>
          {activeView === 'individual' ? <NewHabit /> : <NewGroupHabit />}
        </div>
      )}
    </div>
  );
}

export default CreateHabit;