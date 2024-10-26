import React, { useState } from 'react';
import { format, addDays, startOfWeek, isToday, isSameDay, isSameMonth } from 'date-fns';

function WeeklyCalendarComponent({ onDateSelect, selectedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
  const daysOfWeek = [...Array(7)].map((_, index) => addDays(startOfCurrentWeek, index));

  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));

  return (
    <div className="bg-white/10 text-white rounded-lg shadow-md p-4 my-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevWeek} className="text-indigo-600 hover:text-indigo-800 focus:outline-none">
          ←
        </button>
        <p className="text-lg font-semibold">
          {format(startOfCurrentWeek, 'MMMM yyyy')}
        </p>
        <button onClick={nextWeek} className="text-indigo-600 hover:text-indigo-800 focus:outline-none">
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => (
          <div
            key={day.toString()}
            className={`text-center p-2 rounded cursor-pointer ${
              isToday(day) ? 'bg-indigo-700' : ''
            } ${
              isSameDay(day, selectedDate) ? 'border-2 border-indigo-700' : ''
            } ${
              !isSameMonth(day, currentDate) ? 'opacity-50' : ''
            }`}
            onClick={() => onDateSelect(day)}
          >
            <p className="text-xs font-medium">{format(day, 'EEE')}</p>
            <p className="text-lg font-bold">{format(day, 'd')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyCalendarComponent;