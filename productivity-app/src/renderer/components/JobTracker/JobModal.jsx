import React, { useState, useEffect } from 'react';
import Modal from '../Common/Modal';

const STATUS_OPTIONS = [
  'Applied', 'No Response', 'Rejected', 'Online Assessment', 
  'Phone Screen', 'Technical Interview', 'Behavioral Interview', 
  'Final Round', 'Offer Received', 'Offer Accepted', 'Offer Declined', 'Withdrawn'
];

const INITIAL_STATE = {
  company: '',
  position: '',
  dateApplied: new Date().toISOString().split('T')[0],
  status: 'Applied',
  applicationLink: '',
  contactPerson: '',
  contactEmail: '',
  phoneScreenDate: '',
  technicalInterviewDate: '',
  finalInterviewDate: '',
  offerDate: '',
  salaryOffered: '',
  benefits: '',
  notes: '',
  followUpDate: '',
  priority: 'Medium',
};

function JobModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(INITIAL_STATE);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...INITIAL_STATE, ...initialData });
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Application' : 'Add Application'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Company *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="input w-full"
              placeholder="e.g., Google"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Position *</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="input w-full"
              placeholder="e.g., Software Engineer"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Date Applied</label>
            <input
              type="date"
              name="dateApplied"
              value={formData.dateApplied}
              onChange={handleChange}
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="select w-full"
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="select w-full"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Application Link</label>
          <input
            type="url"
            name="applicationLink"
            value={formData.applicationLink}
            onChange={handleChange}
            className="input w-full"
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              className="input w-full"
              placeholder="Recruiter name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="input w-full"
              placeholder="recruiter@company.com"
            />
          </div>
        </div>

        <div className="border-t border-[#21262d] pt-4">
          <h4 className="text-sm font-medium text-[#c9d1d9] mb-3">Interview Dates</h4>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-[#8b949e] mb-1">Phone Screen</label>
              <input type="date" name="phoneScreenDate" value={formData.phoneScreenDate} onChange={handleChange} className="input w-full text-sm" />
            </div>
            <div>
              <label className="block text-xs text-[#8b949e] mb-1">Technical</label>
              <input type="date" name="technicalInterviewDate" value={formData.technicalInterviewDate} onChange={handleChange} className="input w-full text-sm" />
            </div>
            <div>
              <label className="block text-xs text-[#8b949e] mb-1">Final Round</label>
              <input type="date" name="finalInterviewDate" value={formData.finalInterviewDate} onChange={handleChange} className="input w-full text-sm" />
            </div>
            <div>
              <label className="block text-xs text-[#8b949e] mb-1">Offer Date</label>
              <input type="date" name="offerDate" value={formData.offerDate} onChange={handleChange} className="input w-full text-sm" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Salary Offered</label>
            <input type="text" name="salaryOffered" value={formData.salaryOffered} onChange={handleChange} className="input w-full" placeholder="$100,000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Follow-up Date</label>
            <input type="date" name="followUpDate" value={formData.followUpDate} onChange={handleChange} className="input w-full" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="input w-full resize-none"
            placeholder="Additional notes..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#21262d]">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {initialData ? 'Save Changes' : 'Add Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default JobModal;
