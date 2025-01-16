import type { ApiSettings } from '@src/types'
import { Box } from '@mui/material'
import { useApp } from '@src/hooks/useApp'
import { apiManager } from '@src/utils/api'
import { useCallback, useEffect, useState } from 'react'
import { useContent } from '../hooks/useContent'
import { useMessage } from '../hooks/useMessage'
import {
  getApiSettings,
  getSelectedSetting,
  setSelectedSetting,
} from '../utils/storage'
import ChatBoard from './ChatBoard'
import { ChatInput } from './ChatInput'
import { Header } from './Header'
import Settings from './Settings'
import { ToolBar } from './ToolBar'

export default function Chat() {
  const [settings, setSettings] = useState<ApiSettings[]>([])
  const [setting, setSetting] = useState<ApiSettings | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const {
    pageTitle,
    pageContent,
    error: contentError,
    fetchContent,
    isLoading,
  } = useContent()
  const {
    messages,
    isSending,
    error: messageError,
    sendMessage,
    clearMessages,
  } = useMessage()
  const { setError, setSuccess } = useApp()

  const setGlobalError = useCallback(
    (error: any) => {
      setError(error)
    },
    [setError],
  )

  const setGlobalSuccess = useCallback(
    (message: string | null) => {
      setSuccess(message)
    },
    [setSuccess],
  )

  useEffect(() => {
    if (contentError) {
      setGlobalError(contentError)
    }
  }, [contentError, setGlobalError])

  useEffect(() => {
    if (messageError) {
      setGlobalError(messageError)
    }
  }, [messageError, setGlobalError])

  const loadInitialState = useCallback(async () => {
    try {
      const [currentSetting, settings] = await Promise.all([
        getSelectedSetting(),
        getApiSettings(),
      ])

      if (settings.length === 0) {
        throw new Error(
          'No API providers configured. Please check your settings.',
        )
      }

      const settingToUse = currentSetting || settings[0]
      await apiManager.initAPI(settingToUse.provider, {
        apiKey: settingToUse.apiKey,
        model: settingToUse.model,
        organization: settingToUse.organization,
        project: settingToUse.project,
      })

      setSettings(settings)
      setSetting(settingToUse)
    }
    catch (error) {
      setGlobalError(error)
    }
  }, [setGlobalError])

  useEffect(() => {
    loadInitialState()
  }, [loadInitialState])

  const handleSendMessage = async (content: string) => {
    if (!setting)
      return

    await sendMessage(content, {
      provider: setting.provider,
      pageTitle,
      pageContent,
    })
  }

  const handleProviderChange = async (settingName: string) => {
    try {
      const newSetting = settings.find(s => s.name === settingName)
      if (!newSetting) {
        throw new Error('Selected setting not found')
      }

      setSetting(newSetting)
      await setSelectedSetting(newSetting)

      await apiManager.initAPI(newSetting.provider, {
        apiKey: newSetting.apiKey,
        model: newSetting.model,
        organization: newSetting.organization,
        project: newSetting.project,
      })

      setGlobalSuccess(`Successfully switched to ${newSetting.name}`)
    }
    catch (error) {
      setGlobalError(error)
    }
  }

  const handleRefresh = () => {
    fetchContent()
      .then(() => {
        setGlobalSuccess('Page content refreshed')
      })
      .catch((error) => {
        setGlobalError(error)
      })
  }

  const handleCloseSettings = () => {
    setIsSettingsOpen(false)
    loadInitialState()
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Header
        pageTitle={pageTitle || 'Web Assistant'}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <ChatBoard messages={messages} isSending={isSending} />
        <ToolBar
          providers={settings}
          selectedProvider={setting?.name || ''}
          onProviderChange={handleProviderChange}
          onClear={clearMessages}
          onRefresh={handleRefresh}
          disabled={messages.length === 0}
          loading={isLoading || isSending}
        />
        <ChatInput onSend={handleSendMessage} disabled={isSending} />
      </Box>

      {isSettingsOpen && <Settings onClose={handleCloseSettings} />}
    </Box>
  )
}
