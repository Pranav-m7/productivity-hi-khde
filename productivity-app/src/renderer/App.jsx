import React, { useEffect, useState } from 'react';
import useStore from './store/useStore';
import Dashboard from './components/Dashboard';
import JobTracker from './components/JobTracker/JobTracker';
import Calendar from './components/Calendar/Calendar';
import ResumeBuilder from './components/Resume/ResumeBuilder';
import Sidebar from './components/Common/Sidebar';
import SaveIndicator from './components/Common/SaveIndicator';
import ToastContainer from './components/Common/Toast';

function App() {
  const { currentModule, loadInitialData } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await loadInitialData();
      setIsLoading(false);
    };
    init();
  }, [loadInitialData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            useStore.getState().setCurrentModule('jobs');
            break;
          case '2':
            e.preventDefault();
            useStore.getState().setCurrentModule('calendar');
            break;
          case '3':
            e.preventDefault();
            useStore.getState().setCurrentModule('resume');
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#238636] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#8b949e] text-sm">Loading your data...</p>
        </div>
      </div>
    );
  }

  const renderModule = () => {
    switch (currentModule) {
      case 'jobs':
        return <JobTracker />;
      case 'calendar':
        return <Calendar />;
      case 'resume':
        return <ResumeBuilder />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0d1117] flex overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {renderModule()}
      </main>
      <SaveIndicator />
      <ToastContainer />
    </div>
  );
}

export default App;
