import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Current module
  currentModule: 'dashboard',
  setCurrentModule: (module) => {
    set({ currentModule: module });
    window.electronAPI?.state.setLastModule(module);
  },

  // Save status
  saveStatus: 'saved',
  setSaveStatus: (status) => set({ saveStatus: status }),

  // Job Applications
  jobApplications: [],
  setJobApplications: (apps) => set({ jobApplications: apps }),
  
  addJobApplication: async (app) => {
    set({ saveStatus: 'saving' });
    try {
      await window.electronAPI.jobs.save(app);
      set((state) => ({
        jobApplications: [...state.jobApplications.filter(a => a.id !== app.id), app],
        saveStatus: 'saved'
      }));
    } catch (error) {
      set({ saveStatus: 'error' });
      console.error('Failed to save job application:', error);
    }
  },

  updateJobApplication: async (app) => {
    set({ saveStatus: 'saving' });
    try {
      await window.electronAPI.jobs.save(app);
      set((state) => ({
        jobApplications: state.jobApplications.map(a => a.id === app.id ? app : a),
        saveStatus: 'saved'
      }));
    } catch (error) {
      set({ saveStatus: 'error' });
    }
  },

  deleteJobApplication: async (id) => {
    set({ saveStatus: 'saving' });
    try {
      await window.electronAPI.jobs.delete(id);
      set((state) => ({
        jobApplications: state.jobApplications.filter(a => a.id !== id),
        saveStatus: 'saved'
      }));
    } catch (error) {
      set({ saveStatus: 'error' });
    }
  },

  // Calendar Entries
  calendarEntries: [],
  setCalendarEntries: (entries) => set({ calendarEntries: entries }),

  addCalendarEntry: async (entry) => {
    set({ saveStatus: 'saving' });
    try {
      await window.electronAPI.calendar.save(entry);
      set((state) => ({
        calendarEntries: [...state.calendarEntries.filter(e => e.id !== entry.id), entry],
        saveStatus: 'saved'
      }));
    } catch (error) {
      set({ saveStatus: 'error' });
    }
  },

  updateCalendarEntry: async (entry) => {
    set({ saveStatus: 'saving' });
    try {
      await window.electronAPI.calendar.save(entry);
      set((state) => ({
        calendarEntries: state.calendarEntries.map(e => e.id === entry.id ? entry : e),
        saveStatus: 'saved'
      }));
    } catch (error) {
      set({ saveStatus: 'error' });
    }
  },

  deleteCalendarEntry: async (id) => {
    set({ saveStatus: 'saving' });
    try {
      await window.electronAPI.calendar.delete(id);
      set((state) => ({
        calendarEntries: state.calendarEntries.filter(e => e.id !== id),
        saveStatus: 'saved'
      }));
    } catch (error) {
      set({ saveStatus: 'error' });
    }
  },

  // Resumes
  resumes: [],
  activeResumeId: null,
  setResumes: (resumes) => set({ resumes }),
  setActiveResumeId: (id) => set({ activeResumeId: id }),

  addResume: async (resume) => {
    set({ saveStatus: 'saving' });
    try {
      await window.electronAPI.resumes.save(resume);
      set((state) => ({
        resumes: [...state.resumes.filter(r => r.id !== resume.id), resume],
        saveStatus: 'saved'
      }));
    } catch (error) {
      set({ saveStatus: 'error' });
    }
  },

  updateResume: async (resume) => {
    set({ saveStatus: 'saving' });
    try {
      await window.electronAPI.resumes.save(resume);
      set((state) => ({
        resumes: state.resumes.map(r => r.id === resume.id ? resume : r),
        saveStatus: 'saved'
      }));
    } catch (error) {
      set({ saveStatus: 'error' });
    }
  },

  deleteResume: async (id) => {
    set({ saveStatus: 'saving' });
    try {
      await window.electronAPI.resumes.delete(id);
      set((state) => ({
        resumes: state.resumes.filter(r => r.id !== id),
        saveStatus: 'saved'
      }));
    } catch (error) {
      set({ saveStatus: 'error' });
    }
  },

  // UI State
  uiState: {
    jobTracker: { filters: {}, sortBy: 'dateApplied', sortOrder: 'desc' },
    calendar: { view: 'month', currentDate: new Date().toISOString() },
    resume: { zoom: 100 }
  },
  setUiState: (module, state) => set((prev) => ({
    uiState: { ...prev.uiState, [module]: { ...prev.uiState[module], ...state } }
  })),

  // Load initial data
  loadInitialData: async () => {
    try {
      if (window.electronAPI) {
        const [jobs, calendar, resumes, activeId, lastModule] = await Promise.all([
          window.electronAPI.jobs.getAll(),
          window.electronAPI.calendar.getAll(),
          window.electronAPI.resumes.getAll(),
          window.electronAPI.resumes.getActive(),
          window.electronAPI.state.getLastModule()
        ]);
        
        set({
          jobApplications: jobs || [],
          calendarEntries: calendar || [],
          resumes: resumes || [],
          activeResumeId: activeId,
          currentModule: lastModule || 'dashboard'
        });
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  }
}));

export default useStore;
