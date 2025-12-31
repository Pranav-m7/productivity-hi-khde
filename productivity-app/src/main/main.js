const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const DataManager = require('./data-manager');
const BackupManager = require('./backup-manager');

let mainWindow;
let dataManager;
let backupManager;

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const windowState = dataManager.getWindowState();
  
  mainWindow = new BrowserWindow({
    width: windowState.width || 1400,
    height: windowState.height || 900,
    x: windowState.x,
    y: windowState.y,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#0a0a0a',
    frame: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (windowState.isMaximized) {
    mainWindow.maximize();
  }

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist-renderer/index.html'));
  }

  mainWindow.on('close', () => {
    const bounds = mainWindow.getBounds();
    dataManager.saveWindowState({
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      isMaximized: mainWindow.isMaximized(),
    });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  dataManager = new DataManager();
  backupManager = new BackupManager(dataManager);
  
  await dataManager.initialize();
  backupManager.startAutoBackup();
  
  setupIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', async () => {
  await dataManager.saveAllPendingChanges();
  backupManager.createFinalBackup();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async () => {
  await dataManager.saveAllPendingChanges();
});

function setupIpcHandlers() {
  // Job Applications
  ipcMain.handle('jobs:getAll', () => dataManager.getJobApplications());
  ipcMain.handle('jobs:save', (_, data) => dataManager.saveJobApplication(data));
  ipcMain.handle('jobs:delete', (_, id) => dataManager.deleteJobApplication(id));
  ipcMain.handle('jobs:bulkDelete', (_, ids) => dataManager.bulkDeleteJobApplications(ids));
  ipcMain.handle('jobs:bulkUpdate', (_, ids, updates) => dataManager.bulkUpdateJobApplications(ids, updates));

  // Calendar
  ipcMain.handle('calendar:getAll', () => dataManager.getCalendarEntries());
  ipcMain.handle('calendar:save', (_, data) => dataManager.saveCalendarEntry(data));
  ipcMain.handle('calendar:delete', (_, id) => dataManager.deleteCalendarEntry(id));
  ipcMain.handle('calendar:getTemplates', () => dataManager.getCalendarTemplates());
  ipcMain.handle('calendar:saveTemplate', (_, data) => dataManager.saveCalendarTemplate(data));

  // Resumes
  ipcMain.handle('resumes:getAll', () => dataManager.getResumes());
  ipcMain.handle('resumes:save', (_, data) => dataManager.saveResume(data));
  ipcMain.handle('resumes:delete', (_, id) => dataManager.deleteResume(id));
  ipcMain.handle('resumes:getActive', () => dataManager.getActiveResumeId());
  ipcMain.handle('resumes:setActive', (_, id) => dataManager.setActiveResumeId(id));

  // App State
  ipcMain.handle('state:get', () => dataManager.getAppState());
  ipcMain.handle('state:save', (_, state) => dataManager.saveAppState(state));
  ipcMain.handle('state:getLastModule', () => dataManager.getLastOpenedModule());
  ipcMain.handle('state:setLastModule', (_, module) => dataManager.setLastOpenedModule(module));

  // Settings
  ipcMain.handle('settings:get', () => dataManager.getSettings());
  ipcMain.handle('settings:save', (_, settings) => dataManager.saveSettings(settings));

  // Backup & Recovery
  ipcMain.handle('backup:create', () => backupManager.createManualBackup());
  ipcMain.handle('backup:list', () => backupManager.listBackups());
  ipcMain.handle('backup:restore', (_, backupPath) => backupManager.restoreFromBackup(backupPath));
}
