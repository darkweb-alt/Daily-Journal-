
import React, { useState } from 'react';
import { HabitStatus, HabitEntry } from '../types';

interface LogFormProps {
  addEntry: (newEntry: Omit<HabitEntry, 'date'> & { date: Date }) => void;
  existingDates: string[];
}

export const LogForm: React.FC<LogFormProps> = ({ addEntry, existingDates }) => {
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const isDateDisabled = (dateStr: string) => existingDates.includes(dateStr);
  const selectedDateStr = date.toISOString().split('T')[0];

  const handleSubmit = (status: HabitStatus) => {
    if (isDateDisabled(selectedDateStr)) {
        alert("An entry for this date already exists.");
        return;
    }
    addEntry({ date, status, notes });
    // Reset form for next entry
    setDate(new Date());
    setNotes('');
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg animate-fade-in">
      <h3 className="text-xl font-semibold mb-4 text-center text-slate-200">Log Daily Progress</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-400 mb-1">Date</label>
          <input
            type="date"
            id="date"
            value={selectedDateStr}
            onChange={(e) => setDate(new Date(e.target.value))}
            max={todayStr}
            className="w-full bg-slate-700 border-slate-600 text-slate-200 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-400 mb-1">Notes (Optional)</label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any reflections for today?"
            className="w-full bg-slate-700 border-slate-600 text-slate-200 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          onClick={() => handleSubmit('completed')}
          disabled={isDateDisabled(selectedDateStr)}
          className="w-full flex items-center justify-center bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          <span className="text-2xl mr-2">✓</span> Completed
        </button>
        <button
          onClick={() => handleSubmit('missed')}
          disabled={isDateDisabled(selectedDateStr)}
          className="w-full flex items-center justify-center bg-rose-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-rose-700 transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          <span className="text-2xl mr-2">✕</span> Missed
        </button>
      </div>
      {isDateDisabled(selectedDateStr) && <p className="text-center text-yellow-400 text-sm mt-4">You have already logged an entry for this date.</p>}
    </div>
  );
};
