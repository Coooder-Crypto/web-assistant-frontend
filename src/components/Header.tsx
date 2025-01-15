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
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="h1" noWrap>
            {pageTitle || 'Web Assistant'}
          </Typography>
          <Box>
            <IconButton
              onClick={() => setShowSettings(true)}
              size="large"
              edge="end"
              color="inherit"
              aria-label="settings"
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </>
  );
}