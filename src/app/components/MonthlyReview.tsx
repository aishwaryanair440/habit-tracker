import React, { useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth,
  isBefore,
  subDays,
  parseISO
} from 'date-fns';
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Flame, 
  Moon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart,
  Area
} from 'recharts';

export function MonthlyReview() {
  const { currentMonth, habits, completions, sleepLogs } = useHabits();
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate Insights
  const insights = useMemo(() => {
    const habitStats = habits.map(habit => {
      const habitCompletions = completions.filter(c => 
        c.habitId === habit.id && 
        isSameMonth(parseISO(c.date), currentMonth)
      );
      
      const completionRate = (habitCompletions.length / daysInMonth.length) * 100;

      // Simple streak calculation (for current month only for simplicity)
      let streak = 0;
      const sortedDates = habitCompletions
        .map(c => c.date)
        .sort((a, b) => b.localeCompare(a));
      
      // ... actual streak logic could be more complex across months
      // For now, let's just count total days
      
      return {
        ...habit,
        total: habitCompletions.length,
        rate: completionRate.toFixed(1),
      };
    }).sort((a, b) => b.total - a.total);

    const avgSleep = sleepLogs
      .filter(l => isSameMonth(parseISO(l.date), currentMonth))
      .reduce((acc, curr) => acc + curr.duration, 0) / (sleepLogs.length || 1);

    return {
      bestHabit: habitStats[0],
      strugglingHabit: habitStats[habitStats.length - 1],
      avgSleep: avgSleep.toFixed(1),
      totalCheckins: completions.filter(c => isSameMonth(parseISO(c.date), currentMonth)).length,
      habitStats
    };
  }, [habits, completions, sleepLogs, currentMonth, daysInMonth.length]);

  // Weekly Trend Data
  const trendData = useMemo(() => {
    return daysInMonth.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const count = completions.filter(c => c.date === dateStr).length;
      return {
        date: format(day, 'd'),
        count
      };
    });
  }, [daysInMonth, completions]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-12">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Monthly Insights</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Analysis for {format(currentMonth, 'MMMM yyyy')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          label="Best Performer"
          value={insights.bestHabit?.name || 'N/A'}
          subValue={`${insights.bestHabit?.rate || 0}% Completion`}
        />
        <StatCard 
          label="Average Sleep"
          value={`${insights.avgSleep}h`}
          subValue="Consistency focus"
        />
        <StatCard 
          label="Total Check-ins"
          value={insights.totalCheckins.toString()}
          subValue="Across all habits"
        />
        <StatCard 
          label="Consistency"
          value={insights.strugglingHabit ? `${insights.strugglingHabit.name}` : 'N/A'}
          subValue="Needs attention"
          isWarning={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Weekly Trend Chart */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold">Monthly Activity Trend</h2>
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart id="monthly-activity-trend" data={trendData}>
                <defs>
                  <linearGradient id="colorCountMonthly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  tick={{ fill: '#71717a' }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCountMonthly)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Habit Ranking */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Habit Ranking</h2>
          <div className="space-y-3">
            {insights.habitStats.map((habit, idx) => (
              <div 
                key={`rank-${habit.id}-${idx}`}
                className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-zinc-400">#{idx + 1}</span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color }} />
                  <span className="text-sm font-medium">{habit.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">{habit.rate}%</div>
                  <div className="text-[10px] text-zinc-400">{habit.total} days</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, isWarning }: any) {
  return (
    <div className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            {icon}
          </div>
        )}
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-bold truncate">{value}</h3>
        <p className={`text-xs ${isWarning ? 'text-orange-500' : 'text-zinc-500'} font-medium`}>
          {subValue}
        </p>
      </div>
    </div>
  );
}
