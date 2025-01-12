import React, { useEffect, useState } from 'react';
import { getApiSettings, setApiSettings, ApiSettings } from '../utils/storage';
import { useApp } from '../store/AppContext';
import { ApiProvider } from '@src/types';

interface SettingsProps {
  onSaved?: () => void;
  onClose: () => void;
}

const API_PROVIDERS: { label: string; value: ApiProvider }[] = [
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
      
      // 如果没有设置，添加一个默认的 Deepseek 设置
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
    
    // 验证所有必填字段
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
    } catch (error) {
      setError('Failed to save API settings');
      console.error('Failed to save settings:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-screen-sm bg-background dark:bg-background-dark">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-screen-sm bg-background dark:bg-background-dark">
      <div className="w-full max-w-popup px-popup-padding">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-2">
              API Settings
            </h2>
            <p className="text-text-secondary dark:text-text-dark-secondary">
              Configure your API providers
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {settings.map((setting, index) => (
            <div key={index} className="bg-white dark:bg-background-dark rounded-lg shadow-md p-4 space-y-4">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={setting.name}
                  onChange={(e) => handleUpdateSetting(index, 'name', e.target.value)}
                  placeholder="API Name *"
                  className="flex-1 p-2 text-text dark:text-text-dark bg-transparent border-2 border-border dark:border-border-dark rounded-lg focus:outline-none focus:border-primary dark:focus:border-primary-light"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveApi(index)}
                  className="ml-2 p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  disabled={settings.length === 1}
                  title={settings.length === 1 ? "Can't remove the last API provider" : "Remove this API provider"}
                >
                  Remove
                </button>
              </div>

              <select
                value={setting.provider}
                onChange={(e) => handleUpdateSetting(index, 'provider', e.target.value as ApiProvider)}
                className="w-full p-2 text-text dark:text-text-dark bg-transparent border-2 border-border dark:border-border-dark rounded-lg focus:outline-none focus:border-primary dark:focus:border-primary-light"
              >
                {API_PROVIDERS.map((provider) => (
                  <option key={provider.value} value={provider.value}>
                    {provider.label}
                  </option>
                ))}
              </select>

              <div className="relative">
                <input
                  type={editingKey === `${index}` ? 'text' : 'password'}
                  value={setting.apiKey}
                  onChange={(e) => handleUpdateSetting(index, 'apiKey', e.target.value)}
                  placeholder="API Key *"
                  className="w-full p-2 text-text dark:text-text-dark bg-transparent border-2 border-border dark:border-border-dark rounded-lg focus:outline-none focus:border-primary dark:focus:border-primary-light font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setEditingKey(editingKey === `${index}` ? '' : `${index}`)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary dark:text-text-dark-secondary hover:text-text dark:hover:text-text-dark"
                >
                  {editingKey === `${index}` ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddApi}
            className="w-full py-3 px-4 border-2 border-dashed border-border dark:border-border-dark hover:border-primary dark:hover:border-primary-light text-text-secondary dark:text-text-dark-secondary rounded-lg transition-colors focus:outline-none"
          >
            + Add API Provider
          </button>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-primary hover:bg-primary-hover dark:bg-primary-light dark:hover:bg-primary text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-primary-light"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
