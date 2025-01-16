import SettingsIcon from '@mui/icons-material/Settings'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'

interface HeaderProps {
  pageTitle: string
  onSettingsClick: () => void
}

export function Header({ pageTitle, onSettingsClick }: HeaderProps) {
  const truncateTitle = (title: string) => {
    return title.length > 30 ? `${title.substring(0, 30)}...` : title
  }

  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{
            flexGrow: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {truncateTitle(pageTitle)}
        </Typography>
        <Box>
          <IconButton
            onClick={onSettingsClick}
            size="small"
            edge="end"
            color="inherit"
            aria-label="settings"
          >
            <SettingsIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
