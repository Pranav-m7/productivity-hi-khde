import React from 'react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function CalendarHeader({ currentDate, view, onViewChange, onPrev, onNext, onToday, onToggleStats, onToggleHeatmap, showHeatmap }) {
  const formatTitle = () => {
    if (view === 'year') return currentDate.getFullYear();
    if (view === 'month') return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    if (view === 'week') {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${MONTHS[start.getMonth()]} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${MONTHS[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
  };

  return (
    <header className="px-6 py-4 border-b border-[#21262d] flex items-center justify-between bg-[#0d1117]">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold text-[#c9d1d9]">Calendar</h1>
        
        <div className="flex items-center gap-1 bg-[#21262d] rounded-lg p-1">
          <button 
            onClick={onPrev} 
            className="p-1.5 hover:bg-[#30363d] rounded transition-colors text-[#8b949e] hover:text-[#c9d1d9]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={onToday} 
            className="px-3 py-1.5 text-sm font-medium text-[#c9d1d9] hover:bg-[#30363d] rounded transition-colors"
          >
            Today
          </button>
          <button 
            onClick={onNext} 
            className="p-1.5 hover:bg-[#30363d] rounded transition-colors text-[#8b949e] hover:text-[#c9d1d9]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <span className="text-lg font-medium text-[#c9d1d9]">{formatTitle()}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex bg-[#21262d] rounded-lg p-1">
          {['year', 'month', 'week', 'day'].map(v => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                view === v 
                  ? 'bg-[#238636] text-white' 
                  : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#30363d]'
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        
        <button 
          onClick={onToggleHeatmap}
          className={`p-2 rounded-lg transition-colors ${
            showHeatmap 
              ? 'bg-[#238636]/20 text-[#3fb950]' 
              : 'bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9]'
          }`}
          title="Toggle Activity Heatmap"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
            <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3z"/>
          </svg>
        </button>
        
        <button 
          onClick={onToggleStats} 
          className="p-2 bg-[#21262d] hover:bg-[#30363d] rounded-lg transition-colors text-[#8b949e] hover:text-[#c9d1d9]"
          title="Toggle Statistics"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default CalendarHeader;
