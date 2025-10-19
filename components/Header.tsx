import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => (
  <header className="flex justify-between items-center">
    <div className="text-left">
      <h1 className="text-3xl font-bold text-emerald-500 dark:text-emerald-400">Streak Tracker</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1">Stay on track, one day at a time.</p>
    </div>
    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
  </header>
);