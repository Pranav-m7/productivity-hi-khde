import React, { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import { TAGS } from './Calendar';

const INITIAL_STATE = {
  title: '',
  description: '',
  date: '',
  startHour: 9,
  endHour: 10,
  duration: 1,
  tag: '',
  recurring: null,
};

function EventModal({ isOpen, onClose, onSave, onDelete, initialData, selectedSlot }) {
  const [formData, setFormData] = useState(INITIAL_STATE);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...INITIAL_STATE,
        ...initialData,
        endHour: initialData.startHour + (initialData.duration || 1),
      });
    } else if (selectedSlot) {
      setFormData({
        ...INITIAL_STATE,
        date: selectedSlot.date,
        startHour: selectedSlot.hour,
        endHour: selectedSlot.endHour || selectedSlot.hour + 1,
        duration: selectedSlot.endHour ? selectedSlot.endHour - selectedSlot.hour : 1,
      });
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [initialData, selectedSlot, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'startHour' || name === 'endHour') {
        const start = name === 'startHour' ? parseInt(value) : parseInt(prev.startHour);
        const end = name === 'endHour' ? parseInt(value) : parseInt(prev.endHour);
        updated.duration = Math.max(1, end - start);
      }
      return updated;
    });
  };

  const handleTagSelect = (tagKey) => {
    setFormData(prev => ({
      ...prev,
      tag: prev.tag === tagKey ? '' : tagKey
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      startHour: parseInt(formData.startHour),
      duration: parseInt(formData.duration),
    });
  };

  const formatHour = (hour) => {
    if (hour === 0) return '12:00 AM';
    if (hour === 12) return '12:00 PM';
    if (hour === 24) return '12:00 AM';
    return hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Activity' : 'Log Activity'} size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-[#c9d1d9] placeholder-[#484f58] focus:outline-none focus:border-[#238636] focus:ring-1 focus:ring-[#238636] transition-all"
            placeholder="What did you work on?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-[#c9d1d9] placeholder-[#484f58] focus:outline-none focus:border-[#238636] focus:ring-1 focus:ring-[#238636] transition-all resize-none"
            placeholder="Optional details..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Tag</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(TAGS).map(([key, tag]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleTagSelect(key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  formData.tag === key
                    ? 'ring-2 ring-offset-2 ring-offset-[#161b22]'
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{ 
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                  ringColor: tag.color
                }}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-[#c9d1d9] focus:outline-none focus:border-[#238636] focus:ring-1 focus:ring-[#238636] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Start Time</label>
            <select
              name="startHour"
              value={formData.startHour}
              onChange={handleChange}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-[#c9d1d9] focus:outline-none focus:border-[#238636] cursor-pointer"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{formatHour(i)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">End Time</label>
            <select
              name="endHour"
              value={formData.endHour}
              onChange={handleChange}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2.5 text-[#c9d1d9] focus:outline-none focus:border-[#238636] cursor-pointer"
            >
              {Array.from({ length: 24 }, (_, i) => i + 1).filter(h => h > formData.startHour).map(h => (
                <option key={h} value={h}>{formatHour(h === 24 ? 0 : h)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-[#161b22] rounded-lg p-4 border border-[#21262d]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8b949e]">Duration</span>
            <span className="text-lg font-semibold text-[#c9d1d9]">
              {formData.duration} hour{formData.duration !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="mt-2 h-2 bg-[#21262d] rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all"
              style={{ 
                width: `${Math.min((formData.duration / 12) * 100, 100)}%`,
                backgroundColor: formData.tag ? TAGS[formData.tag]?.color : '#238636'
              }}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-[#21262d]">
          <div>
            {onDelete && (
              <button 
                type="button" 
                onClick={onDelete} 
                className="px-4 py-2 text-[#f85149] hover:bg-[#f8514920] rounded-lg transition-colors font-medium"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg transition-colors font-medium"
            >
              {initialData ? 'Save Changes' : 'Log Activity'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default EventModal;
