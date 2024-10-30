import React, { useState } from 'react';
import { format, addDays, startOfWeek, isToday, isSameDay, isSameMonth } from 'date-fns';

const DayButton = ({ day, isSelected, isCurrentMonth, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center p-2 rounded-full w-12 ${
      isSelected ? 'bg-blue-600 text-white' : 'text-gray-600'
    } ${
      !isCurrentMonth ? 'opacity-50' : ''
    }`}
  >
    <span className="text-sm font-medium">{format(day, 'EEE')}</span>
    <span className="text-lg font-bold">{format(day, 'd')}</span>
  </button>
);

function WeeklyCalendarComponent({ onDateSelect, selectedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
  const daysOfWeek = [...Array(7)].map((_, index) => addDays(startOfCurrentWeek, index));
  
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-500 mb-2">Today</p>
      <div className="flex items-center">
        <button 
          onClick={prevWeek} 
          className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          ←
        </button>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {daysOfWeek.map((day) => (
            <DayButton
              key={day.toString()}
              day={day}
              isSelected={isSameDay(day, selectedDate)}
              isCurrentMonth={isSameMonth(day, currentDate)}
              onClick={() => onDateSelect(day)}
            />
          ))}
        </div>
        
        <button 
          onClick={nextWeek} 
          className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          →
        </button>
      </div>
    </div>
  );
}

export default WeeklyCalendarComponent;