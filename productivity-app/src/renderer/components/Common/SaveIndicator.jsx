import React, { useEffect, useState } from 'react';
import useStore from '../../store/useStore';

function SaveIndicator() {
  const { saveStatus } = useStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (saveStatus === 'saved') {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    } else if (saveStatus === 'saving' || saveStatus === 'error') {
      setVisible(true);
    }
  }, [saveStatus]);

  if (!visible) return null;

  return (
    <div className={`fixed bottom-4 right-4 px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 border ${
      saveStatus === 'saved' 
        ? 'bg-[#238636]/20 border-[#238636]/30 text-[#3fb950]' 
        : saveStatus === 'saving' 
        ? 'bg-[#9e6a03]/20 border-[#9e6a03]/30 text-[#d29922]' 
        : 'bg-[#da3633]/20 border-[#da3633]/30 text-[#f85149]'
    }`}>
      {saveStatus === 'saved' && (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">Saved</span>
        </>
      )}
      {saveStatus === 'saving' && (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Saving...</span>
        </>
      )}
      {saveStatus === 'error' && (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-sm font-medium">Save failed</span>
        </>
      )}
    </div>
  );
}

export default SaveIndicator;
