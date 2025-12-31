import React from 'react';

const TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Clean two-column layout with accent colors' },
  { id: 'classic', name: 'Classic', description: 'Traditional single-column professional style' },
  { id: 'technical', name: 'Technical', description: 'ATS-optimized monospace design' },
  { id: 'creative', name: 'Creative', description: 'Stylish sidebar with gradient colors' },
  { id: 'minimal', name: 'Minimal', description: 'Ultra-clean with generous white space' },
];

function TemplateSelector({ currentTemplate, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#161b22] rounded-xl border border-[#30363d] shadow-2xl w-full max-w-3xl mx-4 p-6 fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#c9d1d9]">Choose Template</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#21262d] rounded-lg transition-colors text-[#8b949e] hover:text-[#c9d1d9]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-[1.02] ${
                currentTemplate === template.id
                  ? 'border-[#238636] bg-[#238636]/10'
                  : 'border-[#30363d] hover:border-[#484f58]'
              }`}
            >
              <div className="h-32 bg-white rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                <TemplatePreview template={template.id} />
              </div>
              <h3 className="font-medium text-[#c9d1d9]">{template.name}</h3>
              <p className="text-xs text-[#8b949e] mt-1">{template.description}</p>
              {currentTemplate === template.id && (
                <span className="inline-flex items-center gap-1 mt-2 text-xs text-[#3fb950]">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Selected
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplatePreview({ template }) {
  const styles = {
    modern: (
      <div className="w-full h-full p-2 text-[4px]">
        <div className="border-b-2 border-blue-500 pb-1 mb-1">
          <div className="font-bold text-[6px]">Name</div>
          <div className="text-blue-500 text-[4px]">Title</div>
        </div>
        <div className="space-y-1">
          <div className="h-1 bg-gray-200 w-3/4"></div>
          <div className="h-1 bg-gray-200 w-full"></div>
          <div className="h-1 bg-gray-200 w-2/3"></div>
        </div>
      </div>
    ),
    classic: (
      <div className="w-full h-full p-2 text-[4px] text-center">
        <div className="font-bold text-[6px] uppercase">NAME</div>
        <div className="text-gray-500 text-[3px]">email • phone</div>
        <div className="border-b border-black mt-2 mb-1"></div>
        <div className="space-y-1 text-left">
          <div className="h-1 bg-gray-200 w-full"></div>
          <div className="h-1 bg-gray-200 w-3/4"></div>
        </div>
      </div>
    ),
    technical: (
      <div className="w-full h-full p-1 font-mono text-[3px]">
        <div className="bg-gray-100 p-1 mb-1">
          <div className="font-bold text-[5px]">Name</div>
        </div>
        <div className="bg-gray-800 text-white px-1 text-[3px] mb-1">SECTION</div>
        <div className="space-y-0.5">
          <div className="h-0.5 bg-gray-200 w-full"></div>
          <div className="h-0.5 bg-gray-200 w-2/3"></div>
        </div>
      </div>
    ),
    creative: (
      <div className="w-full h-full flex">
        <div className="w-1/3 bg-gradient-to-b from-purple-600 to-blue-600 p-1">
          <div className="text-white text-[4px] font-bold">Name</div>
        </div>
        <div className="w-2/3 p-1">
          <div className="text-purple-600 text-[4px] font-bold mb-1">About</div>
          <div className="space-y-0.5">
            <div className="h-0.5 bg-gray-200 w-full"></div>
            <div className="h-0.5 bg-gray-200 w-3/4"></div>
          </div>
        </div>
      </div>
    ),
    minimal: (
      <div className="w-full h-full p-3 text-[4px]">
        <div className="text-[8px] font-light mb-2">Name</div>
        <div className="text-gray-400 text-[3px] uppercase tracking-wider mb-1">Section</div>
        <div className="space-y-1">
          <div className="h-0.5 bg-gray-200 w-full"></div>
          <div className="h-0.5 bg-gray-200 w-2/3"></div>
        </div>
      </div>
    ),
  };

  return styles[template] || styles.modern;
}

export default TemplateSelector;
