import React, { useState, useCallback } from 'react';
import { TAGS } from './Calendar';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function DayView({ currentDate, entries, onSlotClick, onEventClick }) {
  const dateStr = currentDate.toISOString().split('T')[0];
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  
  const getEventsForHour = (hour) => {
    return entries.filter(e => e.date === dateStr && e.startHour === hour);
  };

  const isHourOccupied = (hour) => {
    return entries.some(e => 
      e.date === dateStr && 
      hour >= e.startHour && 
      hour < e.startHour + (e.duration || 1)
    );
  };

  const getEventAtHour = (hour) => {
    return entries.find(e => 
      e.date === dateStr && 
      hour >= e.startHour && 
      hour < e.startHour + (e.duration || 1)
    );
  };

  const formatHour = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  const handleMouseDown = (hour) => {
    if (!isHourOccupied(hour)) {
      setSelectionStart(hour);
      setSelectionEnd(hour);
      setIsSelecting(true);
    }
  };

  const handleMouseEnter = (hour) => {
    if (isSelecting && !isHourOccupied(hour)) {
      setSelectionEnd(hour);
    }
  };

  const handleMouseUp = () => {
    if (isSelecting && selectionStart !== null) {
      const start = Math.min(selectionStart, selectionEnd);
      const end = Math.max(selectionStart, selectionEnd) + 1;
      onSlotClick(dateStr, start, end);
    }
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  const isInSelection = (hour) => {
    if (!isSelecting || selectionStart === null) return false;
    const start = Math.min(selectionStart, selectionEnd);
    const end = Math.max(selectionStart, selectionEnd);
    return hour >= start && hour <= end;
  };

  // Group consecutive events
  const groupedEvents = entries
    .filter(e => e.date === dateStr)
    .sort((a, b) => a.startHour - b.startHour);

  return (
    <div 
      className="h-full overflow-auto p-6 bg-[#0d1117]"
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        if (isSelecting) {
          setIsSelecting(false);
          setSelectionStart(null);
          setSelectionEnd(null);
        }
      }}
    >
      <div className="mb-6 text-center">
        <div className="text-[#8b949e] text-sm">{DAYS[currentDate.getDay()]}</div>
        <div className="text-4xl font-bold text-[#c9d1d9] mt-1">{currentDate.getDate()}</div>
        <div className="text-[#8b949e]">{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
      </div>

      {/* Quick stats */}
      <div className="flex justify-center gap-4 mb-6">
        {Object.entries(TAGS).slice(0, 4).map(([key, tag]) => {
          const hours = groupedEvents
            .filter(e => e.tag === key)
            .reduce((sum, e) => sum + (e.duration || 1), 0);
          if (hours === 0) return null;
          return (
            <div 
              key={key}
              className="px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
            >
              {tag.name}: {hours}h
            </div>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto">
        <p className="text-xs text-[#8b949e] mb-4 text-center">
          💡 Click and drag to select multiple hours
        </p>
        
        {HOURS.map(hour => {
          const event = getEventAtHour(hour);
          const isStart = event && event.startHour === hour;
          const inSelection = isInSelection(hour);
          const tagConfig = event?.tag ? TAGS[event.tag] : null;
          
          return (
            <div
              key={hour}
              onMouseDown={() => handleMouseDown(hour)}
              onMouseEnter={() => handleMouseEnter(hour)}
              onClick={() => {
                if (event) {
                  onEventClick(event);
                }
              }}
              className={`flex border-b border-[#21262d] transition-all cursor-pointer select-none ${
                inSelection ? 'bg-[#238636]/30' : 'hover:bg-[#161b22]'
              }`}
            >
              <div className="w-20 p-3 text-sm text-[#8b949e] text-right border-r border-[#21262d] flex-shrink-0">
                {formatHour(hour)}
              </div>
              <div className="flex-1 min-h-[56px] p-2 relative">
                {isStart && event && (
                  <div
                    className="absolute inset-x-2 rounded-lg p-3 transition-all hover:scale-[1.01] cursor-pointer"
                    style={{ 
                      backgroundColor: tagConfig ? `${tagConfig.color}20` : '#238636/20',
                      borderLeft: `4px solid ${tagConfig?.color || '#238636'}`,
                      height: `${(event.duration || 1) * 56 - 8}px`,
                      zIndex: 10
                    }}
                    onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                  >
                    <div 
                      className="font-medium"
                      style={{ color: tagConfig?.color || '#3fb950' }}
                    >
                      {event.title}
                    </div>
                    {event.description && (
                      <div className="text-sm text-[#8b949e] mt-1 line-clamp-2">{event.description}</div>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-[#8b949e]">
                      {tagConfig && (
                        <span 
                          className="px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${tagConfig.color}30`, color: tagConfig.color }}
                        >
                          {tagConfig.name}
                        </span>
                      )}
                      <span>{event.duration || 1}h</span>
                    </div>
                  </div>
                )}
                {!event && !inSelection && (
                  <div className="h-full flex items-center justify-center text-[#484f58] text-sm opacity-0 hover:opacity-100 transition-opacity">
                    + Add activity
                  </div>
                )}
                {inSelection && (
                  <div className="h-full flex items-center justify-center text-[#3fb950] text-sm font-medium">
                    {selectionStart !== null && (
                      `${Math.abs(selectionEnd - selectionStart) + 1}h selected`
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DayView;
