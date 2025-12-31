import React, { useState, useMemo, useCallback } from 'react';
import useStore from '../../store/useStore';
import JobTable from './JobTable';
import SankeyDiagram from './SankeyDiagram';
import JobModal from './JobModal';
import StatsCards from './StatsCards';

const STATUS_OPTIONS = [
  'Applied', 'No Response', 'Rejected', 'Online Assessment', 
  'Phone Screen', 'Technical Interview', 'Behavioral Interview', 
  'Final Round', 'Offer Received', 'Offer Accepted', 'Offer Declined', 'Withdrawn'
];

function JobTracker() {
  const { jobApplications, addJobApplication, updateJobApplication, deleteJobApplication } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [filters, setFilters] = useState({ status: '', search: '', dateFrom: '', dateTo: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'dateApplied', direction: 'desc' });
  const [selectedIds, setSelectedIds] = useState([]);

  const filteredJobs = useMemo(() => {
    let result = [...jobApplications];
    
    if (filters.status) {
      result = result.filter(j => j.status === filters.status);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(j => 
        j.company?.toLowerCase().includes(search) || 
        j.position?.toLowerCase().includes(search)
      );
    }
    if (filters.dateFrom) {
      result = result.filter(j => j.dateApplied >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter(j => j.dateApplied <= filters.dateTo);
    }

    result.sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      const modifier = sortConfig.direction === 'asc' ? 1 : -1;
      return aVal > bVal ? modifier : -modifier;
    });

    return result;
  }, [jobApplications, filters, sortConfig]);

  const handleAddNew = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleSave = async (job) => {
    if (editingJob) {
      await updateJobApplication({ ...editingJob, ...job });
    } else {
      await addJobApplication({ ...job, id: crypto.randomUUID() });
    }
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this application?')) {
      await deleteJobApplication(id);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Delete ${selectedIds.length} selected applications?`)) {
      for (const id of selectedIds) {
        await deleteJobApplication(id);
      }
      setSelectedIds([]);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleCellEdit = useCallback(async (id, field, value) => {
    const job = jobApplications.find(j => j.id === id);
    if (job) {
      await updateJobApplication({ ...job, [field]: value });
    }
  }, [jobApplications, updateJobApplication]);

  const handleSankeyClick = (status) => {
    setFilters(prev => ({ ...prev, status: prev.status === status ? '' : status }));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#0d1117]">
      <header className="px-6 py-4 border-b border-[#21262d]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-[#c9d1d9]">Job Application Tracker</h1>
            <p className="text-[#8b949e] text-sm mt-0.5">Track and visualize your job search progress</p>
          </div>
          <button onClick={handleAddNew} className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Application
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#484f58]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search company or position..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="input pl-10 w-64"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="select"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            className="input"
            placeholder="From"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            className="input"
            placeholder="To"
          />
          {selectedIds.length > 0 && (
            <button onClick={handleBulkDelete} className="btn-secondary text-[#f85149] border-[#f8514930]">
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <StatsCards applications={jobApplications} />
        
        <div className="mb-6">
          <SankeyDiagram applications={jobApplications} onNodeClick={handleSankeyClick} />
        </div>

        <JobTable
          jobs={filteredJobs}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCellEdit={handleCellEdit}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      <JobModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingJob(null); }}
        onSave={handleSave}
        initialData={editingJob}
      />
    </div>
  );
}

export default JobTracker;
