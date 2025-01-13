import React, { useEffect, useState } from 'react';
import { getApiSettings, setApiSettings, ApiSettings } from '../utils/storage';
import { useApp } from '../store/AppContext';
import { ApiProvider } from '@src/types';
import { Selector, Option } from './common/Selector';

interface SettingsProps {
  onSaved?: () => void;
  onClose: () => void;
}

const API_PROVIDERS: Option<ApiProvider>[] = [
  { label: 'Deepseek', value: 'deepseek' },
  { label: 'ChatGPT', value: 'openai' },
  { label: 'Claude', value: 'anthropic' },
];

export function Settings({ onSaved, onClose }: SettingsProps) {
  const [settings, setSettings] = useState<ApiSettings[]>([]);
  const [editingKey, setEditingKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { setError, setSuccess } = useApp();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const savedSettings = await getApiSettings();
      
      if (savedSettings.length === 0) {
        setSettings([{ name: 'Deepseek', provider: 'deepseek', apiKey: '' }]);
      } else {
        setSettings(savedSettings);
      }
    } catch (error) {
      setError('Failed to load API settings');
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddApi = () => {
    setSettings([
      ...settings,
      { name: '', provider: 'deepseek', apiKey: '' },
    ]);
  };

  const handleRemoveApi = (index: number) => {
    const newSettings = [...settings];
    newSettings.splice(index, 1);
    setSettings(newSettings);
  };

  const handleUpdateSetting = (index: number, field: keyof ApiSettings, value: string) => {
    const newSettings = [...settings];
    newSettings[index] = { ...newSettings[index], [field]: value };
    setSettings(newSettings);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const invalidSetting = settings.find(
      setting => !setting.name.trim() || !setting.apiKey.trim()
    );
    
    if (invalidSetting) {
      setError('Please fill in all required fields (Name and API Key)');
      return;
    }

    try {
      await setApiSettings(settings);
      setSuccess('API settings saved successfully!');
      onSaved?.();
      onClose();
    } catch (error) {
      setError('Failed to save API settings');
      console.error('Failed to save settings:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[400px] max-h-[600px] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(600px-8rem)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {settings.map((setting, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={setting.name}
                    onChange={(e) => handleUpdateSetting(index, 'name', e.target.value)}
                    placeholder="API Name"
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveApi(index)}
                    disabled={settings.length === 1}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <Selector
                  options={API_PROVIDERS}
                  value={setting.provider}
                  onChange={(value) => handleUpdateSetting(index, 'provider', value)}
                  label="Provider:"
                  className="w-full"
                />

                <div className="relative">
                  <input
                    type={editingKey === `${index}` ? 'text' : 'password'}
                    value={setting.apiKey}
                    onChange={(e) => handleUpdateSetting(index, 'apiKey', e.target.value)}
                    placeholder="API Key"
                    className="w-full px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-primary-light focus:border-transparent pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setEditingKey(editingKey === `${index}` ? '' : `${index}`)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                  >
                    {editingKey === `${index}` ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            ))}
          </form>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <button
            type="button"
            onClick={handleAddApi}
            className="w-full py-2 px-4 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            Add New API
          </button>
          <button
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-primary hover:bg-primary-hover text-white rounded-md transition-colors text-sm font-medium focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
