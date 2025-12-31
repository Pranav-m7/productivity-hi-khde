import React, { useState, useCallback } from 'react';

const STATUS_OPTIONS = [
  'Applied', 'No Response', 'Rejected', 'Online Assessment', 
  'Phone Screen', 'Technical Interview', 'Behavioral Interview', 
  'Final Round', 'Offer Received', 'Offer Accepted', 'Offer Declined', 'Withdrawn'
];

const STATUS_COLORS = {
  'Applied': { bg: '#1f6feb20', text: '#58a6ff' },
  'No Response': { bg: '#484f5820', text: '#8b949e' },
  'Rejected': { bg: '#f8514920', text: '#f85149' },
  'Online Assessment': { bg: '#d2992220', text: '#d29922' },
  'Phone Screen': { bg: '#23863620', text: '#3fb950' },
  'Technical Interview': { bg: '#388bfd20', text: '#58a6ff' },
  'Behavioral Interview': { bg: '#8957e520', text: '#a371f7' },
  'Final Round': { bg: '#db61a220', text: '#db61a2' },
  'Offer Received': { bg: '#23863620', text: '#3fb950' },
  'Offer Accepted': { bg: '#23863620', text: '#3fb950' },
  'Offer Declined': { bg: '#9e6a0320', text: '#d29922' },
  'Withdrawn': { bg: '#484f5820', text: '#8b949e' },
};

const COLUMNS = [
  { key: 'company', label: 'Company', editable: true },
  { key: 'position', label: 'Position', editable: true },
  { key: 'dateApplied', label: 'Date Applied', type: 'date', editable: true },
  { key: 'status', label: 'Status', type: 'select', editable: true },
  { key: 'priority', label: 'Priority', type: 'priority', editable: true },
  { key: 'contactPerson', label: 'Contact', editable: true },
  { key: 'notes', label: 'Notes', editable: true },
];

function EditableCell({ value, onChange, type, onBlur }) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');

  const handleDoubleClick = () => setEditing(true);

  const handleBlur = () => {
    setEditing(false);
    if (tempValue !== value) {
      onChange(tempValue);
    }
    onBlur?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setTempValue(value || '');
      setEditing(false);
    }
  };

  if (type === 'select') {
    const colors = STATUS_COLORS[value] || STATUS_COLORS['Applied'];
    return (
      <select
        value={value || 'Applied'}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 rounded text-xs font-medium bg-transparent border-none cursor-pointer"
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    );
  }

  if (type === 'priority') {
    const colors = {
      High: { bg: '#f8514920', text: '#f85149' },
      Medium: { bg: '#d2992220', text: '#d29922' },
      Low: { bg: '#484f5820', text: '#8b949e' },
    };
    const c = colors[value] || colors.Medium;
    return (
      <select
        value={value || 'Medium'}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 rounded text-xs font-medium bg-transparent border-none cursor-pointer"
        style={{ backgroundColor: c.bg, color: c.text }}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    );
  }

  if (editing) {
    return (
      <input
        type={type === 'date' ? 'date' : 'text'}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full bg-[#0d1117] border border-[#58a6ff] rounded px-2 py-1 text-sm focus:outline-none text-[#c9d1d9]"
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="cursor-text px-2 py-1 hover:bg-[#21262d] rounded min-h-[28px] truncate text-[#c9d1d9]"
      title={value || 'Double-click to edit'}
    >
      {value || <span className="text-[#484f58]">—</span>}
    </div>
  );
}

function JobTable({ jobs, sortConfig, onSort, onEdit, onDelete, onCellEdit, selectedIds, onSelectionChange }) {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectionChange(jobs.map(j => j.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleCellChange = useCallback((id, field, value) => {
    onCellEdit(id, field, value);
  }, [onCellEdit]);

  if (jobs.length === 0) {
    return (
      <div className="bg-[#161b22] border border-[#21262d] rounded-xl text-center py-16">
        <div className="text-4xl mb-4">📋</div>
        <p className="text-[#c9d1d9] font-medium mb-2">No job applications yet</p>
        <p className="text-sm text-[#8b949e]">Click "Add Application" to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-[#161b22] border border-[#21262d] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#21262d]">
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === jobs.length && jobs.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => onSort(col.key)}
                  className="p-3 text-left text-xs font-medium text-[#8b949e] cursor-pointer hover:text-[#c9d1d9] transition-colors uppercase tracking-wider"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortConfig.key === col.key && (
                      <span className="text-[#58a6ff]">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              <th className="p-3 text-left text-xs font-medium text-[#8b949e] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id} className="border-b border-[#21262d] hover:bg-[#161b22] transition-colors">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(job.id)}
                    onChange={() => handleSelectOne(job.id)}
                  />
                </td>
                {COLUMNS.map(col => (
                  <td key={col.key} className="p-2">
                    <EditableCell
                      value={job[col.key]}
                      type={col.type}
                      onChange={(value) => handleCellChange(job.id, col.key, value)}
                    />
                  </td>
                ))}
                <td className="p-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(job)}
                      className="p-1.5 hover:bg-[#21262d] rounded text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(job.id)}
                      className="p-1.5 hover:bg-[#21262d] rounded text-[#8b949e] hover:text-[#f85149] transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-[#21262d] text-sm text-[#8b949e]">
        Showing {jobs.length} applications • Double-click cells to edit inline
      </div>
    </div>
  );
}

export default JobTable;
