import React from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
const NotificationButton = ({ notificationCount }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-end w-full ">
      <button
        onClick={() => navigate("/groupHabitInvites")}
        className="relative p-2 hover:bg-indigo-100 rounded-full transition-all duration-300 transform hover:scale-105"
      >
        <Bell className="w-6 h-6 text-black" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {notificationCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default NotificationButton;
