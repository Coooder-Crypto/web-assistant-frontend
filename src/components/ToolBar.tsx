import React from 'react';
import { Box, IconButton, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ApiProvider } from '@src/types';

interface ToolBarProps {
  providers?: { 
    name: string;
    provider: ApiProvider;
    model?: string;
  }[];
  selectedProvider?: string;
  onProviderChange?: (name: string) => Promise<void>;
  onClear: () => void;
  onRefresh: () => void;
  disabled: boolean;
  loading: boolean;
}

export const ToolBar: React.FC<ToolBarProps> = ({
  providers,
  selectedProvider,
  onProviderChange,
  onClear,
  onRefresh,
  disabled,
  loading
}) => {
  return (
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 1,
      borderBottom: 1,
      borderColor: 'divider'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <InputLabel sx={{ 
          color: 'text.primary', 
          fontSize: '0.75rem',
          transform: 'none',
          position: 'static'
        }}>Model:</InputLabel>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={selectedProvider || ''}
            onChange={(e) => onProviderChange?.(e.target.value)}
            disabled={loading}
            size="small"
            MenuProps={{
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              sx: {
                '& .MuiPaper-root': {
                  mb: 0.5,
                  boxShadow: '0 -2px 8px rgba(0,0,0,0.15)'
                }
              }
            }}
            sx={{ 
              height: '32px',
              fontSize: '0.75rem',
              '.MuiSelect-select': {
                padding: '4px 8px'
              }
            }}
          >
            {providers?.map((provider) => (
              <MenuItem 
                key={provider.name}
                value={provider.name}
                sx={{ fontSize: '0.75rem' }}
              >
                {provider.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <IconButton
          onClick={onClear}
          disabled={disabled || loading}
          size="small"
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
        <IconButton
          onClick={onRefresh}
          disabled={loading}
          size="small"
        >
          <RefreshIcon fontSize="inherit"/>
        </IconButton>
      </Box>
    </Box>
  );
};
