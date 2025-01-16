import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { API_PROVIDERS, ApiProvider, ApiSettings } from "@src/types";
import { useEffect, useState } from "react";

import CloseIcon from '@mui/icons-material/Close';

interface SettingEditorProps {
    open: boolean;
    onClose: () => void;
    setting?: ApiSettings;
    onSave: (setting: ApiSettings) => void;
  }
  
export default function SettingEditor({ open, onClose, setting, onSave }: SettingEditorProps) {
    const [editedSetting, setEditedSetting] = useState<ApiSettings>({
      name: '',
      provider: 'deepseek',
      apiKey: '',
      ...setting,
    });
  
    useEffect(() => {
      setEditedSetting({
        name: '',
        provider: 'deepseek',
        apiKey: '',
        ...setting,
      });
    }, [setting]);
  
    const handleSave = () => {
      if (!editedSetting.name.trim() || !editedSetting.apiKey.trim()) {
        return;
      }
      onSave(editedSetting);
      onClose();
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">{setting ? 'Edit API Setting' : 'Add API Setting'}</Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1,fontSize: '0.75rem' }}>
            <TextField
              label="Name"
              value={editedSetting.name}
              onChange={(e) => setEditedSetting(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Provider</InputLabel>
              <Select
                value={editedSetting.provider}
                label="Provider"
                onChange={(e) => setEditedSetting(prev => ({ ...prev, provider: e.target.value as ApiProvider }))}
              >
                {API_PROVIDERS.map((provider) => (
                  <MenuItem key={provider.value} value={provider.value}>
                    {provider.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="API Key"
              value={editedSetting.apiKey}
              onChange={(e) => setEditedSetting(prev => ({ ...prev, apiKey: e.target.value }))}
              fullWidth
              multiline
              rows={3}
            />
            {editedSetting.provider === 'openai' && (
              <>
                <TextField
                  label="Organization ID (Optional)"
                  value={editedSetting.organization || ''}
                  onChange={(e) => setEditedSetting(prev => ({ ...prev, organization: e.target.value }))}
                  fullWidth
                  helperText="Your OpenAI organization ID (if you belong to multiple organizations)"
                />
                <TextField
                  label="Project ID (Optional)"
                  value={editedSetting.project || ''}
                  onChange={(e) => setEditedSetting(prev => ({ ...prev, project: e.target.value }))}
                  fullWidth
                  helperText="Your OpenAI project ID (recommended for improved security)"
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!editedSetting.name.trim() || !editedSetting.apiKey.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }