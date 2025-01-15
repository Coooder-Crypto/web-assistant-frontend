import { ApiProvider } from '@src/types';

const API_KEY_PREFIX = 'api_key';
const SETTINGS_KEY = 'api_settings';
const SELECTED_PROVIDER_KEY = 'selected_provider';
const LEGACY_API_KEY = 'deepseek_api_key';  

const getApiKeyStorageKey = (provider: ApiProvider) => `${API_KEY_PREFIX}_${provider}`;

// 检查是否在扩展环境中
const isExtensionEnvironment = typeof chrome !== 'undefined' && chrome.storage;

// 用于非扩展环境的本地存储
const localStorageAPI = {
  get: async (key: string) => {
    const value = localStorage.getItem(key);
    return { [key]: value };
  },
  set: async (data: Record<string, any>) => {
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  },
  remove: async (keys: string[]) => {
    keys.forEach(key => localStorage.removeItem(key));
  }
};

// 获取合适的存储API
const storage = isExtensionEnvironment ? chrome.storage.local : localStorageAPI;

export interface ApiSettings {
  name: string;
  provider: ApiProvider;
  apiKey: string;
  model?: string;
}

// 迁移旧的 API key
async function migrateLegacyApiKey(): Promise<void> {
  try {
    const result = await storage.get(LEGACY_API_KEY);
    const legacyKey = result[LEGACY_API_KEY];
    
    if (legacyKey) {
      // 获取现有设置
      const settings = await getApiSettings();
      
      // 检查是否已经有 deepseek 设置
      const hasDeepseek = settings.some(s => s.provider === 'deepseek');
      
      if (!hasDeepseek) {
        // 添加 deepseek 设置
        settings.push({
          name: 'Deepseek',
          provider: 'deepseek',
          apiKey: legacyKey
        });
        
        // 保存新设置
        await setApiSettings(settings);
        
        // 设置 deepseek 为默认提供者
        await setSelectedProvider('deepseek');
        
        // 删除旧的 key
        await storage.remove([LEGACY_API_KEY]);
      }
    }
  } catch (error) {
    console.error('Failed to migrate legacy API key:', error);
  }
}

// API Key 管理
export async function getStoredApiKey(provider: ApiProvider): Promise<string | null> {
  const settings = await getApiSettings();
  const providerSetting = settings.find(s => s.provider === provider);
  return providerSetting?.apiKey || null;
}

export async function setStoredApiKey(provider: ApiProvider, apiKey: string): Promise<void> {
  const settings = await getApiSettings();
  const existingIndex = settings.findIndex(s => s.provider === provider);
  
  if (existingIndex >= 0) {
    settings[existingIndex].apiKey = apiKey;
  } else {
    settings.push({
      name: provider.charAt(0).toUpperCase() + provider.slice(1),
      provider,
      apiKey
    });
  }
  
  await setApiSettings(settings);
}

export async function removeStoredApiKey(provider: ApiProvider): Promise<void> {
  const settings = await getApiSettings();
  const newSettings = settings.filter(s => s.provider !== provider);
  await setApiSettings(newSettings);
}

// API Settings 管理
export async function getApiSettings(): Promise<ApiSettings[]> {
  await migrateLegacyApiKey();  
  const result = await storage.get(SETTINGS_KEY);
  return JSON.parse(result[SETTINGS_KEY] || '[]');
}

export async function setApiSettings(settings: ApiSettings[]): Promise<void> {
  await storage.set({ [SETTINGS_KEY]: JSON.stringify(settings) });
}

// 选中的 Provider 管理
export async function getSelectedProvider(): Promise<ApiProvider | null> {
  const result = await storage.get(SELECTED_PROVIDER_KEY);
  return (result[SELECTED_PROVIDER_KEY] as ApiProvider) || 'deepseek';  
}

export async function setSelectedProvider(provider: ApiProvider): Promise<void> {
  await storage.set({ [SELECTED_PROVIDER_KEY]: provider });
}
