import React, { useState, useMemo } from 'react';
import { TAGS } from './Calendar';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function WeekView({ currentDate, entries, onSlotClick, onEventClick }) {
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const getEventsForDateHour = (date, hour) => {
    const dateStr = date.toISOString().split('T')[0];
    return entries.filter(e => e.date === dateStr && e.startHour === hour);
  };

  const getEventAtDateHour = (date, hour) => {
    const dateStr = date.toISOString().split('T')[0];
    return entries.find(e => 
      e.date === dateStr && 
      hour >= e.startHour && 
      hour < e.startHour + (e.duration || 1)
    );
  };

  const formatHour = (hour) => {
    if (hour === 0) return '12a';
    if (hour === 12) return '12p';
    return hour < 12 ? `${hour}a` : `${hour - 12}p`;
  };

  const handleMouseDown = (dayIndex, hour) => {
    const event = getEventAtDateHour(weekDays[dayIndex], hour);
    if (!event) {
      setSelectionStart({ dayIndex, hour });
      setSelectionEnd({ dayIndex, hour });
      setIsSelecting(true);
    }
  };

  const handleMouseEnter = (dayIndex, hour) => {
    if (isSelecting && selectionStart?.dayIndex === dayIndex) {
      setSelectionEnd({ dayIndex, hour });
    }
  };

  const handleMouseUp = () => {
    if (isSelecting && selectionStart) {
      const dateStr = weekDays[selectionStart.dayIndex].toISOString().split('T')[0];
      const start = Math.min(selectionStart.hour, selectionEnd.hour);
      const end = Math.max(selectionStart.hour, selectionEnd.hour) + 1;
      onSlotClick(dateStr, start, end);
    }
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const isInSelection = (dayIndex, hour) => {
    if (!isSelecting || !selectionStart || selectionStart.dayIndex !== dayIndex) return false;
    const start = Math.min(selectionStart.hour, selectionEnd.hour);
    const end = Math.max(selectionStart.hour, selectionEnd.hour);
    return hour >= start && hour <= end;
  };

  return (
    <div 
      className="h-full overflow-auto bg-[#0d1117]"
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        if (isSelecting) {
          setIsSelecting(false);
          setSelectionStart(null);
          setSelectionEnd(null);
        }
      }}
    >
      <div className="min-w-[900px]">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#0d1117] border-b border-[#21262d]">
          <div className="grid grid-cols-8 gap-px">
            <div className="w-16"></div>
            {weekDays.map((day, i) => {
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div key={i} className="p-3 text-center">
                  <div className="text-xs text-[#8b949e] uppercase tracking-wider">{DAYS[day.getDay()]}</div>
                  <div className={`text-2xl font-semibold mt-1 ${
                    isToday ? 'text-[#3fb950]' : 'text-[#c9d1d9]'
                  }`}>
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time grid */}
        <div className="relative">
          {HOURS.map(hour => (
            <div key={hour} className="grid grid-cols-8 gap-px border-b border-[#21262d]">
              <div className="w-16 p-2 text-xs text-[#8b949e] text-right pr-3 bg-[#0d1117]">
                {formatHour(hour)}
              </div>
              {weekDays.map((day, dayIndex) => {
                const event = getEventAtDateHour(day, hour);
                const isStart = event && event.startHour === hour;
                const inSelection = isInSelection(dayIndex, hour);
                const tagConfig = event?.tag ? TAGS[event.tag] : null;
                
                return (
                  <div
                    key={dayIndex}
                    onMouseDown={() => handleMouseDown(dayIndex, hour)}
                    onMouseEnter={() => handleMouseEnter(dayIndex, hour)}
                    className={`min-h-[48px] p-1 transition-all cursor-pointer relative ${
                      inSelection 
                        ? 'bg-[#238636]/30' 
                        : 'bg-[#161b22] hover:bg-[#21262d]'
                    }`}
                  >
                    {isStart && event && (
                      <div
                        className="absolute inset-x-1 rounded-md p-2 z-10 cursor-pointer hover:brightness-110 transition-all"
                        style={{ 
                          backgroundColor: tagConfig ? `${tagConfig.color}25` : '#238636/25',
                          borderLeft: `3px solid ${tagConfig?.color || '#238636'}`,
                          height: `${(event.duration || 1) * 48 - 4}px`,
                        }}
                        onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                      >
                        <div 
                          className="text-xs font-medium truncate"
                          style={{ color: tagConfig?.color || '#3fb950' }}
                        >
                          {event.title}
                        </div>
                        {event.duration > 1 && (
                          <div className="text-[10px] text-[#8b949e] mt-0.5">
                            {event.duration}h
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeekView;
