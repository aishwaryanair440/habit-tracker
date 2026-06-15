import React, { useEffect, useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { format } from 'date-fns';
import { Save } from 'lucide-react';

export function MonthlyNotes() {
  const { currentMonth, monthlyNotes, setMonthlyNote } = useHabits();
  const monthKey = format(currentMonth, 'yyyy-MM');
  const currentNote = monthlyNotes.find(n => n.monthYear === monthKey);
  
  const [content, setContent] = useState(currentNote?.content || '');

  useEffect(() => {
    setContent(currentNote?.content || '');
  }, [monthKey, currentNote]);

  const handleSave = () => {
    setMonthlyNote(monthKey, content);
  };

  return (
    <div className="relative group h-full">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleSave}
        placeholder="Reflections, goals, or observations for this month..."
        className="w-full h-[320px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/5 transition-all"
      />
      <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-focus-within:opacity-100 transition-opacity">
        <span className="text-[10px] text-zinc-400 font-medium">Auto-saves on blur</span>
        <div className="p-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg">
          <Save className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
