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
  Typography,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { getApiSettings, setApiSettings } from '../utils/storage';
import { useApp } from '../store/AppContext';
import { API_PROVIDERS, ApiProvider, ApiSettings } from '@src/types';

interface SettingsProps {
  onSaved?: () => void;
  onClose: () => void;
}

export default function Settings({ onSaved, onClose }: SettingsProps){
  const [settings, setSettings] = useState<ApiSettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<ApiSettings | null>(null);
  const { setError, setSuccess } = useApp();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await getApiSettings();
      setSettings(savedSettings);
    } catch (error) {
      setError('Failed to load API settings');
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddApi = () => {
    setEditingItem({ name: '', provider: 'deepseek', apiKey: '' });
    setEditingIndex(settings.length);
    setEditDialogOpen(true);
  };

  const handleRemoveApi = (index: number) => {
    const newSettings = [...settings];
    newSettings.splice(index, 1);
    setSettings(newSettings);
  };

  const handleEditSetting = (index: number) => {
    setEditingItem({ ...settings[index] });
    setEditingIndex(index);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingItem) {
      const newSettings = [...settings];
      if (editingIndex === settings.length) {
        newSettings.push(editingItem);
      } else {
        newSettings[editingIndex] = editingItem;
      }
      setSettings(newSettings);
      setEditDialogOpen(false);
      setEditingIndex(null);
      setEditingItem(null);
    }
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

  return (
    <Dialog 
      open 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ p: 1.5, pb: 1 }}>
        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 500 }}>Settings</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ 
            position: 'absolute', 
            right: 6, 
            top: 6,
            padding: '4px'
          }}
        >
          <CloseIcon sx={{ fontSize: '1.2rem' }} />
        </IconButton>
      </DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 1.5 }}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" p={1.5}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Stack spacing={1}>
              {settings.map((setting, index) => (
                <Paper 
                  key={index} 
                  elevation={0} 
                  sx={{ 
                    p: 1.25,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{setting.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mt: 0.25 }}>
                        {API_PROVIDERS.find(p => p.value === setting.provider)?.label}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.25 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditSetting(index)}
                        sx={{ 
                          padding: '4px',
                          '&:hover': {
                            bgcolor: 'action.hover'
                          }
                        }}
                      >
                        <EditIcon sx={{ fontSize: '1rem' }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveApi(index)}
                        sx={{ 
                          padding: '4px',
                          '&:hover': {
                            bgcolor: 'action.hover'
                          }
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: '1rem' }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))}
              <Button
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                onClick={handleAddApi}
                variant="outlined"
                fullWidth
                size="small"
                sx={{ 
                  fontSize: '0.875rem', 
                  py: 0.5,
                  mt: 0.5,
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Add API Key
              </Button>
            </Stack>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 1, gap: 0.5 }}>
          <Button 
            onClick={onClose} 
            size="small" 
            sx={{ 
              fontSize: '0.875rem',
              minWidth: '60px',
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            size="small" 
            sx={{ 
              fontSize: '0.875rem',
              minWidth: '60px',
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Save
          </Button>
        </DialogActions>
      </form>

      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ p: 1.5, pb: 1 }}>
          <Typography variant="h6" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {editingIndex === settings.length ? 'Add API Key' : 'Edit API Key'}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 1.5 }}>
          <Stack spacing={1.5} sx={{ mt: 0.5 }}>
            <TextField
              label="Name"
              fullWidth
              value={editingItem?.name || ''}
              onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.875rem'
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: '0.875rem'
                }
              }}
            />
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: '0.875rem' }}>Provider</InputLabel>
              <Select
                value={editingItem?.provider || ''}
                onChange={(e) => setEditingItem(prev => prev ? { ...prev, provider: e.target.value as ApiProvider } : null)}
                label="Provider"
                sx={{
                  borderRadius: 2,
                  fontSize: '0.875rem'
                }}
              >
                {API_PROVIDERS.map((provider) => (
                  <MenuItem 
                    key={provider.value} 
                    value={provider.value}
                    sx={{ fontSize: '0.875rem' }}
                  >
                    {provider.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="API Key"
              fullWidth
              value={editingItem?.apiKey || ''}
              onChange={(e) => setEditingItem(prev => prev ? { ...prev, apiKey: e.target.value } : null)}
              size="small"
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.875rem'
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: '0.875rem'
                }
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 1, gap: 0.5 }}>
          <Button 
            onClick={() => setEditDialogOpen(false)} 
            size="small"
            sx={{ 
              fontSize: '0.875rem',
              minWidth: '60px',
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained" 
            size="small"
            sx={{ 
              fontSize: '0.875rem',
              minWidth: '60px',
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};


