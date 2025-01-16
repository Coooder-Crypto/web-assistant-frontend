import type { ApiProvider, ApiSettings } from '@src/types'

const API_KEY_PREFIX = 'api_key'
const SETTINGS_KEY = 'api_settings'
const SELECTED_SETTING_KEY = 'selected_setting'

const isExtensionEnvironment = typeof chrome !== 'undefined' && chrome.storage

const localStorageAPI = {
  get: async (key: string) => {
    const value = localStorage.getItem(key)
    return { [key]: value }
  },
  set: async (items: { [key: string]: any }) => {
    Object.entries(items).forEach(([key, value]) => {
      localStorage.setItem(key, value)
    })
  },
  remove: async (key: string) => {
    localStorage.removeItem(key)
  },
}

const storage = isExtensionEnvironment ? chrome.storage.local : localStorageAPI

async function migrateLegacyApiKey(): Promise<void> {
  try {
    const result = await storage.get(API_KEY_PREFIX)
    if (result[API_KEY_PREFIX]) {
      const settings = await getApiSettings()
      if (!settings.some(s => s.provider === 'deepseek')) {
        settings.push({
          name: 'Deepseek',
          provider: 'deepseek',
          apiKey: result[API_KEY_PREFIX],
        })
        await setApiSettings(settings)
      }
      await storage.remove(API_KEY_PREFIX)
    }
  }
  catch (error) {
    console.error('Failed to migrate legacy API key:', error)
  }
}

export async function getStoredApiKey(provider: ApiProvider): Promise<string | null> {
  const settings = await getApiSettings()
  const providerSetting = settings.find(s => s.provider === provider)
  return providerSetting?.apiKey || null
}

export async function setStoredApiKey(provider: ApiProvider, apiKey: string, name?: string, model?: string): Promise<void> {
  const settings = await getApiSettings()
  const existingIndex = settings.findIndex(s => s.provider === provider)

  const newSetting: ApiSettings = {
    name: name || provider,
    provider,
    apiKey,
    model,
  }

  if (existingIndex >= 0) {
    settings[existingIndex] = newSetting
  }
  else {
    settings.push(newSetting)
  }

  await setApiSettings(settings)
}

export async function getApiSettings(): Promise<ApiSettings[]> {
  await migrateLegacyApiKey()
  const result = await storage.get(SETTINGS_KEY)
  return result[SETTINGS_KEY] ? JSON.parse(result[SETTINGS_KEY]) : []
}

export async function setApiSettings(settings: ApiSettings[]): Promise<void> {
  await storage.set({ [SETTINGS_KEY]: JSON.stringify(settings) })
}

export async function getSelectedSetting(): Promise<ApiSettings | null> {
  const result = await storage.get(SELECTED_SETTING_KEY)
  return result[SELECTED_SETTING_KEY] ? JSON.parse(result[SELECTED_SETTING_KEY]) : null
}

export async function setSelectedSetting(setting: ApiSettings): Promise<void> {
  await storage.set({ [SELECTED_SETTING_KEY]: JSON.stringify(setting) })
}

export async function clearAllStorage(): Promise<void> {
  if (isExtensionEnvironment) {
    await chrome.storage.local.clear()
  }
  else {
    localStorage.clear()
  }
}
