import { Badge, Button, colors, radius, spacing, typography } from '@src/ui'

interface HeaderProps {
  pageTitle: string
  onSettingsClick: () => void
  isConnected?: boolean
}

export function Header({ pageTitle, onSettingsClick, isConnected = true }: HeaderProps) {
  const headerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing[4]} ${spacing[6]}`,
    borderBottom: `1px solid ${colors.neutral[700]}`, // Dark border
    backgroundColor: colors.neutral[800], // Dark header bg
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
  }

  const titleSectionStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
    minWidth: 0,
  }

  const logoStyles = {
    width: spacing[8],
    height: spacing[8],
    borderRadius: radius.lg,
    background: `linear-gradient(147deg, ${colors.ai.gradient.start} 15.77%, ${colors.primary[700]} 55.39%, ${colors.primary[800]} 72.27%, ${colors.ai.gradient.end} 84.67%)`, // Modern gradient
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.neutral[0],
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.lg,
    boxShadow: '0px 8px 16px 0px rgba(0, 0, 0, 0.4)', // Deep shadow
  }

  const titleContainerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    minWidth: 0,
  }

  const titleStyles = {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[100], // Light text for dark theme
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  }

  const subtitleStyles = {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[300], // Light gray for dark theme
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
  }

  const actionSectionStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
  }

  return (
    <header style={headerStyles}>
      <div style={titleSectionStyles}>
        <div style={logoStyles}>
          AI
        </div>
        <div style={titleContainerStyles}>
          <h1 style={titleStyles} title={pageTitle}>
            {pageTitle}
          </h1>
          <p style={subtitleStyles}>
            <Badge
              variant={isConnected ? 'success' : 'error'}
              size="sm"
              dot
            >
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </p>
        </div>
      </div>

      <div style={actionSectionStyles}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSettingsClick}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M10 1v6m0 6v6m-7-9h6m6 0h6M7 10a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" />
          </svg>
          Settings
        </Button>
      </div>
    </header>
  )
}
