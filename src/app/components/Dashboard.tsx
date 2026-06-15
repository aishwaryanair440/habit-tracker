import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import { HabitGrid } from './HabitGrid';
import { SleepTracker } from './SleepTracker';
import { MonthlyNotes } from './MonthlyNotes';
import { HabitModal } from './HabitModal';
import { format, addMonths, subMonths } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Moon, 
  Sun, 
  BarChart2, 
  LayoutDashboard,
  Settings2
} from 'lucide-react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

export function Dashboard() {
  const { currentMonth, setCurrentMonth, habits } = useHabits();
  const { theme, toggleTheme } = useTheme();
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNameChange = (name: string) => {
    setUserName(name);
    localStorage.setItem('userName', name);
  };
  const [editingHabit, setEditingHabit] = useState<any>(null);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Habit-At</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Consistency is the key to progress.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1">
            <button 
              onClick={prevMonth}
              className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 text-sm font-medium min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Link 
            to="/review"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl text-sm font-medium transition-colors"
          >
            <BarChart2 className="w-4 h-4" />
            Review
          </Link>

          <button 
            onClick={toggleTheme}
            className="p-2.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <main className="space-y-12">
        {/* Main Grid Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Daily Habits</h2>
            <button 
              onClick={() => {
                setEditingHabit(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Habit
            </button>
          </div>
          
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <HabitGrid 
              onEditHabit={(habit) => {
                setEditingHabit(habit);
                setIsModalOpen(true);
              }}
            />
          </div>
        </section>

        {/* Bottom Section: Sleep & Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <section className="flex flex-col h-full">
            <div className="flex items-center h-8 gap-2 mb-6">
              <h2 className="text-lg font-medium">Sleep Tracker</h2>
              <span className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 rounded-full font-medium">Hours</span>
            </div>
            <div className="flex-1 h-full">
              <SleepTracker />
            </div>
          </section>

          <section className="flex flex-col h-full">
            <div className="flex items-center h-8 mb-6">
              <h2 className="text-lg font-medium">Monthly Notes</h2>
            </div>
            <div className="flex-1 h-full">
              <MonthlyNotes />
            </div>
          </section>
        </div>
      </main>

      <HabitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        habit={editingHabit}
      />
    </div>
  );
}
