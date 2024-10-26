import React, { useState } from 'react';
import { getFirestore } from "firebase/firestore";
import WeeklyCalendarComponent from './WeeklyCalendarComponent';
import HabitsComponent from './HabitsComponent';
import { Droplets, FootprintsIcon, Flower2, Plus } from 'lucide-react';

const HabitTrackerComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const db = getFirestore();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className=" bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-6">
         

          {/* Calendar Component */}
          <div className="mt-4">
            
            <WeeklyCalendarComponent 
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              className="flex space-x-2 overflow-x-auto pb-2"
            />
          </div>
        </header>

        {/* Habits Section */}
        <div>
          
          <div className="space-y-3">
            <HabitsComponent 
              selectedDate={selectedDate} 
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitTrackerComponent;