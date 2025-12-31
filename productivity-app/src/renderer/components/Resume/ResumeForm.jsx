import React, { useState } from 'react';

function ResumeForm({ resume, onChange }) {
  const [expandedSections, setExpandedSections] = useState(['personalInfo', 'summary']);

  const toggleSection = (id) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handlePersonalInfoChange = (field, value) => {
    onChange({
      personalInfo: { ...resume.personalInfo, [field]: value }
    });
  };

  const handleSummaryChange = (value) => {
    onChange({ summary: value });
  };

  const handleNameChange = (value) => {
    onChange({ name: value });
  };

  const handleSectionItemChange = (sectionId, itemIndex, field, value) => {
    const sections = resume.sections.map(section => {
      if (section.id === sectionId) {
        const items = [...section.items];
        items[itemIndex] = { ...items[itemIndex], [field]: value };
        return { ...section, items };
      }
      return section;
    });
    onChange({ sections });
  };

  const handleAddItem = (sectionId) => {
    const sections = resume.sections.map(section => {
      if (section.id === sectionId) {
        const newItem = getDefaultItem(section.type);
        return { ...section, items: [...section.items, newItem] };
      }
      return section;
    });
    onChange({ sections });
  };

  const handleRemoveItem = (sectionId, itemIndex) => {
    const sections = resume.sections.map(section => {
      if (section.id === sectionId) {
        const items = section.items.filter((_, i) => i !== itemIndex);
        return { ...section, items };
      }
      return section;
    });
    onChange({ sections });
  };

  const getDefaultItem = (type) => {
    switch (type) {
      case 'experience':
        return { company: '', title: '', startDate: '', endDate: '', current: false, responsibilities: '' };
      case 'education':
        return { school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' };
      case 'skills':
        return { category: '', skills: '' };
      case 'projects':
        return { name: '', description: '', techStack: '', link: '' };
      default:
        return {};
    }
  };

  const renderSectionContent = (section) => {
    switch (section.type) {
      case 'experience':
        return section.items.map((item, i) => (
          <div key={i} className="bg-[#0d1117] rounded-lg p-4 mb-3 border border-[#21262d]">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm text-[#8b949e]">Experience {i + 1}</span>
              <button onClick={() => handleRemoveItem(section.id, i)} className="text-[#f85149] text-sm hover:underline">
                Remove
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={item.company || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'company', e.target.value)} placeholder="Company" className="input" />
              <input type="text" value={item.title || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'title', e.target.value)} placeholder="Job Title" className="input" />
              <input type="text" value={item.startDate || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'startDate', e.target.value)} placeholder="Start Date" className="input" />
              <input type="text" value={item.endDate || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'endDate', e.target.value)} placeholder="End Date" className="input" />
            </div>
            <textarea value={item.responsibilities || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'responsibilities', e.target.value)} placeholder="Responsibilities (one per line)" rows={3} className="input w-full mt-3 resize-none" />
          </div>
        ));

      case 'education':
        return section.items.map((item, i) => (
          <div key={i} className="bg-[#0d1117] rounded-lg p-4 mb-3 border border-[#21262d]">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm text-[#8b949e]">Education {i + 1}</span>
              <button onClick={() => handleRemoveItem(section.id, i)} className="text-[#f85149] text-sm hover:underline">Remove</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={item.school || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'school', e.target.value)} placeholder="School" className="input" />
              <input type="text" value={item.degree || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'degree', e.target.value)} placeholder="Degree" className="input" />
              <input type="text" value={item.field || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'field', e.target.value)} placeholder="Field of Study" className="input" />
              <input type="text" value={item.gpa || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'gpa', e.target.value)} placeholder="GPA" className="input" />
              <input type="text" value={item.startDate || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'startDate', e.target.value)} placeholder="Start Date" className="input" />
              <input type="text" value={item.endDate || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'endDate', e.target.value)} placeholder="End Date" className="input" />
            </div>
          </div>
        ));

      case 'skills':
        return section.items.map((item, i) => (
          <div key={i} className="bg-[#0d1117] rounded-lg p-4 mb-3 border border-[#21262d]">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm text-[#8b949e]">Skill Category {i + 1}</span>
              <button onClick={() => handleRemoveItem(section.id, i)} className="text-[#f85149] text-sm hover:underline">Remove</button>
            </div>
            <input type="text" value={item.category || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'category', e.target.value)} placeholder="Category (e.g., Programming Languages)" className="input w-full mb-2" />
            <input type="text" value={item.skills || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'skills', e.target.value)} placeholder="Skills (comma-separated)" className="input w-full" />
          </div>
        ));

      case 'projects':
        return section.items.map((item, i) => (
          <div key={i} className="bg-[#0d1117] rounded-lg p-4 mb-3 border border-[#21262d]">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm text-[#8b949e]">Project {i + 1}</span>
              <button onClick={() => handleRemoveItem(section.id, i)} className="text-[#f85149] text-sm hover:underline">Remove</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={item.name || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'name', e.target.value)} placeholder="Project Name" className="input" />
              <input type="text" value={item.link || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'link', e.target.value)} placeholder="Link" className="input" />
            </div>
            <input type="text" value={item.techStack || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'techStack', e.target.value)} placeholder="Tech Stack" className="input w-full mt-2" />
            <textarea value={item.description || ''} onChange={(e) => handleSectionItemChange(section.id, i, 'description', e.target.value)} placeholder="Description" rows={2} className="input w-full mt-2 resize-none" />
          </div>
        ));

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#c9d1d9] mb-2">Resume Name</label>
        <input type="text" value={resume.name} onChange={(e) => handleNameChange(e.target.value)} className="input w-full" />
      </div>

      {/* Personal Info */}
      <div className="bg-[#161b22] rounded-xl border border-[#21262d] overflow-hidden">
        <button onClick={() => toggleSection('personalInfo')} className="w-full flex items-center justify-between p-4 text-left hover:bg-[#21262d] transition-colors">
          <h3 className="text-base font-semibold text-[#c9d1d9]">Personal Information</h3>
          <svg className={`w-5 h-5 text-[#8b949e] transition-transform ${expandedSections.includes('personalInfo') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections.includes('personalInfo') && (
          <div className="p-4 pt-0 grid grid-cols-2 gap-3">
            <input type="text" value={resume.personalInfo.fullName || ''} onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)} placeholder="Full Name" className="input" />
            <input type="text" value={resume.personalInfo.title || ''} onChange={(e) => handlePersonalInfoChange('title', e.target.value)} placeholder="Professional Title" className="input" />
            <input type="email" value={resume.personalInfo.email || ''} onChange={(e) => handlePersonalInfoChange('email', e.target.value)} placeholder="Email" className="input" />
            <input type="tel" value={resume.personalInfo.phone || ''} onChange={(e) => handlePersonalInfoChange('phone', e.target.value)} placeholder="Phone" className="input" />
            <input type="text" value={resume.personalInfo.location || ''} onChange={(e) => handlePersonalInfoChange('location', e.target.value)} placeholder="Location" className="input" />
            <input type="url" value={resume.personalInfo.linkedin || ''} onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)} placeholder="LinkedIn URL" className="input" />
            <input type="url" value={resume.personalInfo.github || ''} onChange={(e) => handlePersonalInfoChange('github', e.target.value)} placeholder="GitHub URL" className="input" />
            <input type="url" value={resume.personalInfo.portfolio || ''} onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)} placeholder="Portfolio URL" className="input" />
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-[#161b22] rounded-xl border border-[#21262d] overflow-hidden">
        <button onClick={() => toggleSection('summary')} className="w-full flex items-center justify-between p-4 text-left hover:bg-[#21262d] transition-colors">
          <h3 className="text-base font-semibold text-[#c9d1d9]">Professional Summary</h3>
          <svg className={`w-5 h-5 text-[#8b949e] transition-transform ${expandedSections.includes('summary') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections.includes('summary') && (
          <div className="p-4 pt-0">
            <textarea value={resume.summary || ''} onChange={(e) => handleSummaryChange(e.target.value)} placeholder="Write a brief professional summary..." rows={4} className="input w-full resize-none" />
          </div>
        )}
      </div>

      {/* Dynamic Sections */}
      {resume.sections.map(section => (
        <div key={section.id} className="bg-[#161b22] rounded-xl border border-[#21262d] overflow-hidden">
          <button onClick={() => toggleSection(section.id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-[#21262d] transition-colors">
            <h3 className="text-base font-semibold text-[#c9d1d9]">{section.title}</h3>
            <svg className={`w-5 h-5 text-[#8b949e] transition-transform ${expandedSections.includes(section.id) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSections.includes(section.id) && (
            <div className="p-4 pt-0">
              {renderSectionContent(section)}
              <button onClick={() => handleAddItem(section.id)} className="w-full py-2.5 border-2 border-dashed border-[#30363d] rounded-lg text-[#8b949e] hover:border-[#238636] hover:text-[#3fb950] transition-colors text-sm">
                + Add {section.type === 'skills' ? 'Category' : section.type.slice(0, -1)}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ResumeForm;
