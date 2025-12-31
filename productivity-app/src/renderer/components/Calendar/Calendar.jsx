import React, { useState, useMemo } from 'react';
import useStore from '../../store/useStore';
import CalendarHeader from './CalendarHeader';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import YearView from './YearView';
import EventModal from './EventModal';
import CalendarStats from './CalendarStats';
import ActivityHeatmap from './ActivityHeatmap';

// Predefined tags with colors
export const TAGS = {
  'k8s': { color: '#3b82f6', bg: 'bg-blue-500', name: 'Kubernetes' },
  'security-engg': { color: '#a855f7', bg: 'bg-purple-500', name: 'Security Engineering' },
  'cloud-engg': { color: '#84cc16', bg: 'bg-lime-500', name: 'Cloud Engineering' },
  'ctfs-wiz': { color: '#f87171', bg: 'bg-red-400', name: 'CTFs & Wiz' },
  'study': { color: '#8b5cf6', bg: 'bg-violet-500', name: 'Study' },
  'work': { color: '#06b6d4', bg: 'bg-cyan-500', name: 'Work' },
  'personal': { color: '#f59e0b', bg: 'bg-amber-500', name: 'Personal' },
};

function Calendar() {
  const { calendarEntries, addCalendarEntry, updateCalendarEntry, deleteCalendarEntry } = useStore();
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);

  const handlePrev = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (view === 'year') d.setFullYear(d.getFullYear() - 1);
      else if (view === 'month') d.setMonth(d.getMonth() - 1);
      else if (view === 'week') d.setDate(d.getDate() - 7);
      else d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const handleNext = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (view === 'year') d.setFullYear(d.getFullYear() + 1);
      else if (view === 'month') d.setMonth(d.getMonth() + 1);
      else if (view === 'week') d.setDate(d.getDate() + 7);
      else d.setDate(d.getDate() + 1);
      return d;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 0, 1));
  };

  const handleSlotClick = (date, hour, endHour = null) => {
    setSelectedSlot({ date, hour, endHour });
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event) => {
    setEditingEvent(event);
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleSave = async (eventData) => {
    if (editingEvent) {
      await updateCalendarEntry({ ...editingEvent, ...eventData });
    } else {
      await addCalendarEntry({ ...eventData, id: crypto.randomUUID() });
    }
    setIsModalOpen(false);
    setEditingEvent(null);
    setSelectedSlot(null);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this event?')) {
      await deleteCalendarEntry(id);
      setIsModalOpen(false);
      setEditingEvent(null);
    }
  };

  const handleDateSelect = (date) => {
    setCurrentDate(date);
    if (view === 'year') setView('month');
    else if (view === 'month') setView('day');
  };

  const renderView = () => {
    const props = {
      currentDate,
      entries: calendarEntries,
      onSlotClick: handleSlotClick,
      onEventClick: handleEventClick,
      onDateSelect: handleDateSelect,
    };

    switch (view) {
      case 'year':
        return <YearView {...props} />;
      case 'week':
        return <WeekView {...props} />;
      case 'day':
        return <DayView {...props} />;
      default:
        return <MonthView {...props} />;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#0d1117]">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onToggleStats={() => setShowStats(!showStats)}
        onToggleHeatmap={() => setShowHeatmap(!showHeatmap)}
        showHeatmap={showHeatmap}
      />

      {showHeatmap && (
        <div className="px-6 py-4 border-b border-[#21262d]">
          <ActivityHeatmap entries={calendarEntries} year={currentDate.getFullYear()} />
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 overflow-auto transition-all ${showStats ? 'mr-80' : ''}`}>
          {renderView()}
        </div>
        
        {showStats && (
          <div className="w-80 border-l border-[#21262d] overflow-auto bg-[#0d1117]">
            <CalendarStats entries={calendarEntries} />
          </div>
        )}
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingEvent(null); setSelectedSlot(null); }}
        onSave={handleSave}
        onDelete={editingEvent ? () => handleDelete(editingEvent.id) : null}
        initialData={editingEvent}
        selectedSlot={selectedSlot}
      />
    </div>
  );
}

export default Calendar;
