import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';

const BACKUP_DIR = path.join(process.cwd(), 'backups');
const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_DIR = path.join(process.cwd(), 'content');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Generate unique backup ID
function generateBackupId() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}_${random}`;
}

// Get file hash for integrity checking
function getFileHash(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath);
  return createHash('md5').update(content).digest('hex');
}

// Create backup of all content
export function createBackup(description = 'Manual backup') {
  const backupId = generateBackupId();
  const backupPath = path.join(BACKUP_DIR, backupId);
  
  fs.mkdirSync(backupPath, { recursive: true });
  
  const backup = {
    id: backupId,
    timestamp: new Date().toISOString(),
    description,
    files: []
  };

  // Backup data directory
  if (fs.existsSync(DATA_DIR)) {
    const dataBackupPath = path.join(backupPath, 'data');
    fs.mkdirSync(dataBackupPath, { recursive: true });
    
    const dataFiles = fs.readdirSync(DATA_DIR);
    dataFiles.forEach(file => {
      const sourcePath = path.join(DATA_DIR, file);
      const destPath = path.join(dataBackupPath, file);
      
      if (fs.statSync(sourcePath).isFile()) {
        fs.copyFileSync(sourcePath, destPath);
        backup.files.push({
          path: `data/${file}`,
          hash: getFileHash(sourcePath),
          size: fs.statSync(sourcePath).size
        });
      }
    });
  }

  // Backup content directory
  if (fs.existsSync(CONTENT_DIR)) {
    const contentBackupPath = path.join(backupPath, 'content');
    fs.mkdirSync(contentBackupPath, { recursive: true });
    
    const contentFiles = fs.readdirSync(CONTENT_DIR);
    contentFiles.forEach(file => {
      if (fs.statSync(path.join(CONTENT_DIR, file)).isDirectory()) {
        // Handle subdirectories like posts/
        const subDirPath = path.join(CONTENT_DIR, file);
        const subBackupPath = path.join(contentBackupPath, file);
        fs.mkdirSync(subBackupPath, { recursive: true });
        
        const subFiles = fs.readdirSync(subDirPath);
        subFiles.forEach(subFile => {
          const sourcePath = path.join(subDirPath, subFile);
          const destPath = path.join(subBackupPath, subFile);
          
          if (fs.statSync(sourcePath).isFile()) {
            fs.copyFileSync(sourcePath, destPath);
            backup.files.push({
              path: `content/${file}/${subFile}`,
              hash: getFileHash(sourcePath),
              size: fs.statSync(sourcePath).size
            });
          }
        });
      }
    });
  }

  // Save backup metadata
  const metadataPath = path.join(backupPath, 'backup.json');
  fs.writeFileSync(metadataPath, JSON.stringify(backup, null, 2));

  // Update backup index
  updateBackupIndex(backup);

  return backup;
}

// Update backup index
function updateBackupIndex(newBackup) {
  const indexPath = path.join(BACKUP_DIR, 'index.json');
  let index = [];
  
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    index = JSON.parse(content);
  }
  
  index.unshift({
    id: newBackup.id,
    timestamp: newBackup.timestamp,
    description: newBackup.description,
    fileCount: newBackup.files.length,
    totalSize: newBackup.files.reduce((sum, file) => sum + file.size, 0)
  });
  
  // Keep all backups - no limit
  // if (index.length > 50) {
  //   index = index.slice(0, 50);
  // }
  
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
}

// List all backups
export function listBackups() {
  const indexPath = path.join(BACKUP_DIR, 'index.json');
  
  if (!fs.existsSync(indexPath)) {
    return [];
  }
  
  const content = fs.readFileSync(indexPath, 'utf8');
  return JSON.parse(content);
}

// Restore from backup
export function restoreFromBackup(backupId) {
  const backupPath = path.join(BACKUP_DIR, backupId);
  const metadataPath = path.join(backupPath, 'backup.json');
  
  if (!fs.existsSync(metadataPath)) {
    throw new Error('Backup not found');
  }
  
  const backup = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  
  // Restore data files
  const dataBackupPath = path.join(backupPath, 'data');
  if (fs.existsSync(dataBackupPath)) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    const dataFiles = fs.readdirSync(dataBackupPath);
    dataFiles.forEach(file => {
      const sourcePath = path.join(dataBackupPath, file);
      const destPath = path.join(DATA_DIR, file);
      fs.copyFileSync(sourcePath, destPath);
    });
  }
  
  // Restore content files
  const contentBackupPath = path.join(backupPath, 'content');
  if (fs.existsSync(contentBackupPath)) {
    if (!fs.existsSync(CONTENT_DIR)) {
      fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }
    
    const contentDirs = fs.readdirSync(contentBackupPath);
    contentDirs.forEach(dir => {
      const sourceDir = path.join(contentBackupPath, dir);
      const destDir = path.join(CONTENT_DIR, dir);
      
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      const files = fs.readdirSync(sourceDir);
      files.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const destPath = path.join(destDir, file);
        fs.copyFileSync(sourcePath, destPath);
      });
    });
  }
  
  return backup;
}

// Delete backup
export function deleteBackup(backupId) {
  const backupPath = path.join(BACKUP_DIR, backupId);
  
  if (fs.existsSync(backupPath)) {
    fs.rmSync(backupPath, { recursive: true, force: true });
    
    // Update index
    const indexPath = path.join(BACKUP_DIR, 'index.json');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      let index = JSON.parse(content);
      index = index.filter(backup => backup.id !== backupId);
      fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
    }
    
    return true;
  }
  
  return false;
}

// Auto backup before changes
export function autoBackup(action) {
  const description = `Auto backup before ${action}`;
  return createBackup(description);
}

// Get backup statistics
export function getBackupStats() {
  const backups = listBackups();
  const totalSize = backups.reduce((sum, backup) => sum + (backup.totalSize || 0), 0);
  
  return {
    totalBackups: backups.length,
    totalSize,
    totalSizeFormatted: formatBytes(totalSize),
    latestBackup: backups.length > 0 ? backups[0].timestamp : null
  };
}

// Create downloadable backup archive
export function createDownloadableBackup(backupId) {
  const backupPath = path.join(BACKUP_DIR, backupId);
  const metadataPath = path.join(backupPath, 'backup.json');
  
  if (!fs.existsSync(metadataPath)) {
    throw new Error('Backup not found');
  }
  
  const backup = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  
  // Create a downloadable folder structure
  const downloadPath = path.join(BACKUP_DIR, `${backupId}_download`);
  
  if (fs.existsSync(downloadPath)) {
    fs.rmSync(downloadPath, { recursive: true, force: true });
  }
  
  fs.mkdirSync(downloadPath, { recursive: true });
  
  // Copy backup contents
  const dataBackupPath = path.join(backupPath, 'data');
  const contentBackupPath = path.join(backupPath, 'content');
  
  if (fs.existsSync(dataBackupPath)) {
    const destDataPath = path.join(downloadPath, 'data');
    fs.mkdirSync(destDataPath, { recursive: true });
    
    const dataFiles = fs.readdirSync(dataBackupPath);
    dataFiles.forEach(file => {
      const sourcePath = path.join(dataBackupPath, file);
      const destPath = path.join(destDataPath, file);
      fs.copyFileSync(sourcePath, destPath);
    });
  }
  
  if (fs.existsSync(contentBackupPath)) {
    const destContentPath = path.join(downloadPath, 'content');
    fs.mkdirSync(destContentPath, { recursive: true });
    
    const contentDirs = fs.readdirSync(contentBackupPath);
    contentDirs.forEach(dir => {
      const sourceDir = path.join(contentBackupPath, dir);
      const destDir = path.join(destContentPath, dir);
      
      if (fs.statSync(sourceDir).isDirectory()) {
        fs.mkdirSync(destDir, { recursive: true });
        
        const files = fs.readdirSync(sourceDir);
        files.forEach(file => {
          const sourcePath = path.join(sourceDir, file);
          const destPath = path.join(destDir, file);
          fs.copyFileSync(sourcePath, destPath);
        });
      }
    });
  }
  
  // Copy metadata
  fs.copyFileSync(metadataPath, path.join(downloadPath, 'backup.json'));
  
  // Create README with restore instructions
  const readmeContent = `# Backup ${backupId}

Created: ${backup.timestamp}
Description: ${backup.description}
Files: ${backup.files.length}
Total Size: ${formatBytes(backup.files.reduce((sum, file) => sum + file.size, 0))}

## How to Restore:

1. Copy the 'data' folder to your project root
2. Copy the 'content' folder to your project root
3. Restart your application

## Manual Restore via Admin Panel:

1. Go to Admin Panel → Backup tab
2. Click "Restore" button for this backup
3. Or use the backup viewer at /backup-viewer

## File Structure:
- data/ - Contains events.json, analytics.json, etc.
- content/ - Contains all articles and posts
- backup.json - Backup metadata

For more help, visit /backup-info
`;
  
  fs.writeFileSync(path.join(downloadPath, 'README.md'), readmeContent);
  
  return {
    downloadPath,
    backup,
    instructions: 'Download complete. Extract the ZIP file and follow README.md instructions.'
  };
}

// Format bytes to human readable
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
