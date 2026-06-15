import React, { createContext, useContext, useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export interface Habit {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Completion {
  habitId: string;
  date: string; // YYYY-MM-DD
}

export interface SleepLog {
  date: string; // YYYY-MM-DD
  duration: number; // hours
}

export interface MonthlyNote {
  monthYear: string; // YYYY-MM
  content: string;
}

interface HabitContextType {
  habits: Habit[];
  completions: Completion[];
  sleepLogs: SleepLog[];
  monthlyNotes: MonthlyNote[];
  addHabit: (name: string, color: string) => void;
  updateHabit: (id: string, name: string, color: string) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (habitId: string, date: string) => void;
  setSleepDuration: (date: string, duration: number) => void;
  setMonthlyNote: (monthYear: string, content: string) => void;
  setHabits: (habits: Habit[]) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Exercise', color: '#3b82f6', order: 0 },
      { id: '2', name: 'Reading', color: '#10b981', order: 1 },
      { id: '3', name: 'Meditation', color: '#8b5cf6', order: 2 },
    ];
  });

  const [completions, setCompletions] = useState<Completion[]>(() => {
    const saved = localStorage.getItem('completions');
    return saved ? JSON.parse(saved) : [];
  });

  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>(() => {
    const saved = localStorage.getItem('sleepLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [monthlyNotes, setMonthlyNotes] = useState<MonthlyNote[]>(() => {
    const saved = localStorage.getItem('monthlyNotes');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('completions', JSON.stringify(completions));
  }, [completions]);

  useEffect(() => {
    localStorage.setItem('sleepLogs', JSON.stringify(sleepLogs));
  }, [sleepLogs]);

  useEffect(() => {
    localStorage.setItem('monthlyNotes', JSON.stringify(monthlyNotes));
  }, [monthlyNotes]);

  const addHabit = (name: string, color: string) => {
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      color,
      order: habits.length,
    };
    setHabits([...habits, newHabit]);
  };

  const updateHabit = (id: string, name: string, color: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, name, color } : h));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
    setCompletions(completions.filter(c => c.habitId !== id));
  };

  const toggleCompletion = (habitId: string, date: string) => {
    setCompletions(prev => {
      const exists = prev.find(c => c.habitId === habitId && c.date === date);
      if (exists) {
        return prev.filter(c => !(c.habitId === habitId && c.date === date));
      }
      return [...prev, { habitId, date }];
    });
  };

  const setSleepDuration = (date: string, duration: number) => {
    setSleepLogs(prev => {
      const filtered = prev.filter(s => s.date !== date);
      return [...filtered, { date, duration }];
    });
  };

  const setMonthlyNote = (monthYear: string, content: string) => {
    setMonthlyNotes(prev => {
      const filtered = prev.filter(n => n.monthYear !== monthYear);
      return [...filtered, { monthYear, content }];
    });
  };

  return (
    <HabitContext.Provider value={{
      habits, completions, sleepLogs, monthlyNotes,
      addHabit, updateHabit, deleteHabit, toggleCompletion,
      setSleepDuration, setMonthlyNote, setHabits,
      currentMonth, setCurrentMonth
    }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) throw new Error('useHabits must be used within a HabitProvider');
  return context;
}
