import React, { useState } from 'react';
import { useHabitData } from './hooks/useHabitData';
import { Header } from './components/Header';
import { StreakDisplay } from './components/StreakDisplay';
import { LogForm } from './components/LogForm';
import { HistoryView } from './components/HistoryView';
import { HabitEntry } from './types';

type View = 'log' | 'history';

const App: React.FC = () => {
  const { entries, addEntry, currentStreak, longestStreak, streakHistory, streakGoal, setStreakGoal, isGoalMet } = useHabitData();
  const [view, setView] = useState<View>('log');

  const handleAddEntry = (newEntry: Omit<HabitEntry, 'date'> & { date: Date }) => {
    const dateString = newEntry.date.toISOString().split('T')[0];
    // Prevent adding duplicate entries for the same day
    if (entries.some(e => e.date === dateString)) {
        alert("An entry for this date already exists.");
        return;
    }
    addEntry({ ...newEntry, date: dateString });
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col items-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Header />
        <main className="mt-6">
          <StreakDisplay 
            currentStreak={currentStreak} 
            longestStreak={longestStreak} 
            streakGoal={streakGoal}
            setStreakGoal={setStreakGoal}
            isGoalMet={isGoalMet}
          />
          
          <div className="mt-8 bg-slate-800 rounded-xl shadow-lg p-2 flex space-x-2">
            <button 
              onClick={() => setView('log')}
              className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-semibold ${view === 'log' ? 'bg-emerald-500 text-white' : 'bg-transparent text-slate-400 hover:bg-slate-700'}`}
            >
              Log Progress
            </button>
            <button 
              onClick={() => setView('history')}
              className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-semibold ${view === 'history' ? 'bg-emerald-500 text-white' : 'bg-transparent text-slate-400 hover:bg-slate-700'}`}
            >
              View History
            </button>
          </div>

          <div className="mt-8">
            {view === 'log' ? (
              <LogForm addEntry={handleAddEntry} existingDates={entries.map(e => e.date)} />
            ) : (
              <HistoryView entries={entries} streakHistory={streakHistory} />
            )}
          </div>
        </main>
         <footer className="text-center text-slate-500 text-xs mt-10 pb-4">
            <p>All data is stored locally on your device.</p>
            <p>This is a web app. For an app-like experience, use "Add to Home Screen" in your browser.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;