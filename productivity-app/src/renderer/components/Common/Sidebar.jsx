import React, { useState } from 'react';
import useStore from '../../store/useStore';

const menuItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    shortcut: '',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  { 
    id: 'jobs', 
    label: 'Job Tracker', 
    shortcut: '⌘1',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    id: 'calendar', 
    label: 'Calendar', 
    shortcut: '⌘2',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    id: 'resume', 
    label: 'Resume', 
    shortcut: '⌘3',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
];

function Sidebar() {
  const { currentModule, setCurrentModule } = useStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`bg-[#010409] border-r border-[#21262d] flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="p-4 border-b border-[#21262d] flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#238636] to-[#2ea043] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-[#c9d1d9]">Productivity</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-[#21262d] rounded-lg transition-colors text-[#8b949e]"
        >
          <svg className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentModule(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-200 group ${
              currentModule === item.id
                ? 'bg-[#21262d] text-[#c9d1d9]'
                : 'text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9]'
            }`}
          >
            <span className={`transition-colors ${currentModule === item.id ? 'text-[#3fb950]' : 'group-hover:text-[#c9d1d9]'}`}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-[#484f58]">{item.shortcut}</span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#21262d]">
        {!isCollapsed && (
          <div className="flex items-center gap-2 text-xs text-[#484f58]">
            <div className="w-2 h-2 rounded-full bg-[#238636] animate-pulse"></div>
            <span>Auto-save enabled</span>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
