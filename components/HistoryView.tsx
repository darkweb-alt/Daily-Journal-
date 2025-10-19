import React, { useRef } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Brush } from 'recharts';
import { HabitEntry, Streak } from '../types';

interface HistoryViewProps {
  entries: HabitEntry[];
  streakHistory: Streak[];
  streakGoal: number;
  importData: (jsonString: string) => void;
  theme: 'light' | 'dark';
}

const CustomTooltip = ({ active, payload, theme }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className={`p-3 border rounded-lg shadow-lg text-sm ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'}`}>
                <p className={`font-bold mb-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{`Streak: ${data.length} days`}</p>
                <p className={`intro ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{`Started: ${data.startDate}`}</p>
                <p className={`intro ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{`Ended: ${data.endDate}`}</p>
            </div>
        );
    }
    return null;
};

export const HistoryView: React.FC<HistoryViewProps> = ({ entries, streakHistory, streakGoal, importData, theme }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chartData = streakHistory.map(streak => {
    const endDate = new Date(streak.endDate);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - (streak.length - 1));

    return {
        name: streak.endDate,
        length: streak.length,
        startDate: startDate.toISOString().split('T')[0],
        endDate: streak.endDate
    };
  });

  const reversedEntries = [...entries].reverse();

  const handleExport = () => {
    if (entries.length === 0 && streakGoal === 0) {
        alert("No data to export.");
        return;
    }

    const dataToExport = {
        entries,
        streakGoal,
    };
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const dateStamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `streak_tracker_backup_${dateStamp}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
            importData(text);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    reader.onerror = () => {
        alert('Error reading file.');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    reader.readAsText(file);
  };
  
  const chartStrokeColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridStrokeColor = theme === 'dark' ? '#475569' : '#e2e8f0';
  const brushFillColor = theme === 'dark' ? '#1e293b' : '#f1f5f9';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg animate-fade-in">
      <h3 className="text-xl font-semibold mb-4 text-center text-slate-800 dark:text-slate-200">Progress History</h3>
      
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-300">Streak Visualization</h4>
        {streakHistory.length > 0 ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
                <XAxis dataKey="name" stroke={chartStrokeColor} tick={{ fontSize: 12 }} />
                <YAxis stroke={chartStrokeColor} allowDecimals={false} />
                <Tooltip content={<CustomTooltip theme={theme} />} cursor={{ fill: theme === 'dark' ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.5)' }} />
                <Bar dataKey="length" fill="#34d399" />
                <Brush dataKey="name" height={30} stroke="#34d399" fill={brushFillColor} travellerWidth={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">No streak data yet. Log a completed day to start!</p>
        )}
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Data Management</h4>
            <div className="flex gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="application/json"
                    className="hidden"
                    aria-hidden="true"
                />
                <button
                    onClick={handleImportClick}
                    className="px-3 py-1 text-sm bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 transition-colors duration-200"
                    aria-label="Import data from a backup file"
                >
                    Import
                </button>
                <button
                    onClick={handleExport}
                    className="px-3 py-1 text-sm bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition-colors duration-200"
                    aria-label="Export all data to a JSON backup file"
                >
                    Export
                </button>
            </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Save a backup file or import data from another device.</p>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">All Entries</h4>
        <div className="max-h-60 overflow-y-auto pr-2 border-t border-gray-200 dark:border-slate-700 pt-4">
          {reversedEntries.length > 0 ? (
            <ul className="space-y-3">
              {reversedEntries.map(entry => (
                <li key={entry.date} className="bg-gray-100 dark:bg-slate-700 p-3 rounded-lg flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{entry.date}</p>
                    {entry.notes && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic">"{entry.notes}"</p>}
                  </div>
                  <span className={`text-2xl font-bold ${entry.status === 'completed' ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {entry.status === 'completed' ? '✓' : '✕'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">No entries found. Log your first day's progress!</p>
          )}
        </div>
      </div>
    </div>
  );
};