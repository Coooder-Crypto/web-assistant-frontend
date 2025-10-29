import type { ApiSettings } from '@src/types'
import { useApp } from '@src/hooks/useApp'
import { API_PROVIDERS } from '@src/types'
import { Button, Card, colors, spacing, typography } from '@src/ui'
import React, { useCallback, useEffect, useState } from 'react'
import {
  clearAllStorage,
  getApiSettings,
  setApiSettings,
} from '../utils/storage'
import SettingEditor from './SettingEditor'

interface SettingsProps {
  onClose: () => void
}

export default function Settings({ onClose }: SettingsProps) {
  const [settings, setSettings] = useState<ApiSettings[]>([])
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingSetting, setEditingSetting] = useState<
    ApiSettings | undefined
  >()
  const { setError, setSuccess } = useApp()

  const loadSettings = useCallback(async () => {
    try {
      const savedSettings = await getApiSettings()

      setSettings(savedSettings)
    }
    catch (error) {
      setError(error)
    }
  }, [setError])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const handleEdit = (setting: ApiSettings) => {
    setEditingSetting(setting)
    setEditDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingSetting(undefined)
    setEditDialogOpen(true)
  }

  const handleDelete = async (settingToDelete: ApiSettings) => {
    try {
      const newSettings = settings.filter(
        s =>
          s.name !== settingToDelete.name
          || s.provider !== settingToDelete.provider,
      )
      await setApiSettings(newSettings)
      setSettings(newSettings)
      setSuccess('Setting deleted successfully')
    }
    catch (error) {
      setError(error)
    }
  }

  const handleSaveSetting = async (newSetting: ApiSettings) => {
    try {
      let newSettings: ApiSettings[]
      if (editingSetting) {
        newSettings = settings.map(s =>
          s.name === editingSetting.name
          && s.provider === editingSetting.provider
            ? newSetting
            : s,
        )
      }
      else {
        if (settings.some(s => s.name === newSetting.name)) {
          setError('A setting with this name already exists')
          return
        }
        newSettings = [...settings, newSetting]
      }

      await setApiSettings(newSettings)
      setSettings(newSettings)
      setSuccess(
        editingSetting
          ? 'Setting updated successfully'
          : 'Setting added successfully',
      )
    }
    catch (error) {
      setError(error)
    }
  }

  const handleClearAll = async () => {
    try {
      await clearAllStorage()
      setSettings([])
      setSuccess('All settings and cache cleared successfully')
      window.location.reload()
    }
    catch (error) {
      setError(error)
    }
  }

  const modalOverlayStyles = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker overlay
    zIndex: 999,
    transition: 'opacity 0.3s ease-in-out',
    backdropFilter: 'blur(4px)', // Add blur effect
  }

  const modalStyles = {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '600px',
    backgroundColor: colors.neutral[800], // Dark modal background
    boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.6)', // Enhanced shadow
    borderRadius: '16px',
    border: `1px solid ${colors.neutral[700]}`, // Dark border
    padding: spacing[6],
    zIndex: 1000,
    maxHeight: '90vh',
    overflowY: 'auto' as const,
  }

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
  }

  const titleStyles = {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[100], // Light text for dark theme
    margin: 0,
  }

  const settingsListStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[3],
    marginBottom: settings.length > 0 ? spacing[6] : 0,
  }

  const settingItemStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
  }

  const settingInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  }

  const settingDetailsStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[1],
  }

  const settingNameStyles = {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[900],
    margin: 0,
  }

  const settingProviderStyles = {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[500],
    margin: 0,
  }

  const actionsStyles = {
    display: 'flex',
    gap: spacing[2],
  }

  const footerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[4],
    borderTop: `1px solid ${colors.neutral[200]}`,
  }

  const emptyStateStyles = {
    textAlign: 'center' as const,
    padding: spacing[8],
    color: colors.neutral[500],
  }

  return (
    <>
      <div style={modalOverlayStyles} onClick={onClose} />

      <div style={modalStyles}>
        <div style={headerStyles}>
          <h2 style={titleStyles}>API Settings</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M15 5L5 15M5 5l10 10" />
            </svg>
          </Button>
        </div>

        {settings.length === 0
          ? (
              <div style={emptyStateStyles}>
                <div style={{ fontSize: '3rem', marginBottom: spacing[4] }}>
                  ⚙️
                </div>
                <h3
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.neutral[700],
                    marginBottom: spacing[2],
                  }}
                >
                  No API providers configured
                </h3>
                <p style={{ marginBottom: spacing[6] }}>
                  Add an API provider to start chatting with AI about web content.
                </p>
                <Button onClick={handleAdd}>Add First Provider</Button>
              </div>
            )
          : (
              <>
                <div style={settingsListStyles}>
                  {settings.map(setting => (
                    <Card
                      key={`${setting.provider}-${setting.name}`}
                      variant="outlined"
                      hoverable
                    >
                      <div style={settingItemStyles}>
                        <div style={settingInfoStyles}>
                          <div
                            style={{
                              width: spacing[10],
                              height: spacing[10],
                              borderRadius: '50%',
                              background:
                                setting.provider === 'openai'
                                  ? colors.primary[100]
                                  : setting.provider === 'deepseek'
                                    ? colors.ai.gradient.start
                                    : colors.neutral[100],
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: typography.fontSize.lg,
                            }}
                          >
                            {setting.provider === 'openai' ? '🤖' : '🧠'}
                          </div>
                          <div style={settingDetailsStyles}>
                            <h3 style={settingNameStyles}>{setting.name}</h3>
                            <p style={settingProviderStyles}>
                              {API_PROVIDERS.find(p => p.value === setting.provider)?.label
                              || setting.provider}
                              {setting.model && ` • ${setting.model}`}
                            </p>
                          </div>
                        </div>

                        <div style={actionsStyles}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(setting)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(setting)}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 20 20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H3.862a2 2 0 01-1.995-1.858L1 7m3 4v6m4-6v6m4-6v6m5-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1H4a1 1 0 00-1 1v2m13 0H2" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div style={footerStyles}>
                  <Button variant="danger" onClick={handleClearAll}>
                    Clear All Data
                  </Button>
                  <Button onClick={handleAdd}>Add Provider</Button>
                </div>
              </>
            )}

        <SettingEditor
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          setting={editingSetting}
          onSave={handleSaveSetting}
        />
      </div>
    </>
  )
}
