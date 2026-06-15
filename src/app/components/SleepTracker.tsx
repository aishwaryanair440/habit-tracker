import React, { useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isToday,
  getDate,
  parseISO,
  isSameMonth
} from 'date-fns';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Dot,
  ReferenceLine
} from 'recharts';

export function SleepTracker() {
  const { currentMonth, sleepLogs, setSleepDuration } = useHabits();
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const data = days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const log = sleepLogs.find(l => l.date === dateStr);
    return {
      date: dateStr,
      day: getDate(day),
      duration: log ? log.duration : 0,
      isToday: isToday(day)
    };
  });

  const averageSleep = useMemo(() => {
    const logsInMonth = sleepLogs.filter(l => isSameMonth(parseISO(l.date), currentMonth));
    if (logsInMonth.length === 0) return 0;
    const total = logsInMonth.reduce((acc, curr) => acc + curr.duration, 0);
    return (total / logsInMonth.length).toFixed(1);
  }, [sleepLogs, currentMonth]);

  const handleChartClick = (state: any) => {
    if (state && state.activePayload && state.activePayload.length) {
      const payload = state.activePayload[0].payload;
      const hours = prompt(`Enter sleep hours for ${payload.date}:`, payload.duration.toString());
      if (hours !== null) {
        const parsed = parseFloat(hours);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 24) {
          setSleepDuration(payload.date, parsed);
        }
      }
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-lg shadow-xl text-xs">
          <p className="font-semibold mb-1 text-zinc-400">
            {format(parseISO(payload[0].payload.date), 'MMMM do')}
          </p>
          <p className="text-zinc-900 dark:text-zinc-100 font-medium">{payload[0].value} Hours</p>
        </div>
      );
    }
    return null;
  };

  const RenderDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined) return null;
    
    return (
      <Dot
        cx={cx}
        cy={cy}
        r={payload.isToday ? 4 : 3}
        fill={payload.duration > 0 ? (payload.isToday ? '#18181b' : '#3f3f46') : '#e4e4e7'}
        stroke={payload.isToday ? (payload.duration > 0 ? '#ffffff' : '#18181b') : 'none'}
        strokeWidth={2}
        className="transition-all duration-300"
      />
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 h-[320px] select-none flex flex-col">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            id="sleep-tracker-chart"
            data={data} 
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            onClick={handleChartClick}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#f4f4f5" 
              className="dark:stroke-zinc-900"
            />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              fontSize={10} 
              tick={{ fill: '#a1a1aa' }}
              interval={4}
              tickFormatter={(value) => getDate(parseISO(value)).toString()}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              fontSize={10} 
              tick={{ fill: '#a1a1aa' }}
              domain={[0, 12]}
              ticks={[0, 4, 8, 12]}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#f4f4f5', strokeWidth: 1 }} 
            />
            <ReferenceLine 
              y={8} 
              stroke="#e4e4e7" 
              strokeDasharray="3 3" 
              label={{ position: 'right', value: '8h', fill: '#a1a1aa', fontSize: 10 }}
              className="dark:stroke-zinc-800"
            />
            <Line 
              type="linear" 
              dataKey="duration" 
              stroke="#18181b" 
              strokeWidth={1.5}
              dot={<RenderDot />}
              activeDot={{ r: 5, fill: '#18181b' }}
              connectNulls
              className="dark:stroke-zinc-400"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Avg Sleep</span>
          <span className="text-sm font-bold">{averageSleep}h</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Goal</span>
          <span className="text-sm font-bold">8.0h</span>
        </div>
      </div>
    </div>
  );
}
