'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export default function ProductionWarning() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 mb-6 relative">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-orange-400 hover:text-orange-300 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-orange-400 font-semibold mb-2">Production Environment Notice</h3>
          <div className="text-orange-300 text-sm space-y-2">
            <p>
              <strong>Articles:</strong> Can be edited and published/unpublished via GitHub integration.
              {!process.env.NEXT_PUBLIC_GITHUB_TOKEN && (
                <span className="text-orange-400 font-medium"> GitHub token not configured - limited functionality.</span>
              )}
            </p>
            <p>
              <strong>Events:</strong> Cannot be modified in production environment. 
              Use development environment for event management.
            </p>
            <p className="text-xs text-orange-400">
              💡 For full functionality, set up GitHub token or use development environment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
