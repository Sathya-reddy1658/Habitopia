import React from 'react';
import { Plus, Users } from 'lucide-react';
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
      className="bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-100 cursor-pointer"
    >
      <div className="flex grow justify-between items-center" onClick={handleDvClick}>
        <div className="flex items-center space-x-3" >
          <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
            <span className="text-lg">{habit.emoji}</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{habit.habitName}</h3>
            <p className="text-gray-500 text-sm">
              {habit.completed
                ? "Completed!"
                : habit.hasMetric === "yes"
                ? `${habit.progress}/${habit.target} ${habit.metricUnit}`
                : "Not Completed"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isGroupHabit && (
            <button
              onClick={handleGroupClick}
              className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
            >
              <Users className="w-4 h-4 text-blue-600" />
            </button>
          )}
          {isEditable && (
            <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors" onClick={isEditable ? onClick : undefined}>
              <Plus className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitCard;