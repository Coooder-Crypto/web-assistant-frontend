import type { ApiSettings } from '@src/types'
import AddIcon from '@mui/icons-material/AddCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { useApp } from '@src/hooks/useApp'
import { API_PROVIDERS } from '@src/types'
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
        // Edit existing setting
        newSettings = settings.map(s =>
          s.name === editingSetting.name
          && s.provider === editingSetting.provider
            ? newSetting
            : s,
        )
      }
      else {
        // Add new setting
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

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 999,
          transition: 'opacity 0.3s ease-in-out',
        }}
        onClick={onClose}
      />

      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '500px',
          bgcolor: 'background.paper',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
          borderRadius: 3,
          p: 3,
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-in-out',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', userSelect: 'none' }}
          >
            API Settings
          </Typography>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              'color': 'grey.600',
              '&:hover': { color: 'grey.800' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ width: '100%' }}>
          {settings.map(setting => (
            <React.Fragment key={`${setting.provider}-${setting.name}`}>
              <ListItem
                sx={{
                  'borderRadius': 3,
                  '&:hover': { bgcolor: 'grey.100' },
                }}
                secondaryAction={(
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEdit(setting)}
                      sx={{
                        '&:hover': { color: 'primary.dark' },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(setting)}
                      sx={{
                        '&:hover': { color: 'error.dark' },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              >
                <ListItemText
                  primary={setting.name}
                  secondary={
                    API_PROVIDERS.find(p => p.value === setting.provider)
                      ?.label || setting.provider
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
          <ListItem
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 2,
              fontSize: '0.5rem',
            }}
          >
            <Button
              color="error"
              startIcon={<DeleteForeverIcon />}
              onClick={handleClearAll}
              variant="outlined"
              sx={{
                fontSize: '0.75rem',
              }}
            >
              Clear
            </Button>
            <Button
              color="primary"
              variant="outlined"
              aria-label="add api setting"
              onClick={handleAdd}
              startIcon={<AddIcon />}
              sx={{
                fontSize: '0.75rem',
              }}
            >
              Create
            </Button>
          </ListItem>
        </List>

        <SettingEditor
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          setting={editingSetting}
          onSave={handleSaveSetting}
        />
      </Box>
    </>
  )
}
