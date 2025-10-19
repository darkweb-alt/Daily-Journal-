import { useState, useEffect, useMemo, useCallback } from 'react';
import { HabitEntry, HabitStatus, Streak } from '../types';

const STORAGE_KEY = 'dailyJournalHabitData';
const GOAL_STORAGE_KEY = 'dailyJournalStreakGoal';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const getPreviousDateString = (dateStr: string) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
};

export const useHabitData = () => {
    const [entries, setEntries] = useState<HabitEntry[]>(() => {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            return savedData ? JSON.parse(savedData) : [];
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return [];
        }
    });

    const [streakGoal, setStreakGoalState] = useState<number>(() => {
        try {
            const savedGoal = localStorage.getItem(GOAL_STORAGE_KEY);
            return savedGoal ? JSON.parse(savedGoal) : 0;
        } catch (error) {
            console.error("Error reading goal from localStorage", error);
            return 0;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        } catch (error) {
            console.error("Error writing to localStorage", error);
        }
    }, [entries]);

    const addEntry = useCallback((newEntry: HabitEntry) => {
        setEntries(prevEntries => [...prevEntries, newEntry].sort((a, b) => a.date.localeCompare(b.date)));
    }, []);
    
    const setStreakGoal = useCallback((goal: number) => {
        try {
            const newGoal = Math.max(0, Math.floor(goal));
            localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(newGoal));
            setStreakGoalState(newGoal);
        } catch (error) {
            console.error("Error writing goal to localStorage", error);
        }
    }, []);

    const importData = useCallback((jsonString: string) => {
        try {
            const data = JSON.parse(jsonString);

            if (!data || !Array.isArray(data.entries) || typeof data.streakGoal === 'undefined') {
                alert('Invalid backup file format.');
                return;
            }

            const confirmImport = window.confirm(
                'Are you sure you want to import this data? This will overwrite existing entries for the same dates and update your streak goal. This action cannot be undone.'
            );

            if (confirmImport) {
                const importedEntries: HabitEntry[] = data.entries;
                const importedStreakGoal: number = data.streakGoal;

                const entriesMap = new Map(entries.map(e => [e.date, e]));
                for (const entry of importedEntries) {
                    if (entry.date && entry.status) {
                       entriesMap.set(entry.date, entry);
                    }
                }
                
                const newEntries = Array.from(entriesMap.values()).sort((a, b) => a.date.localeCompare(b.date));

                setEntries(newEntries);
                setStreakGoal(importedStreakGoal);
                alert('Data imported successfully!');
            }
        } catch (error) {
            console.error("Failed to import data", error);
            alert('Failed to import data. The file might be corrupted or in the wrong format.');
        }
    }, [entries, setStreakGoal]);


    const { currentStreak, longestStreak, streakHistory, isGoalMet } = useMemo(() => {
        const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));
        const entriesMap = new Map<string, HabitStatus>(sortedEntries.map(e => [e.date, e.status]));

        // Calculate All Streaks and Longest Streak
        let allStreaks: Streak[] = [];
        let longest = 0;
        let currentStreakLength = 0;
        let streakEndDate: string | null = null;
        
        const allSortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));

        if (allSortedEntries.length > 0) {
            const startDate = new Date(allSortedEntries[0].date);
            const endDate = new Date(getTodayDateString());

            for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                const status = entriesMap.get(dateStr);

                if (status === 'completed') {
                    currentStreakLength++;
                    if (!streakEndDate) streakEndDate = dateStr;
                } else {
                    if (currentStreakLength > 0) {
                        allStreaks.push({ endDate: streakEndDate || dateStr, length: currentStreakLength });
                        if (currentStreakLength > longest) {
                            longest = currentStreakLength;
                        }
                    }
                    currentStreakLength = 0;
                    streakEndDate = null;
                }
            }
            if (currentStreakLength > 0 && streakEndDate) {
                 allStreaks.push({ endDate: streakEndDate, length: currentStreakLength });
                 if (currentStreakLength > longest) {
                    longest = currentStreakLength;
                }
            }
        }

        // Calculate Current Streak
        let current = 0;
        let checkDate = getTodayDateString();
        
        // If today is not logged, start checking from yesterday
        if (!entriesMap.has(checkDate)) {
            checkDate = getPreviousDateString(checkDate);
        }

        while (entriesMap.get(checkDate) === 'completed') {
            current++;
            checkDate = getPreviousDateString(checkDate);
        }
        
        const isGoalMet = streakGoal > 0 && current >= streakGoal;

        return {
            currentStreak: current,
            longestStreak: longest,
            streakHistory: allStreaks,
            isGoalMet
        };
    }, [entries, streakGoal]);

    return { entries, addEntry, currentStreak, longestStreak, streakHistory, streakGoal, setStreakGoal, isGoalMet, importData };
};