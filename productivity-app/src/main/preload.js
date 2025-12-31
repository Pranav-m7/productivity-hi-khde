const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Job Applications
  jobs: {
    getAll: () => ipcRenderer.invoke('jobs:getAll'),
    save: (data) => ipcRenderer.invoke('jobs:save', data),
    delete: (id) => ipcRenderer.invoke('jobs:delete', id),
    bulkDelete: (ids) => ipcRenderer.invoke('jobs:bulkDelete', ids),
    bulkUpdate: (ids, updates) => ipcRenderer.invoke('jobs:bulkUpdate', ids, updates),
  },

  // Calendar
  calendar: {
    getAll: () => ipcRenderer.invoke('calendar:getAll'),
    save: (data) => ipcRenderer.invoke('calendar:save', data),
    delete: (id) => ipcRenderer.invoke('calendar:delete', id),
    getTemplates: () => ipcRenderer.invoke('calendar:getTemplates'),
    saveTemplate: (data) => ipcRenderer.invoke('calendar:saveTemplate', data),
  },

  // Resumes
  resumes: {
    getAll: () => ipcRenderer.invoke('resumes:getAll'),
    save: (data) => ipcRenderer.invoke('resumes:save', data),
    delete: (id) => ipcRenderer.invoke('resumes:delete', id),
    getActive: () => ipcRenderer.invoke('resumes:getActive'),
    setActive: (id) => ipcRenderer.invoke('resumes:setActive', id),
  },

  // App State
  state: {
    get: () => ipcRenderer.invoke('state:get'),
    save: (state) => ipcRenderer.invoke('state:save', state),
    getLastModule: () => ipcRenderer.invoke('state:getLastModule'),
    setLastModule: (module) => ipcRenderer.invoke('state:setLastModule', module),
  },

  // Settings
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    save: (settings) => ipcRenderer.invoke('settings:save', settings),
  },

  // Backup
  backup: {
    create: () => ipcRenderer.invoke('backup:create'),
    list: () => ipcRenderer.invoke('backup:list'),
    restore: (path) => ipcRenderer.invoke('backup:restore', path),
  },
});
