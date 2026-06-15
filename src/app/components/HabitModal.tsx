import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { motion, AnimatePresence } from 'motion/react';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit?: any;
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#71717a', // zinc
];

export function HabitModal({ isOpen, onClose, habit }: HabitModalProps) {
  const { addHabit, updateHabit } = useHabits();
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setColor(habit.color);
    } else {
      setName('');
      setColor(COLORS[0]);
    }
  }, [habit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (habit) {
      updateHabit(habit.id, name, color);
    } else {
      addHabit(name, color);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/20 dark:bg-zinc-950/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-semibold">
                {habit ? 'Edit Habit' : 'Create New Habit'}
              </h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-500">Habit Name</label>
                <input 
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Read for 30 mins"
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-500">Color Theme</label>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full border-4 transition-transform hover:scale-110 active:scale-90 ${
                        color === c ? 'border-zinc-900 dark:border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                {habit ? 'Save Changes' : 'Add Habit'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
