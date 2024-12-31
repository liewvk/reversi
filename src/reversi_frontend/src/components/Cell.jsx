import React from 'react';

export const Cell = ({ value, isValid, onClick }) => {
  return (
    <div 
      className={`
        w-12 h-12 border border-green-800 
        flex items-center justify-center 
        cursor-pointer
        ${isValid ? 'bg-green-100' : 'bg-green-700'}
      `}
      onClick={onClick}
    >
      {value && (
        <div className={`
          w-10 h-10 rounded-full 
          ${value === 'black' ? 'bg-black' : 'bg-white'}
          transition-all duration-300 ease-in-out
          transform hover:scale-105
        `} />
      )}
      {isValid && !value && (
        <div className="w-4 h-4 rounded-full bg-green-500 opacity-50" />
      )}
    </div>
  );
};