import React from 'react';
import useStore from '../store/useStore';

function Dashboard() {
  const { setCurrentModule, jobApplications, calendarEntries, resumes } = useStore();

  const cards = [
    {
      id: 'jobs',
      title: 'Job Tracker',
      description: 'Track applications with Sankey visualization',
      gradient: 'from-[#238636] to-[#2ea043]',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      stats: [
        { label: 'Total', value: jobApplications.length },
        { label: 'Active', value: jobApplications.filter(j => !['Rejected', 'Offer Accepted', 'Offer Declined', 'Withdrawn'].includes(j.status)).length },
        { label: 'Interviews', value: jobApplications.filter(j => ['Phone Screen', 'Technical Interview', 'Behavioral Interview', 'Final Round'].includes(j.status)).length },
      ]
    },
    {
      id: 'calendar',
      title: 'Calendar 2026',
      description: 'Hour-by-hour planning with activity tracking',
      gradient: 'from-[#8957e5] to-[#a371f7]',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      stats: [
        { label: 'Events', value: calendarEntries.length },
        { label: 'Hours', value: calendarEntries.reduce((sum, e) => sum + (e.duration || 1), 0) },
        { label: 'Tags', value: [...new Set(calendarEntries.map(e => e.tag).filter(Boolean))].length },
      ]
    },
    {
      id: 'resume',
      title: 'Resume Builder',
      description: 'Create professional resumes with live preview',
      gradient: 'from-[#1f6feb] to-[#58a6ff]',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      stats: [
        { label: 'Resumes', value: resumes.length },
        { label: 'Templates', value: 5 },
        { label: 'Versions', value: resumes.reduce((acc, r) => acc + (r.version || 1), 0) },
      ]
    }
  ];

  return (
    <div className="h-full p-8 overflow-auto bg-[#0d1117]">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-[#c9d1d9]">Welcome back</h1>
          <p className="text-[#8b949e] mt-2">Your productivity dashboard — all data auto-saved</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => setCurrentModule(card.id)}
              className="group relative bg-[#161b22] border border-[#21262d] rounded-xl p-6 text-left transition-all duration-300 hover:border-[#30363d] hover:shadow-lg hover:shadow-black/20"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`} />
              
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} text-white`}>
                  {card.icon}
                </div>
                <svg 
                  className="w-5 h-5 text-[#484f58] group-hover:text-[#8b949e] group-hover:translate-x-1 transition-all" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              <h2 className="text-lg font-semibold text-[#c9d1d9] mb-1">{card.title}</h2>
              <p className="text-[#8b949e] text-sm mb-5">{card.description}</p>
              
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#21262d]">
                {card.stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xl font-bold text-[#c9d1d9]">{stat.value}</div>
                    <div className="text-xs text-[#484f58]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6">
            <h3 className="text-base font-semibold text-[#c9d1d9] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { icon: '➕', label: 'Add Job Application', module: 'jobs' },
                { icon: '📝', label: 'Log Activity', module: 'calendar' },
                { icon: '✏️', label: 'Edit Resume', module: 'resume' },
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentModule(action.module)}
                  className="w-full flex items-center gap-3 p-3 bg-[#0d1117] hover:bg-[#21262d] rounded-lg transition-colors text-[#c9d1d9] text-sm"
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6">
            <h3 className="text-base font-semibold text-[#c9d1d9] mb-4">Keyboard Shortcuts</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Job Tracker', shortcut: 'Ctrl + 1' },
                { label: 'Calendar', shortcut: 'Ctrl + 2' },
                { label: 'Resume Builder', shortcut: 'Ctrl + 3' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[#8b949e]">{item.label}</span>
                  <kbd className="px-2 py-1 bg-[#0d1117] border border-[#30363d] rounded text-xs text-[#8b949e] font-mono">
                    {item.shortcut}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
