import React, { useMemo } from 'react';
import { TAGS } from './Calendar';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function MonthView({ currentDate, entries, onSlotClick, onEventClick, onDateSelect }) {
  const calendar = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];
    
    const prevMonth = new Date(year, month, 0);
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false
      });
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  }, [currentDate]);

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return entries.filter(e => e.date === dateStr);
  };

  const getDayStats = (date) => {
    const events = getEventsForDate(date);
    const totalHours = events.reduce((sum, e) => sum + (e.duration || 1), 0);
    const tags = [...new Set(events.map(e => e.tag).filter(Boolean))];
    return { totalHours, tags, events };
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="h-full p-4 bg-[#0d1117]">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(day => (
          <div key={day} className="text-center text-xs font-medium text-[#8b949e] py-2 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 h-[calc(100%-40px)]">
        {calendar.map((day, i) => {
          const stats = getDayStats(day.date);
          const primaryTag = stats.tags[0];
          const tagConfig = primaryTag ? TAGS[primaryTag] : null;
          
          return (
            <div
              key={i}
              onClick={() => onDateSelect(day.date)}
              className={`min-h-[100px] p-2 rounded-lg border cursor-pointer transition-all hover:border-[#30363d] group ${
                day.isCurrentMonth 
                  ? 'bg-[#161b22] border-[#21262d]' 
                  : 'bg-[#0d1117] border-[#21262d]/50'
              } ${isToday(day.date) ? 'ring-2 ring-[#238636] ring-offset-1 ring-offset-[#0d1117]' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  day.isCurrentMonth ? 'text-[#c9d1d9]' : 'text-[#484f58]'
                } ${isToday(day.date) ? 'text-[#3fb950]' : ''}`}>
                  {day.date.getDate()}
                </span>
                {stats.totalHours > 0 && (
                  <span 
                    className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                    style={{ 
                      backgroundColor: tagConfig ? `${tagConfig.color}20` : '#238636/20',
                      color: tagConfig?.color || '#3fb950'
                    }}
                  >
                    {stats.totalHours}h
                  </span>
                )}
              </div>
              
              <div className="space-y-1 overflow-hidden max-h-[70px]">
                {stats.events.slice(0, 3).map(event => {
                  const eventTag = event.tag ? TAGS[event.tag] : null;
                  return (
                    <div
                      key={event.id}
                      onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                      className="text-xs px-2 py-1 rounded truncate cursor-pointer transition-all hover:brightness-110"
                      style={{ 
                        backgroundColor: eventTag ? `${eventTag.color}20` : '#238636/20',
                        color: eventTag?.color || '#3fb950',
                        borderLeft: `2px solid ${eventTag?.color || '#238636'}`
                      }}
                    >
                      {event.title}
                    </div>
                  );
                })}
                {stats.events.length > 3 && (
                  <div className="text-xs text-[#8b949e] pl-2">
                    +{stats.events.length - 3} more
                  </div>
                )}
              </div>

              {/* Tag indicators */}
              {stats.tags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {stats.tags.slice(0, 4).map(tag => {
                    const config = TAGS[tag];
                    return config ? (
                      <div
                        key={tag}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: config.color }}
                        title={config.name}
                      />
                    ) : null;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthView;
