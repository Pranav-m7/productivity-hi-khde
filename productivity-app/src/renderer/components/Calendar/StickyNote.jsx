import React from 'react';
import { TAGS } from './Calendar';

function StickyNote({ event, compact, expanded, onClick }) {
  const tagConfig = event.tag ? TAGS[event.tag] : null;
  const color = tagConfig?.color || '#238636';

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="px-2 py-1 rounded text-xs truncate cursor-pointer transition-all hover:brightness-110"
        style={{ 
          backgroundColor: `${color}20`,
          color: color,
          borderLeft: `2px solid ${color}`
        }}
      >
        {event.title}
      </div>
    );
  }

  if (expanded) {
    return (
      <div
        onClick={onClick}
        className="rounded-lg p-3 cursor-pointer transition-all hover:brightness-110"
        style={{ 
          backgroundColor: `${color}15`,
          borderLeft: `4px solid ${color}`,
          minHeight: event.duration ? `${event.duration * 50}px` : 'auto'
        }}
      >
        <div className="font-medium" style={{ color }}>{event.title}</div>
        {event.description && (
          <div className="text-sm text-[#8b949e] mt-1 line-clamp-2">{event.description}</div>
        )}
        <div className="flex items-center gap-2 mt-2 text-xs text-[#8b949e]">
          {tagConfig && (
            <span 
              className="px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${color}25`, color }}
            >
              {tagConfig.name}
            </span>
          )}
          {event.duration && <span>{event.duration}h</span>}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="px-2 py-1 rounded text-xs cursor-pointer transition-all hover:brightness-110"
      style={{ 
        backgroundColor: `${color}20`,
        color: color,
        borderLeft: `2px solid ${color}`
      }}
    >
      <div className="font-medium truncate">{event.title}</div>
    </div>
  );
}

export default StickyNote;
