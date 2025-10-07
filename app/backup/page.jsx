import SimpleBackup from '../../components/SimpleBackup';

export const metadata = {
  title: 'Backup System - Tech & The City',
  description: 'Simple backup and restore system for all website data.',
};

export default function BackupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600">
      <div className="container max-w-6xl mx-auto px-4 pt-8 pb-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Backup System</h1>
          <p className="text-gray-400">Simple backup and restore for all your website data</p>
        </div>
        
        <SimpleBackup />
        
        <div className="mt-8 text-center">
          <a 
            href="/admin-TC25" 
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Admin Panel
          </a>
        </div>
      </div>
    </div>
  );
}
