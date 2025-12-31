import React, { useMemo } from 'react';
import { TAGS } from './Calendar';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function ActivityHeatmap({ entries, year }) {
  const heatmapData = useMemo(() => {
    const data = {};
    
    // Initialize all days of the year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      data[dateStr] = { tags: [], totalHours: 0 };
    }

    // Fill in activity data
    entries.forEach(entry => {
      if (entry.date && data[entry.date]) {
        const duration = entry.duration || 1;
        data[entry.date].totalHours += duration;
        if (entry.tag && !data[entry.date].tags.includes(entry.tag)) {
          data[entry.date].tags.push(entry.tag);
        }
      }
    });

    return data;
  }, [entries, year]);

  const weeks = useMemo(() => {
    const result = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Adjust to start from Sunday
    const firstSunday = new Date(startDate);
    firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay());
    
    let currentWeek = [];
    for (let d = new Date(firstSunday); d <= endDate || currentWeek.length > 0; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 0 && currentWeek.length > 0) {
        result.push(currentWeek);
        currentWeek = [];
      }
      
      if (d <= endDate) {
        const dateStr = d.toISOString().split('T')[0];
        const isCurrentYear = d.getFullYear() === year;
        currentWeek.push({
          date: dateStr,
          data: isCurrentYear ? heatmapData[dateStr] : null,
          isCurrentYear,
          month: d.getMonth(),
          day: d.getDate()
        });
      }
    }
    
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }
    
    return result;
  }, [heatmapData, year]);

  const getColor = (dayData) => {
    if (!dayData || !dayData.data || dayData.data.totalHours === 0) {
      return '#161b22';
    }
    
    const tags = dayData.data.tags;
    if (tags.length === 0) {
      // Default green for activity without tags
      const intensity = Math.min(dayData.data.totalHours / 8, 1);
      const colors = ['#0e4429', '#006d32', '#26a641', '#39d353'];
      return colors[Math.floor(intensity * 3)];
    }
    
    // Use the primary tag color
    const primaryTag = tags[0];
    const tagConfig = TAGS[primaryTag];
    if (tagConfig) {
      return tagConfig.color;
    }
    
    return '#39d353';
  };

  const getMonthLabels = () => {
    const labels = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week.find(d => d.isCurrentYear);
      if (firstDayOfWeek && firstDayOfWeek.month !== lastMonth) {
        labels.push({ month: MONTHS[firstDayOfWeek.month], weekIndex });
        lastMonth = firstDayOfWeek.month;
      }
    });
    
    return labels;
  };

  const totalContributions = useMemo(() => {
    return Object.values(heatmapData).reduce((sum, day) => sum + day.totalHours, 0);
  }, [heatmapData]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#c9d1d9]">
          {totalContributions.toFixed(0)} hours logged in {year}
        </h3>
        <div className="flex items-center gap-4">
          {Object.entries(TAGS).slice(0, 4).map(([key, tag]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div 
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: tag.color }}
              />
              <span className="text-xs text-[#8b949e]">{tag.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-block">
          {/* Month labels */}
          <div className="flex text-xs text-[#8b949e] mb-1 ml-8">
            {getMonthLabels().map((label, i) => (
              <div 
                key={i} 
                className="absolute"
                style={{ marginLeft: `${label.weekIndex * 13 + 32}px` }}
              >
                {label.month}
              </div>
            ))}
          </div>
          
          <div className="flex gap-0.5 mt-5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1 text-xs text-[#8b949e]">
              <div className="h-[11px]"></div>
              <div className="h-[11px] flex items-center">Mon</div>
              <div className="h-[11px]"></div>
              <div className="h-[11px] flex items-center">Wed</div>
              <div className="h-[11px]"></div>
              <div className="h-[11px] flex items-center">Fri</div>
              <div className="h-[11px]"></div>
            </div>
            
            {/* Heatmap grid */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="w-[11px] h-[11px] rounded-sm transition-all hover:ring-1 hover:ring-[#8b949e] cursor-pointer"
                    style={{ 
                      backgroundColor: day.isCurrentYear ? getColor(day) : 'transparent'
                    }}
                    title={day.isCurrentYear ? `${day.date}: ${day.data?.totalHours || 0}h${day.data?.tags.length ? ` (${day.data.tags.join(', ')})` : ''}` : ''}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1 text-xs text-[#8b949e]">
        <span>Less</span>
        <div className="w-[11px] h-[11px] rounded-sm bg-[#161b22]" />
        <div className="w-[11px] h-[11px] rounded-sm bg-[#0e4429]" />
        <div className="w-[11px] h-[11px] rounded-sm bg-[#006d32]" />
        <div className="w-[11px] h-[11px] rounded-sm bg-[#26a641]" />
        <div className="w-[11px] h-[11px] rounded-sm bg-[#39d353]" />
        <span>More</span>
      </div>
    </div>
  );
}

export default ActivityHeatmap;
