import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Brush } from 'recharts';
import { HabitEntry, Streak } from '../types';

interface HistoryViewProps {
  entries: HabitEntry[];
  streakHistory: Streak[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-slate-700 p-3 border border-slate-600 rounded-lg shadow-lg text-sm">
                <p className="label text-slate-200 font-bold mb-1">{`Streak: ${data.length} days`}</p>
                <p className="intro text-slate-400">{`Started: ${data.startDate}`}</p>
                <p className="intro text-slate-400">{`Ended: ${data.endDate}`}</p>
            </div>
        );
    }
    return null;
};

const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
        return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '""'); // escape double quotes
            return `"${escaped}"`; // wrap in double quotes
        });
        csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};


export const HistoryView: React.FC<HistoryViewProps> = ({ entries, streakHistory }) => {
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
    if (entries.length > 0) {
        const entryExportData = entries.map(({ date, status, notes }) => ({
            date,
            status,
            notes: notes || '',
        }));
        downloadCSV(entryExportData, 'habit_entries.csv');
    }

    if (streakHistory.length > 0) {
        const streakExportData = streakHistory.map(streak => {
            const endDate = new Date(streak.endDate);
            const startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - (streak.length - 1));
            return {
                start_date: startDate.toISOString().split('T')[0],
                end_date: streak.endDate,
                length_in_days: streak.length,
            };
        });
        downloadCSV(streakExportData, 'habit_streaks.csv');
    }
  };


  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg animate-fade-in">
      <h3 className="text-xl font-semibold mb-4 text-center text-slate-200">Progress History</h3>
      
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-2 text-slate-300">Streak Visualization</h4>
        {streakHistory.length > 0 ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(71, 85, 105, 0.5)' }} />
                <Bar dataKey="length" fill="#34d399" />
                <Brush dataKey="name" height={30} stroke="#34d399" fill="#1e293b" travellerWidth={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No streak data yet. Log a completed day to start!</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-semibold text-slate-300">All Entries</h4>
            <button
                onClick={handleExport}
                disabled={entries.length === 0}
                className="px-3 py-1 text-sm bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                aria-label="Export all data to CSV files"
            >
                Export Data
            </button>
        </div>
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