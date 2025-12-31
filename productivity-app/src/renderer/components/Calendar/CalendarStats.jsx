import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { TAGS } from './Calendar';

function CalendarStats({ entries }) {
  const stats = useMemo(() => {
    const tagHours = {};
    const hourlyActivity = Array(24).fill(0);
    const dailyActivity = Array(7).fill(0);

    entries.forEach(entry => {
      const tag = entry.tag || 'untagged';
      const duration = entry.duration || 1;
      tagHours[tag] = (tagHours[tag] || 0) + duration;
      
      if (entry.startHour !== undefined) {
        hourlyActivity[entry.startHour] += duration;
      }
      
      if (entry.date) {
        const day = new Date(entry.date).getDay();
        dailyActivity[day] += duration;
      }
    });

    const pieData = Object.entries(tagHours)
      .filter(([tag]) => tag !== 'untagged')
      .map(([tag, value]) => ({
        name: TAGS[tag]?.name || tag,
        value,
        color: TAGS[tag]?.color || '#8b949e'
      }));

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyData = dailyActivity.map((hours, i) => ({
      day: days[i],
      hours
    }));

    const totalHours = Object.values(tagHours).reduce((a, b) => a + b, 0);
    const mostProductiveHour = hourlyActivity.indexOf(Math.max(...hourlyActivity));
    const mostProductiveDay = dailyActivity.indexOf(Math.max(...dailyActivity));

    return {
      pieData,
      dailyData,
      totalHours,
      totalEvents: entries.length,
      mostProductiveHour,
      mostProductiveDay: days[mostProductiveDay],
      tagHours,
    };
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="p-6 text-center text-[#8b949e]">
        <div className="text-4xl mb-4">📊</div>
        <p className="font-medium">No activities yet</p>
        <p className="text-sm mt-2">Start logging to see statistics</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 bg-[#0d1117]">
      <h3 className="text-lg font-semibold text-[#c9d1d9]">Statistics</h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#161b22] rounded-xl p-4 border border-[#21262d]">
          <div className="text-3xl font-bold text-[#3fb950]">{stats.totalEvents}</div>
          <div className="text-xs text-[#8b949e] mt-1">Activities</div>
        </div>
        <div className="bg-[#161b22] rounded-xl p-4 border border-[#21262d]">
          <div className="text-3xl font-bold text-[#58a6ff]">{stats.totalHours}h</div>
          <div className="text-xs text-[#8b949e] mt-1">Total Hours</div>
        </div>
      </div>

      {/* Tag breakdown */}
      <div className="bg-[#161b22] rounded-xl p-4 border border-[#21262d]">
        <h4 className="text-sm font-medium text-[#c9d1d9] mb-3">Hours by Tag</h4>
        <div className="space-y-2">
          {Object.entries(TAGS).map(([key, tag]) => {
            const hours = stats.tagHours[key] || 0;
            const percentage = stats.totalHours > 0 ? (hours / stats.totalHours) * 100 : 0;
            
            return (
              <div key={key}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-[#8b949e]">{tag.name}</span>
                  <span style={{ color: tag.color }}>{hours}h</span>
                </div>
                <div className="h-2 bg-[#21262d] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ width: `${percentage}%`, backgroundColor: tag.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {stats.pieData.length > 0 && (
        <div className="bg-[#161b22] rounded-xl p-4 border border-[#21262d]">
          <h4 className="text-sm font-medium text-[#c9d1d9] mb-3">Distribution</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {stats.pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length > 0) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-2 text-sm">
                          <div className="text-[#c9d1d9]">{data.name}</div>
                          <div className="text-[#8b949e]">{data.value} hours</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-[#161b22] rounded-xl p-4 border border-[#21262d]">
        <h4 className="text-sm font-medium text-[#c9d1d9] mb-3">Activity by Day</h4>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.dailyData}>
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#8b949e', fontSize: 10 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis hide />
              <Bar dataKey="hours" fill="#238636" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#161b22] rounded-xl p-4 border border-[#21262d]">
        <h4 className="text-sm font-medium text-[#c9d1d9] mb-3">Insights</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#8b949e]">Most productive day</span>
            <span className="text-[#c9d1d9] font-medium">{stats.mostProductiveDay}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8b949e]">Peak hour</span>
            <span className="text-[#c9d1d9] font-medium">{stats.mostProductiveHour}:00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8b949e]">Avg per day</span>
            <span className="text-[#c9d1d9] font-medium">
              {(stats.totalHours / 7).toFixed(1)}h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarStats;
