import React, { useMemo } from 'react';

function StatsCards({ applications }) {
  const stats = useMemo(() => {
    const total = applications.length;
    const responses = applications.filter(a => a.status !== 'Applied' && a.status !== 'No Response').length;
    const interviews = applications.filter(a => 
      ['Phone Screen', 'Technical Interview', 'Behavioral Interview', 'Final Round'].includes(a.status)
    ).length;
    const offers = applications.filter(a => 
      ['Offer Received', 'Offer Accepted', 'Offer Declined'].includes(a.status)
    ).length;

    return {
      total,
      responseRate: total > 0 ? ((responses / total) * 100).toFixed(1) : 0,
      interviewRate: total > 0 ? ((interviews / total) * 100).toFixed(1) : 0,
      offerRate: total > 0 ? ((offers / total) * 100).toFixed(1) : 0,
    };
  }, [applications]);

  const cards = [
    { label: 'Total Applied', value: stats.total, color: '#58a6ff', gradient: 'from-[#1f6feb]/20 to-transparent' },
    { label: 'Response Rate', value: `${stats.responseRate}%`, color: '#a371f7', gradient: 'from-[#8957e5]/20 to-transparent' },
    { label: 'Interview Rate', value: `${stats.interviewRate}%`, color: '#3fb950', gradient: 'from-[#238636]/20 to-transparent' },
    { label: 'Offer Rate', value: `${stats.offerRate}%`, color: '#d29922', gradient: 'from-[#9e6a03]/20 to-transparent' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className={`bg-gradient-to-br ${card.gradient} bg-[#161b22] rounded-xl p-4 border border-[#21262d]`}
        >
          <p className="text-[#8b949e] text-sm mb-1">{card.label}</p>
          <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
