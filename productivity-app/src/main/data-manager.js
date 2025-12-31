const fs = require('fs').promises;
const path = require('path');
const { app } = require('electron');
const crypto = require('crypto');

class DataManager {
  constructor() {
    this.dataDir = this.getDataDirectory();
    this.pendingChanges = new Map();
    this.saveQueue = [];
    this.isSaving = false;
    this.cache = new Map();
  }

  getDataDirectory() {
    const appName = 'ProductivityApp';
    switch (process.platform) {
      case 'win32':
        return path.join(process.env.APPDATA || '', appName, 'data');
      case 'darwin':
        return path.join(process.env.HOME || '', 'Library', 'Application Support', appName, 'data');
      default:
        return path.join(process.env.HOME || '', '.config', appName, 'data');
    }
  }

  async initialize() {
    const dirs = [
      this.dataDir,
      path.join(this.dataDir, 'job-applications'),
      path.join(this.dataDir, 'job-applications', 'backups'),
      path.join(this.dataDir, 'calendar'),
      path.join(this.dataDir, 'calendar', 'backups'),
      path.join(this.dataDir, 'resumes'),
      path.join(this.dataDir, 'resumes', 'backups'),
      path.join(this.dataDir, 'app-state'),
      path.join(this.dataDir, 'logs'),
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }

    await this.initializeDefaultFiles();
    this.log('DataManager initialized');
  }

  async initializeDefaultFiles() {
    const defaults = {
      'job-applications/applications.json': { applications: [], lastUpdated: new Date().toISOString() },
      'calendar/calendar-2026.json': { entries: [], lastUpdated: new Date().toISOString() },
      'calendar/templates.json': { templates: [] },
      'resumes/resumes.json': { resumes: [], lastUpdated: new Date().toISOString() },
      'resumes/active-resume-id.json': { activeId: null },
      'app-state/window-state.json': { width: 1400, height: 900, isMaximized: false },
      'app-state/user-preferences.json': { theme: 'dark', autoSave: true },
      'app-state/last-opened-module.json': { module: 'dashboard' },
      'app-state/ui-state.json': { scrollPositions: {}, filters: {}, sortOrders: {} },
      'settings.json': { autoBackupInterval: 5, maxBackups: 10 },
    };

    for (const [filePath, defaultData] of Object.entries(defaults)) {
      const fullPath = path.join(this.dataDir, filePath);
      try {
        await fs.access(fullPath);
      } catch {
        await this.atomicWrite(fullPath, defaultData);
      }
    }
  }

  async atomicWrite(filePath, data) {
    const tempPath = `${filePath}.tmp`;
    const backupPath = `${filePath}.backup`;
    const jsonData = JSON.stringify(data, null, 2);
    const checksum = this.calculateChecksum(jsonData);

    try {
      // Create backup of existing file
      try {
        await fs.copyFile(filePath, backupPath);
      } catch {}

      // Write to temp file
      await fs.writeFile(tempPath, jsonData, 'utf8');

      // Verify temp file
      const written = await fs.readFile(tempPath, 'utf8');
      if (this.calculateChecksum(written) !== checksum) {
        throw new Error('Checksum verification failed');
      }

      // Atomic rename
      await fs.rename(tempPath, filePath);
      
      this.log(`Saved: ${path.basename(filePath)}`);
      return true;
    } catch (error) {
      this.logError(`Save failed: ${filePath}`, error);
      // Try to restore from backup
      try {
        await fs.copyFile(backupPath, filePath);
      } catch {}
      throw error;
    }
  }

  calculateChecksum(data) {
    return crypto.createHash('md5').update(data).digest('hex');
  }

  async readFile(filePath) {
    const fullPath = path.join(this.dataDir, filePath);
    try {
      const data = await fs.readFile(fullPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // Try backup
      try {
        const backupData = await fs.readFile(`${fullPath}.backup`, 'utf8');
        this.log(`Restored from backup: ${filePath}`);
        return JSON.parse(backupData);
      } catch {
        this.logError(`Read failed: ${filePath}`, error);
        throw error;
      }
    }
  }

  async writeFile(filePath, data) {
    const fullPath = path.join(this.dataDir, filePath);
    await this.atomicWrite(fullPath, data);
  }

  // Job Applications
  async getJobApplications() {
    const data = await this.readFile('job-applications/applications.json');
    return data.applications || [];
  }

  async saveJobApplication(application) {
    const data = await this.readFile('job-applications/applications.json');
    const index = data.applications.findIndex(a => a.id === application.id);
    
    if (index >= 0) {
      data.applications[index] = { ...data.applications[index], ...application, updatedAt: new Date().toISOString() };
    } else {
      data.applications.push({ ...application, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    data.lastUpdated = new Date().toISOString();
    await this.writeFile('job-applications/applications.json', data);
    return application;
  }

  async deleteJobApplication(id) {
    const data = await this.readFile('job-applications/applications.json');
    data.applications = data.applications.filter(a => a.id !== id);
    data.lastUpdated = new Date().toISOString();
    await this.writeFile('job-applications/applications.json', data);
    return true;
  }

  async bulkDeleteJobApplications(ids) {
    const data = await this.readFile('job-applications/applications.json');
    data.applications = data.applications.filter(a => !ids.includes(a.id));
    data.lastUpdated = new Date().toISOString();
    await this.writeFile('job-applications/applications.json', data);
    return true;
  }

  async bulkUpdateJobApplications(ids, updates) {
    const data = await this.readFile('job-applications/applications.json');
    data.applications = data.applications.map(a => {
      if (ids.includes(a.id)) {
        return { ...a, ...updates, updatedAt: new Date().toISOString() };
      }
      return a;
    });
    data.lastUpdated = new Date().toISOString();
    await this.writeFile('job-applications/applications.json', data);
    return true;
  }

  // Calendar
  async getCalendarEntries() {
    const data = await this.readFile('calendar/calendar-2026.json');
    return data.entries || [];
  }

  async saveCalendarEntry(entry) {
    const data = await this.readFile('calendar/calendar-2026.json');
    const index = data.entries.findIndex(e => e.id === entry.id);
    
    if (index >= 0) {
      data.entries[index] = { ...data.entries[index], ...entry, updatedAt: new Date().toISOString() };
    } else {
      data.entries.push({ ...entry, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    
    data.lastUpdated = new Date().toISOString();
    await this.writeFile('calendar/calendar-2026.json', data);
    return entry;
  }

  async deleteCalendarEntry(id) {
    const data = await this.readFile('calendar/calendar-2026.json');
    data.entries = data.entries.filter(e => e.id !== id);
    data.lastUpdated = new Date().toISOString();
    await this.writeFile('calendar/calendar-2026.json', data);
    return true;
  }

  async getCalendarTemplates() {
    const data = await this.readFile('calendar/templates.json');
    return data.templates || [];
  }

  async saveCalendarTemplate(template) {
    const data = await this.readFile('calendar/templates.json');
    const index = data.templates.findIndex(t => t.id === template.id);
    
    if (index >= 0) {
      data.templates[index] = template;
    } else {
      data.templates.push(template);
    }
    
    await this.writeFile('calendar/templates.json', data);
    return template;
  }

  // Resumes
  async getResumes() {
    const data = await this.readFile('resumes/resumes.json');
    return data.resumes || [];
  }

  async saveResume(resume) {
    const data = await this.readFile('resumes/resumes.json');
    const index = data.resumes.findIndex(r => r.id === resume.id);
    
    if (index >= 0) {
      data.resumes[index] = { ...data.resumes[index], ...resume, updatedAt: new Date().toISOString(), version: (data.resumes[index].version || 0) + 1 };
    } else {
      data.resumes.push({ ...resume, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1 });
    }
    
    data.lastUpdated = new Date().toISOString();
    await this.writeFile('resumes/resumes.json', data);
    return resume;
  }

  async deleteResume(id) {
    const data = await this.readFile('resumes/resumes.json');
    data.resumes = data.resumes.filter(r => r.id !== id);
    data.lastUpdated = new Date().toISOString();
    await this.writeFile('resumes/resumes.json', data);
    return true;
  }

  async getActiveResumeId() {
    const data = await this.readFile('resumes/active-resume-id.json');
    return data.activeId;
  }

  async setActiveResumeId(id) {
    await this.writeFile('resumes/active-resume-id.json', { activeId: id });
    return true;
  }

  // App State
  async getAppState() {
    return await this.readFile('app-state/ui-state.json');
  }

  async saveAppState(state) {
    await this.writeFile('app-state/ui-state.json', state);
    return true;
  }

  getWindowState() {
    try {
      const fullPath = path.join(this.dataDir, 'app-state/window-state.json');
      const data = require('fs').readFileSync(fullPath, 'utf8');
      return JSON.parse(data);
    } catch {
      return { width: 1400, height: 900, isMaximized: false };
    }
  }

  async saveWindowState(state) {
    await this.writeFile('app-state/window-state.json', state);
  }

  async getLastOpenedModule() {
    const data = await this.readFile('app-state/last-opened-module.json');
    return data.module || 'dashboard';
  }

  async setLastOpenedModule(module) {
    await this.writeFile('app-state/last-opened-module.json', { module });
    return true;
  }

  // Settings
  async getSettings() {
    return await this.readFile('settings.json');
  }

  async saveSettings(settings) {
    await this.writeFile('settings.json', settings);
    return true;
  }

  async saveAllPendingChanges() {
    this.log('Saving all pending changes...');
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    const logPath = path.join(this.dataDir, 'logs', 'app.log');
    fs.appendFile(logPath, logMessage).catch(() => {});
  }

  logError(message, error) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message} - ${error.message}\n${error.stack}\n`;
    const logPath = path.join(this.dataDir, 'logs', 'errors.log');
    fs.appendFile(logPath, logMessage).catch(() => {});
  }
}

module.exports = DataManager;
