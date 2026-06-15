import React from 'react';
import { useHabits } from '../context/HabitContext';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isToday,
  getDate
} from 'date-fns';
import { Settings2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

interface HabitGridProps {
  onEditHabit: (habit: any) => void;
}

export function HabitGrid({ onEditHabit }: HabitGridProps) {
  const { currentMonth, habits, completions, toggleCompletion, deleteHabit, setHabits } = useHabits();
  
  const moveHabit = (id: string, direction: 'up' | 'down') => {
    const index = habits.findIndex(h => h.id === id);
    if (index < 0) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= habits.length) return;
    
    const newHabits = [...habits];
    [newHabits[index], newHabits[newIndex]] = [newHabits[newIndex], newHabits[index]];
    setHabits(newHabits);
  };
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayStatus = (habitId: string, day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return completions.some(c => c.habitId === habitId && c.date === dateStr);
  };

  if (habits.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-zinc-500 dark:text-zinc-400 mb-4">No habits added yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800">
            <th className="sticky left-0 z-10 bg-white dark:bg-zinc-950 p-4 text-left font-medium text-xs text-zinc-500 uppercase tracking-wider w-[200px] border-r border-zinc-200 dark:border-zinc-800">
              Habits
            </th>
            {days.map(day => (
              <th 
                key={day.toString()} 
                className={clsx(
                  "p-2 text-center text-[10px] font-medium min-w-[32px]",
                  isToday(day) ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-600"
                )}
              >
                <div className={clsx(
                  "flex flex-col items-center justify-center rounded-lg py-1",
                  isToday(day) && "bg-zinc-100 dark:bg-zinc-900"
                )}>
                  <span>{format(day, 'EEE')[0]}</span>
                  <span className="text-sm font-semibold">{getDate(day)}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <tr key={habit.id} className="border-b border-zinc-100 dark:border-zinc-900 last:border-0 group">
              <td className="sticky left-0 z-10 bg-white dark:bg-zinc-950 p-4 border-r border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between group/title">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: habit.color }} 
                    />
                    <span className="text-sm font-medium truncate max-w-[120px]">
                      {habit.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col">
                      <button 
                        onClick={() => moveHabit(habit.id, 'up')}
                        className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm text-zinc-300 hover:text-zinc-600 transition-colors"
                      >
                        <ChevronUp className="w-2.5 h-2.5" />
                      </button>
                      <button 
                        onClick={() => moveHabit(habit.id, 'down')}
                        className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm text-zinc-300 hover:text-zinc-600 transition-colors"
                      >
                        <ChevronDown className="w-2.5 h-2.5" />
                      </button>
                    </div>
                    <button 
                      onClick={() => onEditHabit(habit)}
                      className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-colors"
                    >
                      <Settings2 className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Delete this habit and all its history?')) {
                          deleteHabit(habit.id);
                        }
                      }}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              </td>
              {days.map(day => {
                const isActive = getDayStatus(habit.id, day);
                return (
                  <td key={day.toString()} className="p-1">
                    <button
                      onClick={() => toggleCompletion(habit.id, format(day, 'yyyy-MM-dd'))}
                      className={clsx(
                        "w-full aspect-square rounded-md transition-all duration-200 transform active:scale-90",
                        isActive 
                          ? "shadow-sm border-transparent" 
                          : "bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                      )}
                      style={{ 
                        backgroundColor: isActive ? habit.color : undefined,
                        opacity: isActive ? 1 : 0.4
                      }}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
