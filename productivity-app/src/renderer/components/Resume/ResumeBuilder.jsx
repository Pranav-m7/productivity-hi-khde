import React, { useState, useEffect, useCallback } from 'react';
import useStore from '../../store/useStore';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import TemplateSelector from './TemplateSelector';

const DEFAULT_RESUME = {
  name: 'My Resume',
  template: 'modern',
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    location: '',
  },
  summary: '',
  sections: [
    { id: 'experience', type: 'experience', title: 'Work Experience', items: [] },
    { id: 'education', type: 'education', title: 'Education', items: [] },
    { id: 'skills', type: 'skills', title: 'Skills', items: [] },
    { id: 'projects', type: 'projects', title: 'Projects', items: [] },
  ],
};

function ResumeBuilder() {
  const { resumes, activeResumeId, addResume, updateResume, deleteResume, setActiveResumeId } = useStore();
  const [currentResume, setCurrentResume] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [showTemplates, setShowTemplates] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState(null);

  useEffect(() => {
    if (activeResumeId) {
      const resume = resumes.find(r => r.id === activeResumeId);
      if (resume) {
        setCurrentResume(resume);
        return;
      }
    }
    if (resumes.length > 0) {
      setCurrentResume(resumes[0]);
      setActiveResumeId(resumes[0].id);
    } else {
      const newResume = { ...DEFAULT_RESUME, id: crypto.randomUUID() };
      setCurrentResume(newResume);
    }
  }, [resumes, activeResumeId, setActiveResumeId]);

  const debouncedSave = useCallback((resume) => {
    if (saveTimeout) clearTimeout(saveTimeout);
    const timeout = setTimeout(async () => {
      if (resumes.find(r => r.id === resume.id)) {
        await updateResume(resume);
      } else {
        await addResume(resume);
      }
    }, 300);
    setSaveTimeout(timeout);
  }, [saveTimeout, resumes, updateResume, addResume]);

  const handleChange = useCallback((updates) => {
    setCurrentResume(prev => {
      const updated = { ...prev, ...updates };
      debouncedSave(updated);
      return updated;
    });
  }, [debouncedSave]);

  const handleNewResume = () => {
    const newResume = { ...DEFAULT_RESUME, id: crypto.randomUUID(), name: `Resume ${resumes.length + 1}` };
    setCurrentResume(newResume);
    addResume(newResume);
    setActiveResumeId(newResume.id);
  };

  const handleSelectResume = (id) => {
    const resume = resumes.find(r => r.id === id);
    if (resume) {
      setCurrentResume(resume);
      setActiveResumeId(id);
    }
  };

  const handleDeleteResume = async () => {
    if (!currentResume || resumes.length <= 1) return;
    if (confirm('Delete this resume?')) {
      await deleteResume(currentResume.id);
      const remaining = resumes.filter(r => r.id !== currentResume.id);
      if (remaining.length > 0) {
        setCurrentResume(remaining[0]);
        setActiveResumeId(remaining[0].id);
      }
    }
  };

  const handleTemplateChange = (template) => {
    handleChange({ template });
    setShowTemplates(false);
  };

  if (!currentResume) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0d1117]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#238636] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#8b949e] text-sm">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#0d1117]">
      <header className="px-6 py-4 border-b border-[#21262d] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-[#c9d1d9]">Resume Builder</h1>
          <select
            value={currentResume.id}
            onChange={(e) => handleSelectResume(e.target.value)}
            className="select text-sm"
          >
            {resumes.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <button onClick={handleNewResume} className="btn-secondary text-sm">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New
          </button>
          {resumes.length > 1 && (
            <button onClick={handleDeleteResume} className="btn-secondary text-sm text-[#f85149] border-[#f8514930]">
              Delete
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowTemplates(true)} className="btn-secondary text-sm">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Templates
          </button>
          <div className="flex items-center gap-2 bg-[#21262d] rounded-lg px-3 py-1.5">
            <button 
              onClick={() => setZoom(Math.max(50, zoom - 10))} 
              className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-sm text-[#8b949e] w-12 text-center">{zoom}%</span>
            <button 
              onClick={() => setZoom(Math.min(200, zoom + 10))} 
              className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 overflow-auto border-r border-[#21262d] p-4">
          <ResumeForm resume={currentResume} onChange={handleChange} />
        </div>
        <div className="w-1/2 overflow-auto bg-[#161b22] p-6">
          <ResumePreview resume={currentResume} zoom={zoom} />
        </div>
      </div>

      {showTemplates && (
        <TemplateSelector
          currentTemplate={currentResume.template}
          onSelect={handleTemplateChange}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}

export default ResumeBuilder;
