import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  TextField, 
  Button, 
  Box, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { getApiSettings, setApiSettings, ApiSettings } from '../utils/storage';
import { useApp } from '../store/AppContext';
import { ApiProvider } from '@src/types';

interface SettingsProps {
  onSaved?: () => void;
  onClose: () => void;
}

const API_PROVIDERS = [
  { label: 'Deepseek', value: 'deepseek' },
  { label: 'ChatGPT', value: 'openai' },
  { label: 'Claude', value: 'anthropic' },
] as const;

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

    const names = settings.map(s => s.name.trim());
    const hasDuplicates = names.some((name, index) => names.indexOf(name) !== index);
    if (hasDuplicates) {
      setError('Duplicate API names are not allowed');
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
      <Dialog open fullWidth maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open 
      onClose={onClose}
      fullWidth 
      maxWidth="sm"
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Settings
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} component="form" onSubmit={handleSubmit}>
          {settings.map((setting, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={setting.name}
                    onChange={(e) => handleUpdateSetting(index, 'name', e.target.value)}
                    placeholder="API Name"
                    label="Name"
                  />
                  <IconButton
                    onClick={() => handleRemoveApi(index)}
                    disabled={settings.length === 1}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <FormControl fullWidth size="small">
                  <InputLabel>Provider</InputLabel>
                  <Select
                    value={setting.provider}
                    label="Provider"
                    onChange={(e) => handleUpdateSetting(index, 'provider', e.target.value)}
                  >
                    {API_PROVIDERS.map((provider) => (
                      <MenuItem key={provider.value} value={provider.value}>
                        {provider.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  size="small"
                  type={editingKey === `${index}` ? 'text' : 'password'}
                  value={setting.apiKey}
                  onChange={(e) => handleUpdateSetting(index, 'apiKey', e.target.value)}
                  placeholder="API Key"
                  label="API Key"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setEditingKey(editingKey === `${index}` ? '' : `${index}`)}
                          edge="end"
                          size="small"
                        >
                          {editingKey === `${index}` ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Paper>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', p: 2, gap: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddApi}
        >
          Add New API
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
