import React, { useMemo } from 'react';
import { TAGS } from './Calendar';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function YearView({ currentDate, entries, onDateSelect }) {
  const year = currentDate.getFullYear();

  const getMonthCalendar = (month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    return days;
  };

  const getDayData = (month, day) => {
    if (!day) return null;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEntries = entries.filter(e => e.date === dateStr);
    const totalHours = dayEntries.reduce((sum, e) => sum + (e.duration || 1), 0);
    const tags = [...new Set(dayEntries.map(e => e.tag).filter(Boolean))];
    return { totalHours, tags };
  };

  const getColor = (dayData) => {
    if (!dayData || dayData.totalHours === 0) return 'bg-[#161b22]';
    
    if (dayData.tags.length > 0) {
      const primaryTag = dayData.tags[0];
      const tagConfig = TAGS[primaryTag];
      if (tagConfig) {
        return ''; // Will use inline style
      }
    }
    
    // Default green gradient based on hours
    const intensity = Math.min(dayData.totalHours / 8, 1);
    if (intensity < 0.25) return 'bg-[#0e4429]';
    if (intensity < 0.5) return 'bg-[#006d32]';
    if (intensity < 0.75) return 'bg-[#26a641]';
    return 'bg-[#39d353]';
  };

  const getInlineColor = (dayData) => {
    if (!dayData || dayData.totalHours === 0 || dayData.tags.length === 0) return null;
    const primaryTag = dayData.tags[0];
    const tagConfig = TAGS[primaryTag];
    return tagConfig?.color || null;
  };

  return (
    <div className="h-full overflow-auto p-6 bg-[#0d1117]">
      <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto">
        {MONTHS.map((monthName, month) => (
          <div key={month} className="bg-[#161b22] rounded-xl p-4 border border-[#21262d]">
            <h3 className="text-center font-medium text-[#c9d1d9] mb-3">{monthName}</h3>
            <div className="grid grid-cols-7 gap-0.5 text-[10px]">
              {DAYS.map((d, i) => (
                <div key={i} className="text-center text-[#8b949e] py-1 font-medium">{d}</div>
              ))}
              {getMonthCalendar(month).map((day, i) => {
                const dayData = getDayData(month, day);
                const inlineColor = getInlineColor(dayData);
                
                return (
                  <div
                    key={i}
                    onClick={() => day && onDateSelect(new Date(year, month, day))}
                    className={`aspect-square flex items-center justify-center rounded-sm cursor-pointer transition-all text-[10px] ${
                      day ? `hover:ring-1 hover:ring-[#8b949e] ${getColor(dayData)}` : ''
                    } ${dayData?.totalHours > 0 ? 'text-white font-medium' : 'text-[#8b949e]'}`}
                    style={inlineColor ? { backgroundColor: inlineColor } : undefined}
                    title={dayData?.totalHours ? `${dayData.totalHours}h${dayData.tags.length ? ` (${dayData.tags.map(t => TAGS[t]?.name).join(', ')})` : ''}` : ''}
                  >
                    {day || ''}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default YearView;
