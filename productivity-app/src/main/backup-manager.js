const fs = require('fs').promises;
const path = require('path');

class BackupManager {
  constructor(dataManager) {
    this.dataManager = dataManager;
    this.dataDir = dataManager.dataDir;
    this.backupInterval = null;
    this.maxBackups = 10;
  }

  startAutoBackup(intervalMinutes = 5) {
    this.backupInterval = setInterval(() => {
      this.createAutoBackup();
    }, intervalMinutes * 60 * 1000);
    
    this.dataManager.log('Auto-backup started');
  }

  stopAutoBackup() {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
      this.backupInterval = null;
    }
  }

  async createAutoBackup() {
    const timestamp = this.getTimestamp();
    await this.backupModule('job-applications', 'applications.json', timestamp);
    await this.backupModule('calendar', 'calendar-2026.json', timestamp);
    await this.backupModule('resumes', 'resumes.json', timestamp);
    await this.cleanOldBackups();
    this.dataManager.log(`Auto-backup created: ${timestamp}`);
  }

  async createManualBackup() {
    const timestamp = this.getTimestamp();
    await this.backupModule('job-applications', 'applications.json', timestamp);
    await this.backupModule('calendar', 'calendar-2026.json', timestamp);
    await this.backupModule('resumes', 'resumes.json', timestamp);
    this.dataManager.log(`Manual backup created: ${timestamp}`);
    return timestamp;
  }

  async createFinalBackup() {
    const timestamp = this.getTimestamp() + '-final';
    await this.backupModule('job-applications', 'applications.json', timestamp);
    await this.backupModule('calendar', 'calendar-2026.json', timestamp);
    await this.backupModule('resumes', 'resumes.json', timestamp);
    this.dataManager.log(`Final backup created: ${timestamp}`);
  }

  async backupModule(moduleName, fileName, timestamp) {
    const sourcePath = path.join(this.dataDir, moduleName, fileName);
    const backupDir = path.join(this.dataDir, moduleName, 'backups');
    const backupName = fileName.replace('.json', `-${timestamp}.json`);
    const backupPath = path.join(backupDir, backupName);

    try {
      await fs.copyFile(sourcePath, backupPath);
    } catch (error) {
      this.dataManager.logError(`Backup failed: ${moduleName}/${fileName}`, error);
    }
  }

  async cleanOldBackups() {
    const modules = ['job-applications', 'calendar', 'resumes'];
    
    for (const moduleName of modules) {
      const backupDir = path.join(this.dataDir, moduleName, 'backups');
      
      try {
        const files = await fs.readdir(backupDir);
        const backupFiles = files
          .filter(f => f.endsWith('.json'))
          .sort()
          .reverse();

        if (backupFiles.length > this.maxBackups) {
          const toDelete = backupFiles.slice(this.maxBackups);
          for (const file of toDelete) {
            await fs.unlink(path.join(backupDir, file));
          }
        }
      } catch (error) {
        // Backup dir might not exist yet
      }
    }
  }

  async listBackups() {
    const modules = ['job-applications', 'calendar', 'resumes'];
    const backups = {};

    for (const moduleName of modules) {
      const backupDir = path.join(this.dataDir, moduleName, 'backups');
      
      try {
        const files = await fs.readdir(backupDir);
        backups[moduleName] = files
          .filter(f => f.endsWith('.json'))
          .sort()
          .reverse();
      } catch {
        backups[moduleName] = [];
      }
    }

    return backups;
  }

  async restoreFromBackup(backupInfo) {
    const { module: moduleName, fileName, backupFile } = backupInfo;
    const backupPath = path.join(this.dataDir, moduleName, 'backups', backupFile);
    const targetPath = path.join(this.dataDir, moduleName, fileName);

    try {
      // Create backup of current file before restoring
      const preRestoreBackup = `${fileName.replace('.json', '')}-pre-restore-${this.getTimestamp()}.json`;
      await fs.copyFile(targetPath, path.join(this.dataDir, moduleName, 'backups', preRestoreBackup));
      
      // Restore from backup
      await fs.copyFile(backupPath, targetPath);
      
      this.dataManager.log(`Restored ${moduleName} from backup: ${backupFile}`);
      return true;
    } catch (error) {
      this.dataManager.logError(`Restore failed: ${moduleName}`, error);
      throw error;
    }
  }

  getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  }
}

module.exports = BackupManager;
