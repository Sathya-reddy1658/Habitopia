import React from 'react';
import {Link} from 'react-router-dom'
export default function NavLink ({ to, children, icon, label }) {
    const content = icon ? (
      <div className="flex flex-col items-center">
        {React.cloneElement(icon, { className: "h-6 w-6 mb-1" })}
        <span className="text-xs">{label}</span>
      </div>
    ) : children;
  
    return (
      <Link 
        to={to} 
        className="hover:text-indigo-200 transition duration-300 flex items-center"
      >
        {content}
      </Link>
    );
  };
  