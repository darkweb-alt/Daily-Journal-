
import React from 'react';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

const FireIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 8a.5.5 0 01.5-.5h1.5a.5.5 0 010 1H6a.5.5 0 01-.5-.5zM6 11a.5.5 0 01.5-.5h4a.5.5 0 010 1H6.5a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 000 1h5a.5.5 0 000-1h-5z" clipRule="evenodd" />
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" />
        <path d="M10 2.25c-4.28 0-7.75 3.47-7.75 7.75S5.72 17.75 10 17.75 17.75 14.28 17.75 10 14.28 2.25 10 2.25zM10 16.5A6.5 6.5 0 1110 3.5a6.5 6.5 0 010 13z" />
        <path fillRule="evenodd" d="M10 5.25a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z" clipRule="evenodd" />
         <path d="M12.5 7.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
         <path fillRule="evenodd" d="M8.22 10.28a.75.75 0 011.06-1.06l3 3a.75.75 0 11-1.06 1.06l-3-3z" clipRule="evenodd" />
         <path fillRule="evenodd" d="M11.78 10.28a.75.75 0 01-1.06-1.06l-3 3a.75.75 0 011.06 1.06l3-3z" clipRule="evenodd" />
    </svg>
);


const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.926 5.03A1 1 0 0017 4h-1V3a1 1 0 00-2 0v1H6V3a1 1 0 00-2 0v1H3a1 1 0 00-.926 1.03l.5 2.5A1 1 0 003.5 8H4a2 2 0 014 0h4a2 2 0 014 0h.5a1 1 0 00.976-.53l.5-2.5a1 1 0 00-.05-.94zM5 10h10v2a3 3 0 01-3 3H8a3 3 0 01-3-3v-2z" />
        <path d="M10 16a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1z" />
    </svg>
);


export const StreakDisplay: React.FC<StreakDisplayProps> = ({ currentStreak, longestStreak }) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-center">
      <div className="bg-slate-800 rounded-xl p-4 shadow-lg flex flex-col items-center justify-center">
        <div className="flex items-center">
          <FireIcon />
          <h2 className="text-lg font-semibold text-slate-300">Current Streak</h2>
        </div>
        <p className="text-5xl font-bold text-orange-400 mt-2">{currentStreak}</p>
        <p className="text-slate-400 text-sm">days</p>
      </div>
      <div className="bg-slate-800 rounded-xl p-4 shadow-lg flex flex-col items-center justify-center">
        <div className="flex items-center">
          <TrophyIcon />
          <h2 className="text-lg font-semibold text-slate-300">Longest Streak</h2>
        </div>
        <p className="text-5xl font-bold text-yellow-400 mt-2">{longestStreak}</p>
        <p className="text-slate-400 text-sm">days</p>
      </div>
    </div>
  );
};
