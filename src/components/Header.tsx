import { useState } from 'react';
import { useWebAssistant } from '../hooks/useWebAssistant';
import { Settings } from './Settings';

interface HeaderProps {
  pageTitle: string;
  onSettingsClick: () => void;
}

export function Header({ pageTitle, onSettingsClick }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate transition-colors duration-200">
            {pageTitle || 'Web Assistant'}
          </h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-all duration-200"
              title="Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </>
  );
}