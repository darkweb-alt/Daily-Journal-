import React, { useState, useEffect } from 'react';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  streakGoal: number;
  setStreakGoal: (goal: number) => void;
  isGoalMet: boolean;
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


export const StreakDisplay: React.FC<StreakDisplayProps> = ({ currentStreak, longestStreak, streakGoal, setStreakGoal, isGoalMet }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [goalValue, setGoalValue] = useState(streakGoal || '');

  useEffect(() => {
    setGoalValue(streakGoal || '');
  }, [streakGoal]);

  const handleSave = () => {
    const newGoal = Math.max(0, Math.floor(Number(goalValue)));
    setStreakGoal(newGoal);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setGoalValue(streakGoal || '');
    setIsEditing(false);
  }
  
  const progress = streakGoal > 0 ? Math.min((currentStreak / streakGoal) * 100, 100) : 0;
  
  return (
    <>
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

      <div className="mt-4 bg-slate-800 rounded-xl p-4 shadow-lg">
        {isEditing ? (
          <div>
            <label htmlFor="streak-goal" className="block text-sm font-medium text-slate-300 mb-2">Set Streak Goal (in days)</label>
            <input 
              type="number" 
              id="streak-goal"
              value={goalValue}
              onChange={(e) => setGoalValue(e.target.value)}
              className="w-full bg-slate-700 border-slate-600 text-slate-200 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., 30"
              min="1"
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={handleCancel} className="px-4 py-2 text-sm bg-slate-600 text-slate-200 font-semibold rounded-lg hover:bg-slate-700 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">Save Goal</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-300">Streak Goal</h2>
              {streakGoal > 0 ? (
                isGoalMet ? (
                   <p className="text-emerald-400 font-bold mt-1 text-sm">Goal Achieved! 🎉 Keep it up!</p>
                ) : (
                  <p className="text-slate-400 text-sm mt-1">{currentStreak} of {streakGoal} days</p>
                )
              ) : (
                <p className="text-slate-400 text-sm mt-1">No goal set.</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              {streakGoal > 0 && !isGoalMet && (
                  <div className="w-24">
                      <div className="bg-slate-700 rounded-full h-2.5">
                          <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                      </div>
                  </div>
              )}
              <button 
                onClick={() => setIsEditing(true)} 
                className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-1 px-3 rounded-md transition-colors"
                aria-label="Edit streak goal"
              >
                {streakGoal > 0 ? 'Edit' : 'Set Goal'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};