import { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { Settings } from './Settings';

interface HeaderProps {
  pageTitle: string;
  onSettingsClick: () => void;
}

export function Header({ pageTitle, onSettingsClick }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);

  const truncateTitle = (title: string) => {
    return title.length > 30 ? title.substring(0, 30) + '...' : title;
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        color="inherit" 
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Toolbar 
          variant="dense"
          sx={{ 
            justifyContent: 'space-between',
            minHeight: '48px'
          }}
        >
          <Typography 
            variant="subtitle1" 
            component="h1" 
            noWrap
            sx={{ 
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            {pageTitle ? truncateTitle(pageTitle) : 'Web Assistant'}
          </Typography>
          <Box>
            <IconButton
              onClick={() => setShowSettings(true)}
              size="small"
              edge="end"
              color="inherit"
              aria-label="settings"
              sx={{ padding: '6px' }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </>
  );
}