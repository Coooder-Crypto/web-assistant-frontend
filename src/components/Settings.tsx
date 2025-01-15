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
      <DialogTitle 
        sx={{ 
          m: 0, 
          p: 1.5, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: '0.875rem'
        }}
      >
        Settings
        <IconButton
          aria-label="close"
          onClick={onClose}
          size="small"
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 1.5 }}>
        <Stack spacing={1.5} component="form" onSubmit={handleSubmit}>
          {settings.map((setting, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 1.5 }}>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    label="Name"
                    value={setting.name}
                    onChange={(e) => handleUpdateSetting(index, 'name', e.target.value)}
                    required
                    fullWidth
                    InputLabelProps={{
                      sx: { fontSize: '0.75rem' }
                    }}
                    inputProps={{
                      sx: { fontSize: '0.75rem' }
                    }}
                  />
                  <FormControl required fullWidth size="small">
                    <InputLabel sx={{ fontSize: '0.75rem' }}>Provider</InputLabel>
                    <Select
                      value={setting.provider}
                      label="Provider"
                      onChange={(e) => handleUpdateSetting(index, 'provider', e.target.value)}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {API_PROVIDERS.map((provider) => (
                        <MenuItem 
                          key={provider.value} 
                          value={provider.value}
                          sx={{ fontSize: '0.75rem' }}
                        >
                          {provider.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton 
                    onClick={() => handleRemoveApi(index)}
                    size="small"
                    sx={{ alignSelf: 'center' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  size="small"
                  label="API Key"
                  value={setting.apiKey}
                  onChange={(e) => handleUpdateSetting(index, 'apiKey', e.target.value)}
                  required
                  fullWidth
                  type={editingKey === `${index}` ? 'text' : 'password'}
                  InputProps={{
                    sx: { fontSize: '0.75rem' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setEditingKey(editingKey === `${index}` ? '' : `${index}`)}
                          edge="end"
                        >
                          {editingKey === `${index}` ? (
                            <VisibilityOffIcon fontSize="small" />
                          ) : (
                            <VisibilityIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  InputLabelProps={{
                    sx: { fontSize: '0.75rem' }
                  }}
                />
              </Stack>
            </Paper>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddApi}
            variant="outlined"
            fullWidth
            size="small"
            sx={{ fontSize: '0.75rem' }}
          >
            Add API
          </Button>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 1.5 }}>
        <Button 
          onClick={onClose}
          size="small"
          sx={{ fontSize: '0.75rem' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          size="small"
          sx={{ fontSize: '0.75rem' }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
