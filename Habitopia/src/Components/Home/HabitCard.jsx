import React from 'react';
import { SquarePlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HabitCard = ({ habit, onClick, isEditable }) => {
  const navigate = useNavigate();
  const isGroupHabit = habit.id.toString().startsWith('group_');

  const handleDvClick = () => {
    if (habit) {
      navigate(`/data-viz/${habit.id}`, { state: { habit: habit } });
    }
  };

  const handleGroupClick = (e) => {
    e.stopPropagation();
    navigate(`/group/${habit.id}`);
  };

  return (
    <div
      className={`flex items-center justify-between bg-gray-50 p-3 rounded-md mb-3 ${
        isEditable ? 'cursor-pointer hover:bg-gray-100' : ''
      } transition-colors`}
    >
      <div className='grow md:flex justify-between items-center px-5' onClick={handleDvClick}>
        <div className="flex items-center space-x-3">
          <span className="text-gray-800 flex items-center">
            <span className="mr-2 text-lg">{habit.emoji}</span>
            <span>{habit.habitName}</span>
          </span>
          {isGroupHabit && (
            <button
              onClick={handleGroupClick}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="View Group Progress"
            >
              <Users size={20} />
            </button>
          )}
        </div>
        <span className="text-sm text-gray-600">
          {habit.completed
            ? "Completed!"
            : (habit.hasMetric=="yes" ? (`${habit.progress}/${habit.target} ${habit.metricUnit}`)
                : ("Not Completed")
          )
          }
        </span>
      </div>
      <button 
        className='text-black text-5xl' 
        onClick={isEditable ? onClick : undefined}
      >
        <SquarePlus />
      </button>
    </div>
  );
};

export default HabitCard;