import { NextResponse } from 'next/server';
import { createBackup, listBackups, restoreFromBackup, deleteBackup, getBackupStats, createDownloadableBackup } from '../../../lib/backup-system';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// GET - List all backups or download backup
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const download = searchParams.get('download');
    
    if (action === 'stats') {
      const stats = getBackupStats();
      return NextResponse.json(stats);
    }
    
    if (download) {
      // Download backup as JSON file with all data
      const backupPath = path.join(process.cwd(), 'backups', download);
      const metadataPath = path.join(backupPath, 'backup.json');
      
      if (!fs.existsSync(metadataPath)) {
        return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
      }
      
      const backup = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      
      // Collect all backup data into a single JSON object
      const downloadData = {
        metadata: backup,
        data: {},
        content: {}
      };
      
      // Read data files
      const dataBackupPath = path.join(backupPath, 'data');
      if (fs.existsSync(dataBackupPath)) {
        const dataFiles = fs.readdirSync(dataBackupPath);
        dataFiles.forEach(file => {
          const filePath = path.join(dataBackupPath, file);
          if (fs.statSync(filePath).isFile()) {
            try {
              downloadData.data[file] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            } catch (e) {
              downloadData.data[file] = fs.readFileSync(filePath, 'utf8');
            }
          }
        });
      }
      
      // Read content files
      const contentBackupPath = path.join(backupPath, 'content');
      if (fs.existsSync(contentBackupPath)) {
        const contentDirs = fs.readdirSync(contentBackupPath);
        contentDirs.forEach(dir => {
          const sourceDir = path.join(contentBackupPath, dir);
          if (fs.statSync(sourceDir).isDirectory()) {
            downloadData.content[dir] = {};
            const files = fs.readdirSync(sourceDir);
            files.forEach(file => {
              const filePath = path.join(sourceDir, file);
              if (fs.statSync(filePath).isFile()) {
                downloadData.content[dir][file] = fs.readFileSync(filePath, 'utf8');
              }
            });
          }
        });
      }
      
      // Return as downloadable JSON
      const response = new NextResponse(JSON.stringify(downloadData, null, 2));
      response.headers.set('Content-Type', 'application/json');
      response.headers.set('Content-Disposition', `attachment; filename="backup-${download}.json"`);
      
      return response;
    }
    
    const backups = listBackups();
    return NextResponse.json(backups);
  } catch (error) {
    console.error('Backup GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch backups' }, { status: 500 });
  }
}

// POST - Create backup
export async function POST(request) {
  try {
    const body = await request.json();
    const { description, action } = body;
    
    let backupDescription = description || 'Manual backup';
    if (action) {
      backupDescription = `Auto backup before ${action}`;
    }
    
    const backup = createBackup(backupDescription);
    
    return NextResponse.json({
      success: true,
      backup,
      message: 'Backup created successfully'
    });
  } catch (error) {
    console.error('Backup POST error:', error);
    return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
  }
}

// PUT - Restore from backup
export async function PUT(request) {
  try {
    const body = await request.json();
    const { backupId } = body;
    
    if (!backupId) {
      return NextResponse.json({ error: 'Backup ID required' }, { status: 400 });
    }
    
    const backup = restoreFromBackup(backupId);
    
    return NextResponse.json({
      success: true,
      backup,
      message: 'Backup restored successfully'
    });
  } catch (error) {
    console.error('Backup PUT error:', error);
    return NextResponse.json({ error: 'Failed to restore backup' }, { status: 500 });
  }
}

// DELETE - Delete backup
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const backupId = searchParams.get('id');
    
    if (!backupId) {
      return NextResponse.json({ error: 'Backup ID required' }, { status: 400 });
    }
    
    const success = deleteBackup(backupId);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Backup deleted successfully'
      });
    } else {
      return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Backup DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete backup' }, { status: 500 });
  }
}
