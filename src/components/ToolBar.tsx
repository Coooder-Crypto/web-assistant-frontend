import React from 'react';
import { Box, IconButton, FormControl, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ApiProvider } from '@src/types';

interface ToolBarProps {
  providers?: { label: string; value: ApiProvider }[];
  selectedProvider?: ApiProvider;
  onProviderChange?: (provider: ApiProvider) => Promise<void>;
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
      p: 1,
      borderBottom: 1,
      borderColor: 'divider'
    }}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={selectedProvider}
          onChange={(e) => onProviderChange?.(e.target.value as ApiProvider)}
          disabled={loading}
          size="small"
        >
          {providers?.map((provider) => (
            <MenuItem key={provider.value} value={provider.value}>
              {provider.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          onClick={onClear}
          disabled={disabled || loading}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
        <IconButton
          onClick={onRefresh}
          disabled={loading}
          size="small"
        >
          <RefreshIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
