import { NextResponse } from 'next/server';
import { createBackup, restoreBackup, listBackups, deleteBackup, getBackupStats } from '../../../lib/simple-backup';
import fs from 'fs';
import path from 'path';

// GET - List backups or download backup
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
      // Download backup file
      const backupPath = path.join(process.cwd(), 'backups', download);
      
      if (!fs.existsSync(backupPath)) {
        return NextResponse.json({ error: 'Backup not found' }, { status: 404 });
      }
      
      const fileBuffer = fs.readFileSync(backupPath);
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${download}"`,
          'Content-Length': fileBuffer.length.toString()
        }
      });
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
    const result = createBackup();
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
    
  } catch (error) {
    console.error('Backup POST error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message,
      message: 'Failed to create backup' 
    }, { status: 500 });
  }
}

// PUT - Restore backup
export async function PUT(request) {
  try {
    const body = await request.json();
    const { filename } = body;
    
    if (!filename) {
      return NextResponse.json({ 
        success: false,
        message: 'Backup filename required' 
      }, { status: 400 });
    }
    
    const backupPath = path.join(process.cwd(), 'backups', filename);
    const result = restoreBackup(backupPath);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 500 });
    }
    
  } catch (error) {
    console.error('Backup PUT error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message,
      message: 'Failed to restore backup' 
    }, { status: 500 });
  }
}

// DELETE - Delete backup
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json({ 
        success: false,
        message: 'Backup filename required' 
      }, { status: 400 });
    }
    
    const result = deleteBackup(filename);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 404 });
    }
    
  } catch (error) {
    console.error('Backup DELETE error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message,
      message: 'Failed to delete backup' 
    }, { status: 500 });
  }
}
