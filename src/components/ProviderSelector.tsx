import React, { useEffect, useState } from 'react';
import { ApiProvider } from '@src/types';
import { ApiSettings, getApiSettings, getSelectedProvider, setSelectedProvider } from '../utils/storage';

interface ProviderSelectorProps {
  onProviderChange?: (provider: ApiProvider) => void;
}

export function ProviderSelector({ onProviderChange }: ProviderSelectorProps) {
  const [settings, setSettings] = useState<ApiSettings[]>([]);
  const [selectedProvider, setSelected] = useState<ApiProvider | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedSettings, savedProvider] = await Promise.all([
        getApiSettings(),
        getSelectedProvider(),
      ]);
      
      setSettings(savedSettings);
      
      if (savedProvider && savedSettings.some((s: ApiSettings) => s.provider === savedProvider)) {
        setSelected(savedProvider);
      } else if (savedSettings.length > 0) {
        // Default to first available provider
        setSelected(savedSettings[0].provider);
        await setSelectedProvider(savedSettings[0].provider);
      }
    } catch (error) {
      console.error('Failed to load provider settings:', error);
    }
  };

  const handleProviderChange = async (provider: ApiProvider) => {
    setSelected(provider);
    await setSelectedProvider(provider);
    onProviderChange?.(provider);
  };

  if (settings.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-sm text-text-secondary dark:text-text-dark-secondary">
        Using:
      </span>
      <select
        value={selectedProvider || ''}
        onChange={(e) => handleProviderChange(e.target.value as ApiProvider)}
        className="px-3 py-1 text-sm bg-transparent border border-border dark:border-border-dark rounded-md focus:outline-none focus:border-primary dark:focus:border-primary-light"
      >
        {settings.map((setting) => (
          <option key={setting.provider} value={setting.provider}>
            {setting.name || setting.provider}
          </option>
        ))}
      </select>
    </div>
  );
}
