import fs from 'fs';
import path from 'path';

const BACKUP_DIR = path.join(process.cwd(), 'backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Generate backup filename with timestamp
function generateBackupFilename() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').split('T')[0];
  const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  return `backup-${timestamp}-${time}.json`;
}

// Create backup of all important data
export function createBackup() {
  try {
    const backup = {
      timestamp: new Date().toISOString(),
      data: {},
      content: {},
      contactSubmissions: []
    };

    // Backup data directory (analytics, events, etc.)
    const dataDir = path.join(process.cwd(), 'data');
    if (fs.existsSync(dataDir)) {
      const dataFiles = fs.readdirSync(dataDir);
      dataFiles.forEach(file => {
        if (file.endsWith('.json')) {
          try {
            const filePath = path.join(dataDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            backup.data[file] = JSON.parse(content);
          } catch (error) {
            console.error(`Error reading ${file}:`, error);
          }
        }
      });
    }

    // Backup content directory (articles)
    const contentDir = path.join(process.cwd(), 'content');
    if (fs.existsSync(contentDir)) {
      const contentFiles = fs.readdirSync(contentDir);
      contentFiles.forEach(file => {
        if (file.endsWith('.md')) {
          try {
            const filePath = path.join(contentDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            backup.content[file] = content;
          } catch (error) {
            console.error(`Error reading ${file}:`, error);
          }
        } else if (fs.statSync(path.join(contentDir, file)).isDirectory()) {
          // Handle subdirectories like posts/
          const subDir = path.join(contentDir, file);
          const subFiles = fs.readdirSync(subDir);
          subFiles.forEach(subFile => {
            if (subFile.endsWith('.md')) {
              try {
                const filePath = path.join(subDir, subFile);
                const content = fs.readFileSync(filePath, 'utf8');
                if (!backup.content[file]) {
                  backup.content[file] = {};
                }
                backup.content[file][subFile] = content;
              } catch (error) {
                console.error(`Error reading ${file}/${subFile}:`, error);
              }
            }
          });
        }
      });
    }

    // Backup contact submissions
    const contactFile = path.join(process.cwd(), 'contact-submissions.json');
    if (fs.existsSync(contactFile)) {
      try {
        const content = fs.readFileSync(contactFile, 'utf8');
        backup.contactSubmissions = JSON.parse(content);
      } catch (error) {
        console.error('Error reading contact submissions:', error);
      }
    }

    // Save backup file
    const filename = generateBackupFilename();
    const backupPath = path.join(BACKUP_DIR, filename);
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

    return {
      success: true,
      filename,
      path: backupPath,
      timestamp: backup.timestamp,
      message: 'Backup created successfully'
    };

  } catch (error) {
    console.error('Backup creation error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to create backup'
    };
  }
}

// Restore from backup
export function restoreBackup(backupPath) {
  try {
    if (!fs.existsSync(backupPath)) {
      throw new Error('Backup file not found');
    }

    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    // Restore data files
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    Object.entries(backup.data).forEach(([filename, content]) => {
      const filePath = path.join(dataDir, filename);
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    });

    // Restore content files
    Object.entries(backup.content).forEach(([filename, content]) => {
      if (typeof content === 'string') {
        // Direct file
        const filePath = path.join(process.cwd(), 'content', filename);
        fs.writeFileSync(filePath, content);
      } else {
        // Directory with multiple files
        const dirPath = path.join(process.cwd(), 'content', filename);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        
        Object.entries(content).forEach(([subFilename, subContent]) => {
          const filePath = path.join(dirPath, subFilename);
          fs.writeFileSync(filePath, subContent);
        });
      }
    });

    // Restore contact submissions
    if (backup.contactSubmissions && backup.contactSubmissions.length > 0) {
      const contactFile = path.join(process.cwd(), 'contact-submissions.json');
      fs.writeFileSync(contactFile, JSON.stringify(backup.contactSubmissions, null, 2));
    }

    return {
      success: true,
      message: 'Backup restored successfully',
      restoredAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Restore error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to restore backup'
    };
  }
}

// List all backup files
export function listBackups() {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      return [];
    }

    const files = fs.readdirSync(BACKUP_DIR);
    const backups = files
      .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        let timestamp = null;
        
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const backup = JSON.parse(content);
          timestamp = backup.timestamp;
        } catch (error) {
          console.error(`Error reading backup ${file}:`, error);
        }

        return {
          filename: file,
          path: filePath,
          size: stats.size,
          created: stats.birthtime,
          timestamp: timestamp,
          sizeFormatted: formatBytes(stats.size)
        };
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created));

    return backups;

  } catch (error) {
    console.error('List backups error:', error);
    return [];
  }
}

// Delete backup file
export function deleteBackup(filename) {
  try {
    const backupPath = path.join(BACKUP_DIR, filename);
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
      return {
        success: true,
        message: 'Backup deleted successfully'
      };
    } else {
      return {
        success: false,
        message: 'Backup file not found'
      };
    }
  } catch (error) {
    console.error('Delete backup error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to delete backup'
    };
  }
}

// Format bytes to human readable
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get backup statistics
export function getBackupStats() {
  const backups = listBackups();
  const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);
  
  return {
    totalBackups: backups.length,
    totalSize,
    totalSizeFormatted: formatBytes(totalSize),
    latestBackup: backups.length > 0 ? backups[0].created : null
  };
}
