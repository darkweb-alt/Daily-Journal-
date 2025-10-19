
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { HabitEntry, Streak } from '../types';

interface HistoryViewProps {
  entries: HabitEntry[];
  streakHistory: Streak[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-700 p-2 border border-slate-600 rounded-md shadow-lg">
                <p className="label text-slate-300">{`Ended: ${label}`}</p>
                <p className="intro text-emerald-400">{`Streak: ${payload[0].value} days`}</p>
            </div>
        );
    }
    return null;
};

export const HistoryView: React.FC<HistoryViewProps> = ({ entries, streakHistory }) => {
  const chartData = streakHistory.map(streak => ({
    name: streak.endDate,
    length: streak.length
  }));

  const reversedEntries = [...entries].reverse();

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg animate-fade-in">
      <h3 className="text-xl font-semibold mb-4 text-center text-slate-200">Progress History</h3>
      
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-2 text-slate-300">Streak Visualization</h4>
        {streakHistory.length > 0 ? (
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(71, 85, 105, 0.5)' }} />
                <Bar dataKey="length" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No streak data yet. Log a completed day to start!</p>
        )}
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-2 text-slate-300">All Entries</h4>
        <div className="max-h-80 overflow-y-auto pr-2">
          {reversedEntries.length > 0 ? (
            <ul className="space-y-3">
              {reversedEntries.map(entry => (
                <li key={entry.date} className="bg-slate-700 p-3 rounded-lg flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-200">{entry.date}</p>
                    {entry.notes && <p className="text-sm text-slate-400 mt-1 italic">"{entry.notes}"</p>}
                  </div>
                  <span className={`text-2xl font-bold ${entry.status === 'completed' ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {entry.status === 'completed' ? '✓' : '✕'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-center py-8">No entries found. Log your first day's progress!</p>
          )}
        </div>
      </div>
    </div>
  );
};
